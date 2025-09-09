require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product');
const { client, createProductIndex } = require('../config/elasticsearch');

// Kết nối MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstackdb');
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.log('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Sync tất cả sản phẩm từ MongoDB sang Elasticsearch
const syncAllProducts = async () => {
    try {
        console.log('🔄 Starting sync process...');
        
        // Tạo index nếu chưa có
        await createProductIndex();
        
        // Lấy tất cả sản phẩm từ MongoDB
        const products = await Product.find({ isActive: true });
        console.log(`📦 Found ${products.length} products to sync`);
        
        // Xóa tất cả dữ liệu cũ trong Elasticsearch
        await client.deleteByQuery({
            index: 'products',
            body: {
                query: {
                    match_all: {}
                }
            }
        });
        console.log('🗑️ Cleared existing data in Elasticsearch');
        
        // Bulk insert sản phẩm vào Elasticsearch
        const bulkBody = [];
        
        for (const product of products) {
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
                isFeatured: product.isFeatured || false,
                weight: product.weight || 0,
                dimensions: product.dimensions || {},
                brand: product.brand || '',
                sku: product.sku || '',
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            };
            
            bulkBody.push({
                index: {
                    _index: 'products',
                    _id: product._id.toString()
                }
            });
            bulkBody.push(productDoc);
        }
        
        if (bulkBody.length > 0) {
            const response = await client.bulk({ body: bulkBody });
            console.log(`✅ Synced ${bulkBody.length} products to Elasticsearch`);
        }
        
        console.log('🎉 Sync completed successfully!');
        
    } catch (error) {
        console.log('❌ Error during sync:', error);
    }
};

// Sync một sản phẩm cụ thể
const syncSingleProduct = async (productId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            console.log('❌ Product not found');
            return;
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
            isFeatured: product.isFeatured || false,
            weight: product.weight || 0,
            dimensions: product.dimensions || {},
            brand: product.brand || '',
            sku: product.sku || '',
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };
        
        await client.index({
            index: 'products',
            id: product._id.toString(),
            body: productDoc
        });
        
        console.log(`✅ Synced product ${product.name} to Elasticsearch`);
        
    } catch (error) {
        console.log('❌ Error syncing single product:', error);
    }
};

// Xóa một sản phẩm khỏi Elasticsearch
const deleteProductFromES = async (productId) => {
    try {
        await client.delete({
            index: 'products',
            id: productId
        });
        
        console.log(`✅ Deleted product ${productId} from Elasticsearch`);
        
    } catch (error) {
        console.log('❌ Error deleting product from Elasticsearch:', error);
    }
};

// Hàm chính
const main = async () => {
    const command = process.argv[2];
    const productId = process.argv[3];
    
    await connectDB();
    
    switch (command) {
        case 'sync-all':
            await syncAllProducts();
            break;
        case 'sync-single':
            if (!productId) {
                console.log('❌ Please provide product ID');
                process.exit(1);
            }
            await syncSingleProduct(productId);
            break;
        case 'delete':
            if (!productId) {
                console.log('❌ Please provide product ID');
                process.exit(1);
            }
            await deleteProductFromES(productId);
            break;
        default:
            console.log('Usage:');
            console.log('  node syncToElasticsearch.js sync-all          # Sync all products');
            console.log('  node syncToElasticsearch.js sync-single <id>  # Sync single product');
            console.log('  node syncToElasticsearch.js delete <id>       # Delete product from ES');
            break;
    }
    
    process.exit(0);
};

// Chạy script
main().catch(console.error);
