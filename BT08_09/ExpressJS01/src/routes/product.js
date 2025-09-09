const express = require('express');
const {
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
} = require('../controllers/productController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public routes (không cần authentication)
router.get('/test', (req, res) => {
    res.json({ message: 'API hoạt động bình thường!' });
});
router.get('/', getProducts); // Lấy tất cả sản phẩm
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/search', searchProducts);
router.get('/fuzzy-search', fuzzySearch);
router.get('/filter', filterProductsAdvanced);
router.get('/suggestions', getSearchSuggestionsController);
router.get('/filter-options', getFilterOptionsController);
router.get('/:id', getProductById);
router.put('/:id/view', updateViewCount);

// Protected routes (cần authentication)
router.use(auth);

router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/reviews', addReview);

module.exports = router;
