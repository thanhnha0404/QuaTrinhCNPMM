const {
    createProductService,
    getProductsService,
    getProductByIdService,
    updateProductService,
    deleteProductService,
    searchProductsWithElasticsearchService,
    searchProductsWithMongoDBService,
    getCategoriesService,
    getPopularProductsService
} = require('../services/productService');

// Lấy danh sách sản phẩm với phân trang và lọc
const getProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            minPrice,
            maxPrice,
            minDiscount,
            maxDiscount,
            minViews,
            maxViews,
            inStock,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Tạo filters object
        const filters = {
            category,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            minDiscount: minDiscount ? parseInt(minDiscount) : undefined,
            maxDiscount: maxDiscount ? parseInt(maxDiscount) : undefined,
            minViews: minViews ? parseInt(minViews) : undefined,
            maxViews: maxViews ? parseInt(maxViews) : undefined,
            inStock: inStock !== undefined ? inStock : undefined,
            sortBy,
            sortOrder
        };

        // Loại bỏ các giá trị undefined
        Object.keys(filters).forEach(key => {
            if (filters[key] === undefined) {
                delete filters[key];
            }
        });

        const result = await getProductsService(
            parseInt(page),
            parseInt(limit),
            category,
            sortBy,
            sortOrder
        );

        if (!result) {
            return res.status(500).json({
                EC: 1,
                EM: 'Lỗi server khi lấy danh sách sản phẩm',
                DT: null
            });
        }

        return res.status(200).json({
            EC: 0,
            EM: 'Lấy danh sách sản phẩm thành công',
            DT: result
        });
    } catch (error) {
        console.log('Get products controller error:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Tìm kiếm sản phẩm với nhiều điều kiện lọc
const searchProductsWithElasticsearch = async (req, res) => {
    try {
        const { 
            q, 
            page = 1, 
            limit = 10,
            category,
            minPrice,
            maxPrice,
            minDiscount,
            maxDiscount,
            minViews,
            maxViews,
            inStock,
            sortBy,
            sortOrder = 'desc'
        } = req.query;

        // Tạo filters object
        const filters = {
            category,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            minDiscount: minDiscount ? parseInt(minDiscount) : undefined,
            maxDiscount: maxDiscount ? parseInt(maxDiscount) : undefined,
            minViews: minViews ? parseInt(minViews) : undefined,
            maxViews: maxViews ? parseInt(maxViews) : undefined,
            inStock: inStock !== undefined ? inStock : undefined,
            sortBy,
            sortOrder
        };

        // Loại bỏ các giá trị undefined
        Object.keys(filters).forEach(key => {
            if (filters[key] === undefined) {
                delete filters[key];
            }
        });

        const result = await searchProductsWithElasticsearchService(
            q ? q.trim() : '',
            parseInt(page),
            parseInt(limit),
            filters
        );

        if (!result) {
            return res.status(500).json({
                EC: 1,
                EM: 'Lỗi server khi tìm kiếm sản phẩm',
                DT: null
            });
        }

        return res.status(200).json({
            EC: 0,
            EM: 'Tìm kiếm sản phẩm thành công',
            DT: result
        });
    } catch (error) {
        console.log('Search products controller error:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Tìm kiếm sản phẩm với MongoDB (fallback)
const searchProductsWithMongoDB = async (req, res) => {
    try {
        const { 
            q, 
            page = 1, 
            limit = 10,
            category,
            minPrice,
            maxPrice,
            minDiscount,
            maxDiscount,
            minViews,
            maxViews,
            inStock,
            sortBy,
            sortOrder = 'desc'
        } = req.query;

        // Tạo filters object
        const filters = {
            category,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            minDiscount: minDiscount ? parseInt(minDiscount) : undefined,
            maxDiscount: maxDiscount ? parseInt(maxDiscount) : undefined,
            minViews: minViews ? parseInt(minViews) : undefined,
            maxViews: maxViews ? parseInt(maxViews) : undefined,
            inStock: inStock !== undefined ? inStock : undefined,
            sortBy,
            sortOrder
        };

        // Loại bỏ các giá trị undefined
        Object.keys(filters).forEach(key => {
            if (filters[key] === undefined) {
                delete filters[key];
            }
        });

        const result = await searchProductsWithMongoDBService(
            q ? q.trim() : '',
            parseInt(page),
            parseInt(limit),
            filters
        );

        if (!result) {
            return res.status(500).json({
                EC: 1,
                EM: 'Lỗi server khi tìm kiếm sản phẩm',
                DT: null
            });
        }

        return res.status(200).json({
            EC: 0,
            EM: 'Tìm kiếm sản phẩm thành công',
            DT: result
        });
    } catch (error) {
        console.log('Search products with MongoDB controller error:', error);
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

        if (!id) {
            return res.status(400).json({
                EC: 1,
                EM: 'ID sản phẩm không hợp lệ',
                DT: null
            });
        }

        const product = await getProductByIdService(id);

        if (!product) {
            return res.status(404).json({
                EC: 1,
                EM: 'Không tìm thấy sản phẩm',
                DT: null
            });
        }

        return res.status(200).json({
            EC: 0,
            EM: 'Lấy sản phẩm thành công',
            DT: product
        });
    } catch (error) {
        console.log('Get product by ID controller error:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            originalPrice,
            image,
            category,
            discount = 0,
            description,
            tags = [],
            inStock = true
        } = req.body;

        // Validation
        if (!name || !price || !originalPrice || !category) {
            return res.status(400).json({
                EC: 1,
                EM: 'Vui lòng điền đầy đủ thông tin bắt buộc (name, price, originalPrice, category)',
                DT: null
            });
        }

        if (price < 0 || originalPrice < 0) {
            return res.status(400).json({
                EC: 1,
                EM: 'Giá sản phẩm không được âm',
                DT: null
            });
        }

        if (discount < 0 || discount > 100) {
            return res.status(400).json({
                EC: 1,
                EM: 'Giảm giá phải từ 0-100%',
                DT: null
            });
        }

        const productData = {
            name: name.trim(),
            price: parseFloat(price),
            originalPrice: parseFloat(originalPrice),
            image: image ? image.trim() : '',
            category: category.trim(),
            discount: parseInt(discount),
            description: description ? description.trim() : '',
            tags: Array.isArray(tags) ? tags : [],
            inStock: Boolean(inStock)
        };

        const product = await createProductService(productData);

        if (!product) {
            return res.status(500).json({
                EC: 1,
                EM: 'Lỗi server khi tạo sản phẩm',
                DT: null
            });
        }

        return res.status(201).json({
            EC: 0,
            EM: 'Tạo sản phẩm thành công',
            DT: product
        });
    } catch (error) {
        console.log('Create product controller error:', error);
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

        if (!id) {
            return res.status(400).json({
                EC: 1,
                EM: 'ID sản phẩm không hợp lệ',
                DT: null
            });
        }

        // Validation cho các trường cần cập nhật
        if (updateData.price !== undefined && updateData.price < 0) {
            return res.status(400).json({
                EC: 1,
                EM: 'Giá sản phẩm không được âm',
                DT: null
            });
        }

        if (updateData.originalPrice !== undefined && updateData.originalPrice < 0) {
            return res.status(400).json({
                EC: 1,
                EM: 'Giá gốc không được âm',
                DT: null
            });
        }

        if (updateData.discount !== undefined && (updateData.discount < 0 || updateData.discount > 100)) {
            return res.status(400).json({
                EC: 1,
                EM: 'Giảm giá phải từ 0-100%',
                DT: null
            });
        }

        // Clean up data
        if (updateData.name) updateData.name = updateData.name.trim();
        if (updateData.description) updateData.description = updateData.description.trim();
        if (updateData.image) updateData.image = updateData.image.trim();
        if (updateData.category) updateData.category = updateData.category.trim();
        if (updateData.tags && !Array.isArray(updateData.tags)) {
            updateData.tags = [];
        }

        const product = await updateProductService(id, updateData);

        if (!product) {
            return res.status(404).json({
                EC: 1,
                EM: 'Không tìm thấy sản phẩm hoặc lỗi khi cập nhật',
                DT: null
            });
        }

        return res.status(200).json({
            EC: 0,
            EM: 'Cập nhật sản phẩm thành công',
            DT: product
        });
    } catch (error) {
        console.log('Update product controller error:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Xóa sản phẩm
const deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                EC: 1,
                EM: 'ID sản phẩm không hợp lệ',
                DT: null
            });
        }

        const product = await deleteProductService(id);

        if (!product) {
            return res.status(404).json({
                EC: 1,
                EM: 'Không tìm thấy sản phẩm',
                DT: null
            });
        }

        return res.status(200).json({
            EC: 0,
            EM: 'Xóa sản phẩm thành công',
            DT: product
        });
    } catch (error) {
        console.log('Delete product controller error:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Lấy danh sách danh mục
const getCategories = async (req, res) => {
    try {
        const categories = await getCategoriesService();

        if (!categories) {
            return res.status(500).json({
                EC: 1,
                EM: 'Lỗi server khi lấy danh sách danh mục',
                DT: null
            });
        }

        return res.status(200).json({
            EC: 0,
            EM: 'Lấy danh sách danh mục thành công',
            DT: categories
        });
    } catch (error) {
        console.log('Get categories controller error:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

// Lấy sản phẩm phổ biến
const getPopularProducts = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const products = await getPopularProductsService(parseInt(limit));

        if (!products) {
            return res.status(500).json({
                EC: 1,
                EM: 'Lỗi server khi lấy sản phẩm phổ biến',
                DT: null
            });
        }

        return res.status(200).json({
            EC: 0,
            EM: 'Lấy sản phẩm phổ biến thành công',
            DT: products
        });
    } catch (error) {
        console.log('Get popular products controller error:', error);
        return res.status(500).json({
            EC: 1,
            EM: 'Lỗi server',
            DT: null
        });
    }
};

module.exports = {
    getProducts,
    searchProductsWithElasticsearch,
    searchProductsWithMongoDB,
    getProductById,
    createProduct,
    updateProduct,
    deleteProductById,
    getCategories,
    getPopularProducts
};