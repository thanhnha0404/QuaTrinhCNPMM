const Product = require('../models/product');
const { syncProductToElasticsearch, deleteProductFromElasticsearch } = require('./elasticsearchService');

// Tạo sản phẩm mới
const createProductService = async (productData) => {
    try {
        const product = new Product(productData);
        const result = await product.save();
        
        // Sync với Elasticsearch
        try {
            await syncProductToElasticsearch(result._id);
        } catch (esError) {
            console.log('Warning: Failed to sync to Elasticsearch:', esError.message);
        }
        
        return {
            EC: 0,
            EM: 'Tạo sản phẩm thành công',
            DT: result
        };
    } catch (error) {
        console.log('Error creating product:', error);
        return {
            EC: 1,
            EM: 'Lỗi khi tạo sản phẩm',
            DT: null
        };
    }
};

// Lấy tất cả sản phẩm với phân trang và lazy loading
const getProductsService = async (page = 1, limit = 10, category = null, search = null) => {
    try {
        const query = { isActive: true };
        
        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }
        
        // Search by name or description
        if (search) {
            query.$text = { $search: search };
        }

        const skip = (page - 1) * limit;
        
        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('reviews.user', 'name email');

        const total = await Product.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        return {
            EC: 0,
            EM: 'Lấy danh sách sản phẩm thành công',
            DT: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        };
    } catch (error) {
        console.log('Error getting products:', error);
        return {
            EC: 1,
            EM: 'Lỗi khi lấy danh sách sản phẩm',
            DT: null
        };
    }
};

// Lấy sản phẩm theo ID
const getProductByIdService = async (id) => {
    try {
        const product = await Product.findById(id)
            .populate('reviews.user', 'name email');
        
        if (!product) {
            return {
                EC: 2,
                EM: 'Không tìm thấy sản phẩm',
                DT: null
            };
        }

        return {
            EC: 0,
            EM: 'Lấy sản phẩm thành công',
            DT: product
        };
    } catch (error) {
        console.log('Error getting product by ID:', error);
        return {
            EC: 1,
            EM: 'Lỗi khi lấy sản phẩm',
            DT: null
        };
    }
};

// Cập nhật sản phẩm
const updateProductService = async (id, updateData) => {
    try {
        const product = await Product.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return {
                EC: 2,
                EM: 'Không tìm thấy sản phẩm',
                DT: null
            };
        }

        // Sync với Elasticsearch
        try {
            await syncProductToElasticsearch(id);
        } catch (esError) {
            console.log('Warning: Failed to sync to Elasticsearch:', esError.message);
        }
        
        return {
            EC: 0,
            EM: 'Cập nhật sản phẩm thành công',
            DT: product
        };
    } catch (error) {
        console.log('Error updating product:', error);
        return {
            EC: 1,
            EM: 'Lỗi khi cập nhật sản phẩm',
            DT: null
        };
    }
};

// Xóa sản phẩm (soft delete)
const deleteProductService = async (id) => {
    try {
        const product = await Product.findByIdAndUpdate(
            id, 
            { isActive: false }, 
            { new: true }
        );
        
        if (!product) {
            return {
                EC: 2,
                EM: 'Không tìm thấy sản phẩm',
                DT: null
            };
        }

        // Xóa khỏi Elasticsearch
        try {
            await deleteProductFromElasticsearch(id);
        } catch (esError) {
            console.log('Warning: Failed to delete from Elasticsearch:', esError.message);
        }
        
        return {
            EC: 0,
            EM: 'Xóa sản phẩm thành công',
            DT: product
        };
    } catch (error) {
        console.log('Error deleting product:', error);
        return {
            EC: 1,
            EM: 'Lỗi khi xóa sản phẩm',
            DT: null
        };
    }
};

// Lấy danh mục sản phẩm
const getCategoriesService = async () => {
    try {
        const categories = await Product.distinct('category', { isActive: true });
        return {
            EC: 0,
            EM: 'Lấy danh mục thành công',
            DT: categories
        };
    } catch (error) {
        console.log('Error getting categories:', error);
        return {
            EC: 1,
            EM: 'Lỗi khi lấy danh mục',
            DT: null
        };
    }
};

// Tìm kiếm sản phẩm
const searchProductsService = async (searchTerm, page = 1, limit = 10) => {
    try {
        const query = {
            isActive: true,
            $text: { $search: searchTerm }
        };

        const skip = (page - 1) * limit;
        
        const products = await Product.find(query)
            .sort({ score: { $meta: 'textScore' } })
            .skip(skip)
            .limit(limit)
            .populate('reviews.user', 'name email');

        const total = await Product.countDocuments(query);
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
                }
            }
        };
    } catch (error) {
        console.log('Error searching products:', error);
        return {
            EC: 1,
            EM: 'Lỗi khi tìm kiếm sản phẩm',
            DT: null
        };
    }
};

// Thêm đánh giá sản phẩm
const addReviewService = async (productId, userId, rating, comment) => {
    try {
        const product = await Product.findById(productId);
        
        if (!product) {
            return {
                EC: 2,
                EM: 'Không tìm thấy sản phẩm',
                DT: null
            };
        }

        // Kiểm tra xem user đã đánh giá chưa
        const existingReview = product.reviews.find(review => 
            review.user.toString() === userId.toString()
        );

        if (existingReview) {
            return {
                EC: 3,
                EM: 'Bạn đã đánh giá sản phẩm này rồi',
                DT: null
            };
        }

        // Thêm review mới
        product.reviews.push({
            user: userId,
            rating: rating,
            comment: comment
        });

        // Cập nhật rating trung bình
        const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        product.rating = totalRating / product.reviews.length;

        await product.save();

        return {
            EC: 0,
            EM: 'Thêm đánh giá thành công',
            DT: product
        };
    } catch (error) {
        console.log('Error adding review:', error);
        return {
            EC: 1,
            EM: 'Lỗi khi thêm đánh giá',
            DT: null
        };
    }
};

module.exports = {
    createProductService,
    getProductsService,
    getProductByIdService,
    updateProductService,
    deleteProductService,
    getCategoriesService,
    searchProductsService,
    addReviewService
};




