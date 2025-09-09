const Product = require('../models/product');

// Hàm tạo fuzzy patterns cho tìm kiếm
const createFuzzyPatterns = (searchTerm) => {
    const patterns = [];
    const term = searchTerm.toLowerCase();
    
    // Loại bỏ dấu tiếng Việt
    const removeVietnameseAccents = (str) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    };
    
    const normalizedTerm = removeVietnameseAccents(term);
    
    // Pattern 1: Thay thế một ký tự
    for (let i = 0; i < normalizedTerm.length; i++) {
        const pattern = normalizedTerm.substring(0, i) + '.' + normalizedTerm.substring(i + 1);
        patterns.push(pattern);
    }
    
    // Pattern 2: Thêm một ký tự
    for (let i = 0; i <= normalizedTerm.length; i++) {
        const pattern = normalizedTerm.substring(0, i) + '.' + normalizedTerm.substring(i);
        patterns.push(pattern);
    }
    
    // Pattern 3: Bỏ một ký tự
    for (let i = 0; i < normalizedTerm.length; i++) {
        const pattern = normalizedTerm.substring(0, i) + normalizedTerm.substring(i + 1);
        patterns.push(pattern);
    }
    
    // Pattern 4: Hoán đổi hai ký tự liền kề
    for (let i = 0; i < normalizedTerm.length - 1; i++) {
        const chars = normalizedTerm.split('');
        [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
        patterns.push(chars.join(''));
    }
    
    // Pattern 5: Tìm kiếm với dấu tiếng Việt
    patterns.push(term);
    
    return [...new Set(patterns)].slice(0, 10); // Giới hạn số patterns
};

// Fallback search service khi Elasticsearch không khả dụng
const fuzzySearchProducts = async (searchTerm, page = 1, limit = 10, filters = {}) => {
    try {
        const query = { isActive: true };
        
        // Tìm kiếm text với regex (fuzzy-like)
        if (searchTerm) {
            // Tạo các pattern tìm kiếm fuzzy
            const fuzzyPatterns = createFuzzyPatterns(searchTerm);
            
            query.$or = [
                // Tìm kiếm chính xác
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } },
                // Tìm kiếm fuzzy
                ...fuzzyPatterns.map(pattern => ({ name: { $regex: pattern, $options: 'i' } })),
                ...fuzzyPatterns.map(pattern => ({ description: { $regex: pattern, $options: 'i' } }))
            ];
        }

        // Áp dụng filters
        if (filters.category && filters.category !== 'all') {
            query.category = filters.category;
        }

        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            query.price = {};
            if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
            if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
        }

        if (filters.minRating !== undefined) {
            query.rating = { $gte: filters.minRating };
        }

        if (filters.minDiscount !== undefined) {
            query.discount = { $gte: filters.minDiscount };
        }

        if (filters.inStock) {
            query.stock = { $gt: 0 };
        }

        if (filters.minViewCount !== undefined) {
            query.viewCount = { $gte: filters.minViewCount };
        }

        if (filters.tags && filters.tags.length > 0) {
            query.tags = { $in: filters.tags };
        }

        const skip = (page - 1) * limit;
        
        const products = await Product.find(query)
            .sort({ rating: -1, viewCount: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('reviews.user', 'name email');

        const total = await Product.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        return {
            EC: 0,
            EM: 'Tìm kiếm sản phẩm thành công (MongoDB)',
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
        console.log('Error in fallback search:', error);
        return {
            EC: 1,
            EM: 'Lỗi khi tìm kiếm sản phẩm',
            DT: null
        };
    }
};

const filterProducts = async (filters = {}, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc') => {
    try {
        const query = { isActive: true };
        
        // Tìm kiếm theo tên hoặc mô tả
        if (filters.search) {
            query.$or = [
                { name: { $regex: filters.search, $options: 'i' } },
                { description: { $regex: filters.search, $options: 'i' } }
            ];
        }

        // Áp dụng các filter khác
        if (filters.category && filters.category !== 'all') {
            query.category = filters.category;
        }

        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            query.price = {};
            if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
            if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
        }

        if (filters.minRating !== undefined) {
            query.rating = { $gte: filters.minRating };
        }

        if (filters.minDiscount !== undefined) {
            query.discount = { $gte: filters.minDiscount };
        }

        if (filters.inStock) {
            query.stock = { $gt: 0 };
        }

        if (filters.minViewCount !== undefined) {
            query.viewCount = { $gte: filters.minViewCount };
        }

        if (filters.tags && filters.tags.length > 0) {
            query.tags = { $in: filters.tags };
        }

        if (filters.dateFrom || filters.dateTo) {
            query.createdAt = {};
            if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
            if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
        }

        // Sắp xếp
        const sort = {};
        switch (sortBy) {
            case 'price':
                sort.price = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'rating':
                sort.rating = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'viewCount':
                sort.viewCount = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'discount':
                sort.discount = sortOrder === 'asc' ? 1 : -1;
                break;
            case 'name':
                sort.name = sortOrder === 'asc' ? 1 : -1;
                break;
            default:
                sort.createdAt = sortOrder === 'asc' ? 1 : -1;
        }

        const skip = (page - 1) * limit;
        
        const products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('reviews.user', 'name email');

        const total = await Product.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        return {
            EC: 0,
            EM: 'Lọc sản phẩm thành công (MongoDB)',
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
        console.log('Error in fallback filter:', error);
        return {
            EC: 1,
            EM: 'Lỗi khi lọc sản phẩm',
            DT: null
        };
    }
};

const getSearchSuggestions = async (searchTerm, limit = 10) => {
    try {
        const products = await Product.find({
            isActive: true,
            name: { $regex: searchTerm, $options: 'i' }
        })
        .select('name')
        .limit(limit);

        const suggestions = products.map(product => ({
            text: product.name,
            score: 1.0
        }));

        return {
            EC: 0,
            EM: 'Lấy gợi ý tìm kiếm thành công (MongoDB)',
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

const getFilterOptions = async () => {
    try {
        const categories = await Product.distinct('category', { isActive: true });
        
        const priceStats = await Product.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            }
        ]);

        const ratingStats = await Product.aggregate([
            { $match: { isActive: true, rating: { $exists: true } } },
            {
                $group: {
                    _id: null,
                    minRating: { $min: '$rating' },
                    maxRating: { $max: '$rating' }
                }
            }
        ]);

        const discountStats = await Product.aggregate([
            { $match: { isActive: true, discount: { $exists: true } } },
            {
                $group: {
                    _id: null,
                    minDiscount: { $min: '$discount' },
                    maxDiscount: { $max: '$discount' }
                }
            }
        ]);

        const tags = await Product.distinct('tags', { isActive: true });

        return {
            EC: 0,
            EM: 'Lấy tùy chọn lọc thành công (MongoDB)',
            DT: {
                categories,
                priceRange: {
                    min: priceStats[0]?.minPrice || 0,
                    max: priceStats[0]?.maxPrice || 0
                },
                ratingRange: {
                    min: ratingStats[0]?.minRating || 0,
                    max: ratingStats[0]?.maxRating || 5
                },
                discountRange: {
                    min: discountStats[0]?.minDiscount || 0,
                    max: discountStats[0]?.maxDiscount || 100
                },
                tags: tags.filter(tag => tag && tag.trim() !== '')
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

module.exports = {
    fuzzySearchProducts,
    filterProducts,
    getSearchSuggestions,
    getFilterOptions
};
