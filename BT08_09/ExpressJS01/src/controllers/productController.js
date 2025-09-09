const {
    createProductService,
    getProductsService,
    getProductByIdService,
    updateProductService,
    deleteProductService,
    getCategoriesService,
    searchProductsService,
    addReviewService
} = require('../services/productService');

const {
    fuzzySearchProducts,
    filterProducts,
    getSearchSuggestions,
    getFilterOptions,
    syncProductToElasticsearch,
    deleteProductFromElasticsearch
} = require('../services/elasticsearchService');

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        const result = await createProductService(productData);
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (error) {
        console.log('Error in createProduct controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Lấy danh sách sản phẩm với phân trang
const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, search } = req.query;
        const result = await getProductsService(
            parseInt(page), 
            parseInt(limit), 
            category, 
            search
        );
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (error) {
        console.log('Error in getProducts controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getProductByIdService(id);
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (error) {
        console.log('Error in getProductById controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const result = await updateProductService(id, updateData);
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (error) {
        console.log('Error in updateProduct controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteProductService(id);
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (error) {
        console.log('Error in deleteProduct controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Lấy danh mục sản phẩm
const getCategories = async (req, res) => {
    try {
        const result = await getCategoriesService();
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (error) {
        console.log('Error in getCategories controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Tìm kiếm sản phẩm
const searchProducts = async (req, res) => {
    try {
        const { q: searchTerm, page = 1, limit = 10 } = req.query;
        
        if (!searchTerm) {
            return res.status(400).json({
                EC: 1,
                EM: 'Vui lòng nhập từ khóa tìm kiếm',
                DT: null
            });
        }

        const result = await searchProductsService(searchTerm, parseInt(page), parseInt(limit));
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (error) {
        console.log('Error in searchProducts controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Thêm đánh giá sản phẩm
const addReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id; // Từ middleware auth

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                EC: 1,
                EM: 'Đánh giá phải từ 1 đến 5 sao',
                DT: null
            });
        }

        const result = await addReviewService(id, userId, rating, comment);
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (error) {
        console.log('Error in addReview controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Lấy sản phẩm theo danh mục với lazy loading
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        const result = await getProductsService(parseInt(page), parseInt(limit), category);
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (error) {
        console.log('Error in getProductsByCategory controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Lấy sản phẩm nổi bật
const getFeaturedProducts = async (req, res) => {
    try {
        const { limit = 8 } = req.query;
        
        const result = await getProductsService(1, parseInt(limit));
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (error) {
        console.log('Error in getFeaturedProducts controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Tìm kiếm sản phẩm với Fuzzy Search (Elasticsearch)
const fuzzySearch = async (req, res) => {
    try {
        const { q: searchTerm, page = 1, limit = 10, ...filters } = req.query;
        
        if (!searchTerm) {
            return res.status(400).json({
                EC: 1,
                EM: 'Vui lòng nhập từ khóa tìm kiếm',
                DT: null
            });
        }

        // Chuyển đổi các tham số filter
        const filterParams = {};
        if (filters.category) filterParams.category = filters.category;
        if (filters.minPrice) filterParams.minPrice = parseFloat(filters.minPrice);
        if (filters.maxPrice) filterParams.maxPrice = parseFloat(filters.maxPrice);
        if (filters.minRating) filterParams.minRating = parseFloat(filters.minRating);
        if (filters.minDiscount) filterParams.minDiscount = parseFloat(filters.minDiscount);
        if (filters.minViewCount) filterParams.minViewCount = parseFloat(filters.minViewCount);
        if (filters.inStock === 'true') filterParams.inStock = true;
        if (filters.tags) filterParams.tags = filters.tags.split(',');

        const result = await fuzzySearchProducts(
            searchTerm, 
            parseInt(page), 
            parseInt(limit), 
            filterParams
        );
        
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (error) {
        console.log('Error in fuzzySearch controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Lọc sản phẩm với nhiều điều kiện
const filterProductsAdvanced = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'createdAt', 
            sortOrder = 'desc',
            ...filters 
        } = req.query;

        // Chuyển đổi các tham số filter
        const filterParams = {};
        if (filters.search) filterParams.search = filters.search;
        if (filters.category) filterParams.category = filters.category;
        if (filters.minPrice) filterParams.minPrice = parseFloat(filters.minPrice);
        if (filters.maxPrice) filterParams.maxPrice = parseFloat(filters.maxPrice);
        if (filters.minRating) filterParams.minRating = parseFloat(filters.minRating);
        if (filters.minDiscount) filterParams.minDiscount = parseFloat(filters.minDiscount);
        if (filters.minViewCount) filterParams.minViewCount = parseFloat(filters.minViewCount);
        if (filters.inStock === 'true') filterParams.inStock = true;
        if (filters.tags) filterParams.tags = filters.tags.split(',');
        if (filters.dateFrom) filterParams.dateFrom = filters.dateFrom;
        if (filters.dateTo) filterParams.dateTo = filters.dateTo;

        const result = await filterProducts(
            filterParams,
            parseInt(page),
            parseInt(limit),
            sortBy,
            sortOrder
        );
        
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (error) {
        console.log('Error in filterProductsAdvanced controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Lấy gợi ý tìm kiếm
const getSearchSuggestionsController = async (req, res) => {
    try {
        const { q: searchTerm, limit = 10 } = req.query;
        
        if (!searchTerm) {
            return res.status(400).json({
                EC: 1,
                EM: 'Vui lòng nhập từ khóa tìm kiếm',
                DT: null
            });
        }

        const result = await getSearchSuggestions(searchTerm, parseInt(limit));
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (error) {
        console.log('Error in getSearchSuggestions controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Lấy các tùy chọn lọc
const getFilterOptionsController = async (req, res) => {
    try {
        const result = await getFilterOptions();
        return res.status(result.EC === 0 ? 200 : 400).json(result);
    } catch (error) {
        console.log('Error in getFilterOptions controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Cập nhật lượt xem sản phẩm
const updateViewCount = async (req, res) => {
    try {
        const { id } = req.params;
        const Product = require('../models/product');
        
        const product = await Product.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } },
            { new: true }
        );
        
        if (!product) {
            return res.status(404).json({
                EC: 2,
                EM: 'Không tìm thấy sản phẩm',
                DT: null
            });
        }

        // Đồng bộ với Elasticsearch
        await syncProductToElasticsearch(id);

        return res.status(200).json({
            EC: 0,
            EM: 'Cập nhật lượt xem thành công',
            DT: { viewCount: product.viewCount }
        });
    } catch (error) {
        console.log('Error in updateViewCount controller:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getCategories,
    searchProducts,
    addReview,
    getProductsByCategory,
    getFeaturedProducts,
    fuzzySearch,
    filterProductsAdvanced,
    getSearchSuggestionsController,
    getFilterOptionsController,
    updateViewCount
};




