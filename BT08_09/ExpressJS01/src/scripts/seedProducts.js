require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product');

const sampleProducts = [
    {
        name: "iPhone 15 Pro Max",
        description: "iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP và màn hình Super Retina XDR 6.7 inch. Thiết kế titan cao cấp và khả năng chống nước IP68.",
        price: 29990000,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop",
        stock: 50,
        rating: 4.8,
        discount: 10,
        viewCount: 1250
    },
    {
        name: "Samsung Galaxy S24 Ultra",
        description: "Samsung Galaxy S24 Ultra với S Pen tích hợp, camera 200MP và màn hình Dynamic AMOLED 2X 6.8 inch. Hiệu năng mạnh mẽ với chip Snapdragon 8 Gen 3.",
        price: 27990000,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
        stock: 30,
        rating: 4.7,
        discount: 15,
        viewCount: 980
    },
    {
        name: "MacBook Pro M3",
        description: "MacBook Pro 14 inch với chip M3 mạnh mẽ, màn hình Liquid Retina XDR và thời lượng pin lên đến 18 giờ. Hoàn hảo cho công việc chuyên nghiệp.",
        price: 45990000,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
        stock: 25,
        rating: 4.9,
        discount: 5,
        viewCount: 560
    },
    {
        name: "Áo thun nam cao cấp",
        description: "Áo thun nam chất liệu cotton 100%, thiết kế đơn giản nhưng thanh lịch. Phù hợp cho mọi hoạt động hàng ngày và thể thao.",
        price: 299000,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
        stock: 100,
        rating: 4.5,
        discount: 20,
        viewCount: 340
    },
    {
        name: "Váy dạ hội nữ",
        description: "Váy dạ hội nữ thiết kế sang trọng, chất liệu lụa cao cấp. Phù hợp cho các sự kiện quan trọng và tiệc tùng.",
        price: 1299000,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop",
        stock: 20,
        rating: 4.6,
        discount: 30,
        viewCount: 410
    },
    {
        name: "Giày thể thao Nike Air Max",
        description: "Giày thể thao Nike Air Max với công nghệ Air Max tiên tiến, đế giày êm ái và thiết kế thời trang. Hoàn hảo cho chạy bộ và tập luyện.",
        price: 2499000,
        category: "sports",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
        stock: 75,
        rating: 4.4,
        discount: 25,
        viewCount: 720
    },
    {
        name: "Sách 'Clean Code'",
        description: "Cuốn sách kinh điển về lập trình 'Clean Code' của Robert C. Martin. Hướng dẫn viết code sạch, dễ đọc và dễ bảo trì.",
        price: 299000,
        category: "books",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop",
        stock: 200,
        rating: 4.8,
        discount: 35,
        viewCount: 1100
    },
    {
        name: "Bộ nồi inox cao cấp",
        description: "Bộ nồi inox 304 cao cấp, 5 chiếc với kích thước khác nhau. Đáy dày, chống dính và dẫn nhiệt tốt. Phù hợp cho gia đình 4-6 người.",
        price: 1899000,
        category: "home",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop",
        stock: 40,
        rating: 4.3,
        discount: 18,
        viewCount: 260
    },
    {
        name: "Kem dưỡng da mặt",
        description: "Kem dưỡng da mặt với thành phần tự nhiên, giúp dưỡng ẩm và chống lão hóa. Phù hợp cho mọi loại da, kể cả da nhạy cảm.",
        price: 599000,
        category: "beauty",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop",
        stock: 60,
        rating: 4.2,
        discount: 22,
        viewCount: 305
    },
    {
        name: "Xe đạp thể thao",
        description: "Xe đạp thể thao với khung nhôm nhẹ, hệ thống phanh đĩa và 21 tốc độ. Phù hợp cho tập luyện và đi lại hàng ngày.",
        price: 3999000,
        category: "sports",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=500&fit=crop",
        stock: 15,
        rating: 4.6,
        discount: 12,
        viewCount: 455
    },
    {
        name: "Lego Creator Expert",
        description: "Bộ Lego Creator Expert với hơn 3000 mảnh ghép, tạo thành mô hình tòa nhà chi tiết. Phù hợp cho người lớn và trẻ em từ 16 tuổi trở lên.",
        price: 1299000,
        category: "toys",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=500&fit=crop",
        stock: 30,
        rating: 4.7,
        discount: 40,
        viewCount: 880
    },
    {
        name: "Cà phê hạt nguyên chất",
        description: "Cà phê hạt Arabica 100% nguyên chất, rang xay thủ công. Hương vị đậm đà, thơm ngon. Đóng gói 500g, bảo quản tốt.",
        price: 199000,
        category: "food",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop",
        stock: 150,
        rating: 4.5,
        discount: 28,
        viewCount: 190
    }
];

const seedProducts = async () => {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstackdb';
        console.log('Connecting to MongoDB with URI:', mongoURI);
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert sample products
        const products = await Product.insertMany(sampleProducts);
        console.log(`Inserted ${products.length} products`);

        // Add some reviews to products
        const reviewProducts = products.slice(0, 5); // Add reviews to first 5 products
        for (const product of reviewProducts) {
            const reviews = [
                {
                    user: new mongoose.Types.ObjectId(), // Dummy user ID
                    rating: 5,
                    comment: "Sản phẩm rất tốt, chất lượng cao!",
                    createdAt: new Date()
                },
                {
                    user: new mongoose.Types.ObjectId(),
                    rating: 4,
                    comment: "Tốt nhưng giá hơi cao",
                    createdAt: new Date()
                }
            ];
            
            product.reviews = reviews;
            product.rating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
            await product.save();
        }

        console.log('Added sample reviews');
        console.log('Database seeded successfully!');
        
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run the seed function
seedProducts();
