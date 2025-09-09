const { client } = require('../config/elasticsearch');
const Product = require('../models/product');
const fallbackService = require('./fallbackSearchService');

// Biến để kiểm tra Elasticsearch có khả dụng không
let elasticsearchAvailable = false;

// Kiểm tra kết nối Elasticsearch
const checkElasticsearchConnection = async () => {
    try {
        await client.ping();
        elasticsearchAvailable = true;
        console.log('✅ Elasticsearch is available');
        return true;
    } catch (error) {
        elasticsearchAvailable = false;
        console.log('⚠️ Elasticsearch not available, using MongoDB fallback');
        return false;
    }
};

// Khởi tạo kiểm tra kết nối
checkElasticsearchConnection();

// Tìm kiếm sản phẩm với Fuzzy Search
const fuzzySearchProducts = async (searchTerm, page = 1, limit = 10, filters = {}) => {
    // Sử dụng fallback nếu Elasticsearch không khả dụng
    if (!elasticsearchAvailable) {
        return await fallbackService.fuzzySearchProducts(searchTerm, page, limit, filters);
    }

    try {
        const from = (page - 1) * limit;
        
        // Xây dựng query cho fuzzy search
        const query = {
            bool: {
                must: [
                    {
                        bool: {
                            should: [
                                // Tìm kiếm chính xác
                                {
                                    multi_match: {
                                        query: searchTerm,
                                        fields: ['name^3', 'description^2', 'category^1.5'],
                                        type: 'phrase',
                                        boost: 3
                                    }
                                },
                                // Tìm kiếm fuzzy (có lỗi chính tả)
                                {
                                    multi_match: {
                                        query: searchTerm,
                                        fields: ['name^2', 'description^1.5', 'category^1'],
                                        type: 'best_fields',
                                        fuzziness: 'AUTO',
                                        boost: 2
                                    }
                                },
                                // Tìm kiếm prefix
                                {
                                    multi_match: {
                                        query: searchTerm,
                                        fields: ['name^1.5', 'description^1'],
                                        type: 'phrase_prefix',
                                        boost: 1.5
                                    }
                                },
                                // Tìm kiếm wildcard
                                {
                                    wildcard: {
                                        'name.keyword': {
                                            value: `*${searchTerm.toLowerCase()}*`,
                                            boost: 1
                                        }
                                    }
                                }
                            ],
                            minimum_should_match: 1
                        }
                    }
                ],
                filter: [
                    { term: { isActive: true } }
                ]
            }
        };

        // Thêm các bộ lọc
        if (filters.category && filters.category !== 'all') {
            query.bool.filter.push({ term: { category: filters.category } });
        }

        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            const priceRange = {};
            if (filters.minPrice !== undefined) priceRange.gte = filters.minPrice;
            if (filters.maxPrice !== undefined) priceRange.lte = filters.maxPrice;
            query.bool.filter.push({ range: { price: priceRange } });
        }

        if (filters.minRating !== undefined) {
            query.bool.filter.push({ range: { rating: { gte: filters.minRating } } });
        }

        if (filters.minDiscount !== undefined) {
            query.bool.filter.push({ range: { discount: { gte: filters.minDiscount } } });
        }

        if (filters.inStock) {
            query.bool.filter.push({ range: { stock: { gt: 0 } } });
        }

        if (filters.tags && filters.tags.length > 0) {
            query.bool.filter.push({ terms: { tags: filters.tags } });
        }

        if (filters.minViewCount !== undefined) {
            query.bool.filter.push({ range: { viewCount: { gte: filters.minViewCount } } });
        }

        const searchBody = {
            index: 'products',
            body: {
                query,
                from,
                size: limit,
                sort: [
                    { _score: { order: 'desc' } },
                    { rating: { order: 'desc' } },
                    { viewCount: { order: 'desc' } }
                ],
                highlight: {
                    fields: {
                        name: {},
                        description: {}
                    },
                    pre_tags: ['<mark>'],
                    post_tags: ['</mark>']
                }
            }
        };

        const response = await client.search(searchBody);
        
        const products = response.hits.hits.map(hit => ({
            ...hit._source,
            _score: hit._score,
            highlight: hit.highlight
        }));

        const total = response.hits.total.value;
        const totalPages = Math.ceil(total / limit);

        return {
            EC: 0,
            EM: 'Tìm kiếm sản phẩm thành công',
            DT: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                },
                searchTerm,
                filters
            }
        };
    } catch (error) {
        console.log('Error in fuzzy search:', error);
        return {
            EC: 1,
            EM: 'Lỗi khi tìm kiếm sản phẩm',
            DT: null
        };
    }
};

