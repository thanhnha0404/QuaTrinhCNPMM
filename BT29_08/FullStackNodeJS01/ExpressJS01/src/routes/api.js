const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const { 
  getProducts, 
  searchProductsWithElasticsearch, 
  searchProductsWithMongoDB, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProductById, 
  getCategories, 
  getPopularProducts 
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

// Public routes (không cần authentication)
routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
})

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

// Product routes (public - không cần authentication)
// Lấy danh sách sản phẩm
routerAPI.get("/products", getProducts);

// Tìm kiếm sản phẩm với Elasticsearch (ưu tiên)
routerAPI.get("/products/search", searchProductsWithElasticsearch);

// Tìm kiếm sản phẩm với MongoDB (fallback)
routerAPI.get("/products/search-mongodb", searchProductsWithMongoDB);

// Lấy sản phẩm theo ID
routerAPI.get("/products/:id", getProductById);

// Lấy danh sách danh mục
routerAPI.get("/categories", getCategories);

// Lấy sản phẩm phổ biến
routerAPI.get("/products/popular", getPopularProducts);

// Protected routes (cần authentication)
routerAPI.use(auth);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

// Tạo sản phẩm mới
routerAPI.post("/products", createProduct);

// Cập nhật sản phẩm
routerAPI.put("/products/:id", updateProduct);

// Xóa sản phẩm
routerAPI.delete("/products/:id", deleteProductById);

module.exports = routerAPI;