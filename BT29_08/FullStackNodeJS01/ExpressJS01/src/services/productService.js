const Product = require('../models/Product');
const { client, indexProduct, deleteProduct, searchProducts } = require('../config/elasticsearch');

const createProductService = async (productData) => {
    try {
        const product = await Product.create(productData);
        
        // Index to Elasticsearch (if enabled)
        if (client) {
            try {
                await indexProduct(product);
            } catch (esError) {
                console.log('Elasticsearch indexing error:', esError);
            }
        }
        
        return product;
    } catch (error) {
        console.log('Create product error:', error);
        return null;
    }
};

const getProductsService = async (page = 1, limit = 10, category = null, sortBy = 'createdAt', sortOrder = 'desc') => {
    try {
        const query = {};
        if (category) {
            query.category = category;
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const products = await Product.find(query)
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Product.countDocuments(query);

        return {
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        };
    } catch (error) {
        console.log('Get products error:', error);
        return null;
    }
};

const getProductByIdService = async (id) => {
    try {
        const product = await Product.findById(id);
        if (product) {
            // Tăng view count
            await Product.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
        }
        return product;
    } catch (error) {
        console.log('Get product by ID error:', error);
        return null;
    }
};

const updateProductService = async (id, updateData) => {
    try {
        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        
        if (product && client) {
            // Update Elasticsearch (if enabled)
            try {
                await indexProduct(product);
            } catch (esError) {
                console.log('Elasticsearch update error:', esError);
            }
        }
        
        return product;
    } catch (error) {
        console.log('Update product error:', error);
        return null;
    }
};

const deleteProductService = async (id) => {
    try {
        const product = await Product.findByIdAndDelete(id);
        
        if (product && client) {
            // Delete from Elasticsearch (if enabled)
            try {
                await deleteProduct(id);
            } catch (esError) {
                console.log('Elasticsearch delete error:', esError);
            }
        }
        
        return product;
    } catch (error) {
        console.log('Delete product error:', error);
        return null;
    }
};

const searchProductsWithElasticsearchService = async (query, page = 1, limit = 10, filters = {}) => {
    try {
        // If Elasticsearch is disabled, fallback to MongoDB search
        if (!client) {
            console.log('Elasticsearch is disabled, using MongoDB search');
            return await searchProductsWithMongoDBService(query, page, limit, filters);
        }

        const searchFilters = {
            page: page,
            limit: limit,
            ...filters
        };

        const response = await searchProducts(query, searchFilters);
        
        if (!response) {
            // Fallback to MongoDB if Elasticsearch fails
            return await searchProductsWithMongoDBService(query, page, limit, filters);
        }

        return {
            products: response.hits,
            total: response.total,
            totalPages: Math.ceil(response.total / limit),
            currentPage: page
        };
    } catch (error) {
        console.log('Elasticsearch search error:', error);
        // Fallback to MongoDB search
        return await searchProductsWithMongoDBService(query, page, limit, filters);
    }
};

const searchProductsWithMongoDBService = async (query, page = 1, limit = 10, filters = {}) => {
    try {
        let searchQuery = {};
        let sortQuery = {};

        // Text search với fuzzy matching
        if (query && query.trim()) {
            const searchTerm = query.trim();
            
            // Tạo fuzzy patterns cho tìm kiếm gần đúng
            const createFuzzyPatterns = (term) => {
                const patterns = [];
                
                // Exact match
                patterns.push(term);
                
                // Nếu từ có ít nhất 4 ký tự, tạo các biến thể fuzzy
                if (term.length >= 4) {
                    // Bỏ 1 ký tự cuối (galay -> gala)
                    patterns.push(term.slice(0, -1));
                    
                    // Thêm 1 ký tự bất kỳ ở cuối (galay -> galay.*)
                    patterns.push(term + '.*');
                    
                    // Bỏ 1 ký tự ở giữa (galaxy -> galay)
                    if (term.length > 4) {
                        for (let i = 1; i < term.length - 1; i++) {
                            patterns.push(term.slice(0, i) + term.slice(i + 1));
                        }
                    }
                    
                    // Thêm 1 ký tự bất kỳ ở giữa (galay -> ga.lay)
                    if (term.length > 3) {
                        for (let i = 1; i < term.length; i++) {
                            patterns.push(term.slice(0, i) + '.' + term.slice(i));
                        }
                    }
                }
                
                return [...new Set(patterns)]; // Remove duplicates
            };
            
            const fuzzyPatterns = createFuzzyPatterns(searchTerm);
            console.log('🔍 Fuzzy patterns for "' + searchTerm + '":', fuzzyPatterns);
            
            // Tạo regex patterns
            const regexPatterns = fuzzyPatterns.map(pattern => new RegExp(pattern, 'i'));
            
            searchQuery.$or = [
                { name: { $in: regexPatterns } },
                { description: { $in: regexPatterns } },
                { tags: { $in: regexPatterns } },
                { category: { $in: regexPatterns } }
            ];
        }

        // Lọc theo danh mục
        if (filters.category && filters.category !== '') {
            searchQuery.category = filters.category;
        }

        // Lọc theo khoảng giá
        if ((filters.minPrice && filters.minPrice !== '') || (filters.maxPrice && filters.maxPrice !== '')) {
            searchQuery.price = {};
            if (filters.minPrice && filters.minPrice !== '') searchQuery.price.$gte = parseFloat(filters.minPrice);
            if (filters.maxPrice && filters.maxPrice !== '') searchQuery.price.$lte = parseFloat(filters.maxPrice);
        }

        // Lọc theo khoảng khuyến mãi
        if ((filters.minDiscount && filters.minDiscount !== '') || (filters.maxDiscount && filters.maxDiscount !== '')) {
            searchQuery.discount = {};
            if (filters.minDiscount && filters.minDiscount !== '') searchQuery.discount.$gte = parseInt(filters.minDiscount);
            if (filters.maxDiscount && filters.maxDiscount !== '') searchQuery.discount.$lte = parseInt(filters.maxDiscount);
        }

        // Lọc theo khoảng lượt xem
        if ((filters.minViews && filters.minViews !== '') || (filters.maxViews && filters.maxViews !== '')) {
            searchQuery.viewCount = {};
            if (filters.minViews && filters.minViews !== '') searchQuery.viewCount.$gte = parseInt(filters.minViews);
            if (filters.maxViews && filters.maxViews !== '') searchQuery.viewCount.$lte = parseInt(filters.maxViews);
        }

        // Lọc theo tình trạng còn hàng
        if (filters.inStock && filters.inStock !== '') {
            searchQuery.inStock = filters.inStock === 'true' || filters.inStock === true;
        }

        // Sắp xếp
        if (filters.sortBy && filters.sortBy !== '') {
            const sortField = filters.sortBy;
            const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
            sortQuery[sortField] = sortOrder;
        } else {
            // Mặc định sắp xếp theo relevance nếu có query, theo viewCount nếu không
            if (query && query.trim()) {
                sortQuery = { viewCount: -1, createdAt: -1 };
            } else {
                sortQuery = { viewCount: -1, createdAt: -1 };
            }
        }

        console.log('🔍 MongoDB Search Query:', JSON.stringify(searchQuery, null, 2));
        console.log('🔍 MongoDB Sort Query:', JSON.stringify(sortQuery, null, 2));
        
        const products = await Product.find(searchQuery)
            .sort(sortQuery)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Product.countDocuments(searchQuery);

        return {
            products,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    } catch (error) {
        console.log('MongoDB search error:', error);
        return null;
    }
};

const getCategoriesService = async () => {
    try {
        const categories = await Product.distinct('category');
        return categories;
    } catch (error) {
        console.log('Get categories error:', error);
        return null;
    }
};

const getPopularProductsService = async (limit = 10) => {
    try {
        const products = await Product.find({ inStock: true })
            .sort({ viewCount: -1 })
            .limit(limit)
            .exec();
        return products;
    } catch (error) {
        console.log('Get popular products error:', error);
        return null;
    }
};

module.exports = {
    createProductService,
    getProductsService,
    getProductByIdService,
    updateProductService,
    deleteProductService,
    searchProductsWithElasticsearchService,
    searchProductsWithMongoDBService,
    getCategoriesService,
    getPopularProductsService
};