// Lọc sản phẩm với nhiều điều kiện
const filterProducts = async (filters = {}, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc') => {
    // Sử dụng fallback nếu Elasticsearch không khả dụng
    if (!elasticsearchAvailable) {
        return await fallbackService.filterProducts(filters, page, limit, sortBy, sortOrder);
    }

    try {
        const from = (page - 1) * limit;
        
        const query = {
            bool: {
                must: [],
                filter: [
                    { term: { isActive: true } }
                ]
            }
        };

        // Tìm kiếm theo tên hoặc mô tả
        if (filters.search) {
            query.bool.must.push({
                multi_match: {
                    query: filters.search,
                    fields: ['name^2', 'description^1'],
                    type: 'best_fields',
                    fuzziness: 'AUTO'
                }
            });
        }

        // Bộ lọc danh mục
        if (filters.category && filters.category !== 'all') {
            query.bool.filter.push({ term: { category: filters.category } });
        }

        // Bộ lọc giá
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            const priceRange = {};
            if (filters.minPrice !== undefined) priceRange.gte = filters.minPrice;
            if (filters.maxPrice !== undefined) priceRange.lte = filters.maxPrice;
            query.bool.filter.push({ range: { price: priceRange } });
        }

        // Bộ lọc đánh giá
        if (filters.minRating !== undefined) {
            query.bool.filter.push({ range: { rating: { gte: filters.minRating } } });
        }

        // Bộ lọc khuyến mãi
        if (filters.minDiscount !== undefined) {
            query.bool.filter.push({ range: { discount: { gte: filters.minDiscount } } });
        }

        // Bộ lọc tồn kho
        if (filters.inStock) {
            query.bool.filter.push({ range: { stock: { gt: 0 } } });
        }

        // Bộ lọc tags
        if (filters.tags && filters.tags.length > 0) {
            query.bool.filter.push({ terms: { tags: filters.tags } });
        }

        if (filters.minViewCount !== undefined) {
            query.bool.filter.push({ range: { viewCount: { gte: filters.minViewCount } } });
        }

        // Bộ lọc theo ngày tạo
        if (filters.dateFrom || filters.dateTo) {
            const dateRange = {};
            if (filters.dateFrom) dateRange.gte = filters.dateFrom;
            if (filters.dateTo) dateRange.lte = filters.dateTo;
            query.bool.filter.push({ range: { createdAt: dateRange } });
        }

        // Sắp xếp
        const sort = [];
        switch (sortBy) {
            case 'price':
                sort.push({ price: { order: sortOrder } });
                break;
            case 'rating':
                sort.push({ rating: { order: sortOrder } });
                break;
            case 'viewCount':
                sort.push({ viewCount: { order: sortOrder } });
                break;
            case 'discount':
                sort.push({ discount: { order: sortOrder } });
                break;
            case 'name':
                sort.push({ 'name.keyword': { order: sortOrder } });
                break;
            default:
                sort.push({ createdAt: { order: sortOrder } });
        }

        const searchBody = {
            index: 'products',
            body: {
                query,
                from,
                size: limit,
                sort
            }
        };

        const response = await client.search(searchBody);
        
        const products = response.hits.hits.map(hit => hit._source);
        const total = response.hits.total.value;
        const totalPages = Math.ceil(total / limit);

        return {
            EC: 0,
            EM: 'Lọc sản phẩm thành công',
            DT: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                },
                filters,
                sortBy,
                sortOrder
            }
        };
    } catch (error) {
        console.log('Error in filter products:', error);
        return {
            EC: 1,
            EM: 'Lỗi khi lọc sản phẩm',
            DT: null
        };
    }
};

// Gợi ý tìm kiếm (Auto-complete)
const getSearchSuggestions = async (searchTerm, limit = 10) => {
    // Sử dụng fallback nếu Elasticsearch không khả dụng
    if (!elasticsearchAvailable) {
        return await fallbackService.getSearchSuggestions(searchTerm, limit);
    }

    try {
        const response = await client.search({
            index: 'products',
            body: {
                suggest: {
                    product_suggest: {
                        prefix: searchTerm,
                        completion: {
                            field: 'name.suggest',
                            size: limit,
                            skip_duplicates: true
                        }
                    }
                }
            }
        });

        const suggestions = response.suggest.product_suggest[0].options.map(option => ({
            text: option.text,
            score: option._score
        }));

        return {
            EC: 0,
            EM: 'Lấy gợi ý tìm kiếm thành công',
            DT: suggestions
        };
    } catch (error) {
        console.log('Error getting search suggestions:', error);
        return {
            EC: 1,
            EM: 'Lỗi khi lấy gợi ý tìm kiếm',
            DT: null
        };
    }
};

// Lấy các giá trị filter có thể có
const getFilterOptions = async () => {
    // Sử dụng fallback nếu Elasticsearch không khả dụng
    if (!elasticsearchAvailable) {
        return await fallbackService.getFilterOptions();
    }

    try {
        const response = await client.search({
            index: 'products',
            body: {
                size: 0,
                aggs: {
                    categories: {
                        terms: { field: 'category', size: 100 }
                    },
                    price_range: {
                        stats: { field: 'price' }
                    },
                    rating_range: {
                        stats: { field: 'rating' }
                    },
                    discount_range: {
                        stats: { field: 'discount' }
                    },
                    tags: {
                        terms: { field: 'tags', size: 100 }
                    }
                }
            }
        });

        const aggs = response.aggregations;
        
        return {
            EC: 0,
            EM: 'Lấy tùy chọn lọc thành công',
            DT: {
                categories: aggs.categories.buckets.map(bucket => bucket.key),
                priceRange: {
                    min: aggs.price_range.min,
                    max: aggs.price_range.max
                },
                ratingRange: {
                    min: aggs.rating_range.min,
                    max: aggs.rating_range.max
                },
                discountRange: {
                    min: aggs.discount_range.min,
                    max: aggs.discount_range.max
                },
                tags: aggs.tags.buckets.map(bucket => bucket.key)
            }
        };
    } catch (error) {
        console.log('Error getting filter options:', error);
        return {
            EC: 1,
            EM: 'Lỗi khi lấy tùy chọn lọc',
            DT: null
        };
    }
};

// Đồng bộ sản phẩm từ MongoDB sang Elasticsearch
const syncProductToElasticsearch = async (productId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return { EC: 2, EM: 'Không tìm thấy sản phẩm', DT: null };
        }

        const productDoc = {
            id: product._id.toString(),
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
            stock: product.stock,
            rating: product.rating,
            viewCount: product.viewCount || 0,
            isActive: product.isActive,
            tags: product.tags || [],
            discount: product.discount || 0,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };

        await client.index({
            index: 'products',
            id: product._id.toString(),
            body: productDoc
        });

        return { EC: 0, EM: 'Đồng bộ sản phẩm thành công', DT: productDoc };
    } catch (error) {
        console.log('Error syncing product to Elasticsearch:', error);
        return { EC: 1, EM: 'Lỗi khi đồng bộ sản phẩm', DT: null };
    }
};

// Xóa sản phẩm khỏi Elasticsearch
const deleteProductFromElasticsearch = async (productId) => {
    try {
        await client.delete({
            index: 'products',
            id: productId
        });

        return { EC: 0, EM: 'Xóa sản phẩm khỏi Elasticsearch thành công', DT: null };
    } catch (error) {
        console.log('Error deleting product from Elasticsearch:', error);
        return { EC: 1, EM: 'Lỗi khi xóa sản phẩm khỏi Elasticsearch', DT: null };
    }
};

module.exports = {
    fuzzySearchProducts,
    filterProducts,
    getSearchSuggestions,
    getFilterOptions,
    syncProductToElasticsearch,
    deleteProductFromElasticsearch
};
