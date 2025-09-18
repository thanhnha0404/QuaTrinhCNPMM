const mongoose = require("mongoose");
const Product = require('./models/Product');
const { indexProduct } = require('./config/elasticsearch');

const sampleProducts = [
  // Electronics - Smartphones
  {
    name: "iPhone 15 Pro Max 256GB",
    description: "Điện thoại iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP ProRAW và màn hình Super Retina XDR 6.7 inch. Hỗ trợ 5G và Face ID",
    price: 29990000,
    originalPrice: 32990000,
    discount: 9,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
    tags: ["smartphone", "apple", "premium", "5g", "camera"],
    inStock: true,
    viewCount: 1250
  },
  {
    name: "iPhone 14 Pro 128GB",
    description: "iPhone 14 Pro với chip A16 Bionic, camera 48MP và Dynamic Island. Màn hình Super Retina XDR 6.1 inch",
    price: 24990000,
    originalPrice: 27990000,
    discount: 11,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
    tags: ["smartphone", "apple", "pro", "camera", "dynamic-island"],
    inStock: true,
    viewCount: 980
  },
  {
    name: "Samsung Galaxy S24 Ultra 512GB",
    description: "Điện thoại Samsung Galaxy S24 Ultra với S Pen, camera 200MP và màn hình Dynamic AMOLED 2X 6.8 inch. Hỗ trợ S Pen và 5G",
    price: 24990000,
    originalPrice: 27990000,
    discount: 11,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    tags: ["smartphone", "samsung", "android", "s-pen", "camera"],
    inStock: true,
    viewCount: 1100
  },
  {
    name: "Samsung Galaxy Z Fold 5",
    description: "Điện thoại gập Samsung Galaxy Z Fold 5 với màn hình 7.6 inch, chip Snapdragon 8 Gen 2 và camera 50MP",
    price: 39990000,
    originalPrice: 44990000,
    discount: 11,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    tags: ["smartphone", "samsung", "foldable", "premium", "android"],
    inStock: false,
    viewCount: 750
  },
  {
    name: "Google Pixel 8 Pro",
    description: "Điện thoại Google Pixel 8 Pro với camera AI tiên tiến, chip Tensor G3 và màn hình 6.7 inch",
    price: 19990000,
    originalPrice: 22990000,
    discount: 13,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    tags: ["smartphone", "google", "pixel", "ai", "camera"],
    inStock: true,
    viewCount: 650
  },

  // Electronics - Laptops
  {
    name: "MacBook Pro 14 inch M3",
    description: "Laptop MacBook Pro 14 inch với chip M3, 16GB RAM, 512GB SSD và màn hình Liquid Retina XDR. Hiệu năng mạnh mẽ cho công việc chuyên nghiệp",
    price: 45990000,
    originalPrice: 49990000,
    discount: 8,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    tags: ["laptop", "apple", "macbook", "m3", "professional"],
    inStock: true,
    viewCount: 2100
  },
  {
    name: "MacBook Air 13 inch M2",
    description: "Laptop MacBook Air 13 inch với chip M2, 8GB RAM, 256GB SSD. Thiết kế mỏng nhẹ, pin lâu",
    price: 29990000,
    originalPrice: 32990000,
    discount: 9,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    tags: ["laptop", "apple", "macbook", "m2", "lightweight"],
    inStock: true,
    viewCount: 1800
  },
  {
    name: "Dell XPS 13 Plus",
    description: "Laptop Dell XPS 13 Plus với Intel i7, 16GB RAM, 512GB SSD và màn hình 13.4 inch 4K",
    price: 32990000,
    originalPrice: 36990000,
    discount: 11,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    tags: ["laptop", "dell", "xps", "intel", "4k"],
    inStock: true,
    viewCount: 1200
  },
  {
    name: "ASUS ROG Strix G15",
    description: "Laptop gaming ASUS ROG Strix G15 với RTX 4060, AMD Ryzen 7, 16GB RAM và màn hình 15.6 inch 144Hz",
    price: 25990000,
    originalPrice: 29990000,
    discount: 13,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    tags: ["laptop", "gaming", "asus", "rog", "rtx"],
    inStock: true,
    viewCount: 950
  },

  // Electronics - Audio
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Tai nghe chống ồn Sony WH-1000XM5 với công nghệ noise canceling tiên tiến và âm thanh chất lượng cao",
    price: 8900000,
    originalPrice: 9900000,
    discount: 10,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    tags: ["headphones", "sony", "wireless", "noise-canceling", "premium"],
    inStock: false,
    viewCount: 1200
  },
  {
    name: "AirPods Pro 2nd Gen",
    description: "Tai nghe AirPods Pro thế hệ 2 với chống ồn chủ động, âm thanh không gian và sạc MagSafe",
    price: 5990000,
    originalPrice: 6990000,
    discount: 14,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
    tags: ["earbuds", "apple", "airpods", "wireless", "noise-canceling"],
    inStock: true,
    viewCount: 1500
  },
  {
    name: "Bose QuietComfort 45",
    description: "Tai nghe Bose QuietComfort 45 với chống ồn thế hệ mới và âm thanh cân bằng tự nhiên",
    price: 7500000,
    originalPrice: 8500000,
    discount: 12,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    tags: ["headphones", "bose", "wireless", "comfort", "premium"],
    inStock: true,
    viewCount: 800
  },

  // Electronics - Cameras
  {
    name: "Canon EOS R5 Camera",
    description: "Máy ảnh Canon EOS R5 full-frame với 45MP, quay video 8K và chống rung 5 trục",
    price: 89900000,
    originalPrice: 99900000,
    discount: 10,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    tags: ["camera", "canon", "professional", "full-frame", "8k"],
    inStock: true,
    viewCount: 560
  },
  {
    name: "Sony A7 IV Camera",
    description: "Máy ảnh Sony A7 IV với 33MP, quay video 4K và autofocus nhanh chóng",
    price: 59900000,
    originalPrice: 69900000,
    discount: 14,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    tags: ["camera", "sony", "mirrorless", "4k", "professional"],
    inStock: true,
    viewCount: 720
  },

  // Clothing - Shoes
  {
    name: "Nike Air Max 270",
    description: "Giày thể thao Nike Air Max 270 với công nghệ Air Max đệm êm và thiết kế thời trang năng động",
    price: 3200000,
    originalPrice: 3800000,
    discount: 16,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    tags: ["sneakers", "nike", "sports", "air-max", "casual"],
    inStock: true,
    viewCount: 750
  },
  {
    name: "Adidas Ultraboost 22",
    description: "Giày chạy bộ Adidas Ultraboost 22 với Boost midsole và Primeknit upper siêu nhẹ",
    price: 4500000,
    originalPrice: 5000000,
    discount: 10,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
    tags: ["running", "adidas", "boost", "sports", "lightweight"],
    inStock: true,
    viewCount: 620
  },
  {
    name: "Jordan 1 Retro High",
    description: "Giày bóng rổ Jordan 1 Retro High với thiết kế cổ điển và chất liệu da cao cấp",
    price: 4200000,
    originalPrice: 4800000,
    discount: 13,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    tags: ["sneakers", "jordan", "basketball", "retro", "classic"],
    inStock: false,
    viewCount: 1100
  },
  {
    name: "Converse Chuck Taylor All Star",
    description: "Giày Converse Chuck Taylor All Star với thiết kế cổ điển và chất liệu canvas bền bỉ",
    price: 1200000,
    originalPrice: 1500000,
    discount: 20,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    tags: ["sneakers", "converse", "canvas", "classic", "casual"],
    inStock: true,
    viewCount: 890
  },

  // Clothing - Apparel
  {
    name: "Uniqlo Heattech T-Shirt",
    description: "Áo thun Uniqlo Heattech giữ ấm, chất liệu cotton pha polyester siêu mỏng",
    price: 199000,
    originalPrice: 250000,
    discount: 20,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    tags: ["tshirt", "heattech", "basic", "warm", "casual"],
    inStock: true,
    viewCount: 320
  },
  {
    name: "Nike Dri-FIT T-Shirt",
    description: "Áo thun Nike Dri-FIT thấm hút mồ hôi, phù hợp cho tập luyện và thể thao",
    price: 450000,
    originalPrice: 550000,
    discount: 18,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    tags: ["tshirt", "nike", "sports", "dri-fit", "athletic"],
    inStock: true,
    viewCount: 480
  },
  {
    name: "Levi's 501 Original Jeans",
    description: "Quần jeans Levi's 501 Original với thiết kế cổ điển và chất liệu denim cao cấp",
    price: 1200000,
    originalPrice: 1500000,
    discount: 20,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    tags: ["jeans", "levis", "denim", "classic", "casual"],
    inStock: true,
    viewCount: 650
  },

  // Books
  {
    name: "The Great Gatsby",
    description: "Tiểu thuyết kinh điển của F. Scott Fitzgerald về giấc mơ Mỹ và sự suy tàn của xã hội thượng lưu",
    price: 120000,
    originalPrice: 150000,
    discount: 20,
    category: "books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    tags: ["classic", "literature", "american", "fiction", "novel"],
    inStock: true,
    viewCount: 340
  },
  {
    name: "Atomic Habits",
    description: "Cuốn sách về việc xây dựng thói quen tốt và phá vỡ thói quen xấu của James Clear",
    price: 180000,
    originalPrice: 200000,
    discount: 10,
    category: "books",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    tags: ["self-help", "productivity", "habits", "psychology", "motivation"],
    inStock: true,
    viewCount: 890
  },
  {
    name: "Harry Potter Complete Set",
    description: "Bộ sách Harry Potter đầy đủ 7 tập, bản tiếng Anh, bìa cứng cao cấp",
    price: 2500000,
    originalPrice: 3000000,
    discount: 17,
    category: "books",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    tags: ["fantasy", "harry-potter", "complete-set", "magic", "children"],
    inStock: true,
    viewCount: 780
  },
  {
    name: "Sapiens: A Brief History of Humankind",
    description: "Cuốn sách của Yuval Noah Harari về lịch sử loài người từ thời kỳ đồ đá đến hiện tại",
    price: 220000,
    originalPrice: 280000,
    discount: 21,
    category: "books",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    tags: ["history", "anthropology", "science", "philosophy", "non-fiction"],
    inStock: true,
    viewCount: 560
  },
  {
    name: "The Lean Startup",
    description: "Phương pháp khởi nghiệp tinh gọn của Eric Ries, hướng dẫn xây dựng startup thành công",
    price: 160000,
    originalPrice: 200000,
    discount: 20,
    category: "books",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    tags: ["business", "startup", "entrepreneurship", "management", "innovation"],
    inStock: true,
    viewCount: 420
  },

  // Home & Garden
  {
    name: "IKEA Billy Bookcase",
    description: "Kệ sách Billy màu trắng, kích thước 80x28x202 cm, phù hợp cho phòng khách và phòng ngủ",
    price: 1200000,
    originalPrice: 1200000,
    discount: 0,
    category: "home",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c04ef4f7?w=400",
    tags: ["furniture", "storage", "white", "bookshelf", "ikea"],
    inStock: true,
    viewCount: 450
  },
  {
    name: "Dyson V15 Detect Vacuum",
    description: "Máy hút bụi không dây Dyson V15 Detect với laser phát hiện bụi và công nghệ HEPA",
    price: 15990000,
    originalPrice: 17990000,
    discount: 11,
    category: "home",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
    tags: ["vacuum", "cordless", "premium", "hepa", "dyson"],
    inStock: true,
    viewCount: 680
  },
  {
    name: "Philips Hue Smart Bulb",
    description: "Bóng đèn thông minh Philips Hue, có thể điều khiển qua app và Alexa",
    price: 890000,
    originalPrice: 1200000,
    discount: 26,
    category: "home",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
    tags: ["smart-home", "led", "wifi", "philips", "automation"],
    inStock: true,
    viewCount: 240
  },
  {
    name: "Nespresso Vertuo Coffee Machine",
    description: "Máy pha cà phê Nespresso Vertuo với công nghệ Centrifusion và 4 kích cỡ cốc",
    price: 4500000,
    originalPrice: 5500000,
    discount: 18,
    category: "home",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    tags: ["coffee", "nespresso", "machine", "premium", "kitchen"],
    inStock: true,
    viewCount: 380
  },

  // Sports & Fitness
  {
    name: "Wilson Pro Staff Tennis Racket",
    description: "Vợt tennis Wilson Pro Staff với công nghệ Countervail và thiết kế chuyên nghiệp",
    price: 4200000,
    originalPrice: 4800000,
    discount: 13,
    category: "sports",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
    tags: ["tennis", "wilson", "professional", "racket", "sports"],
    inStock: true,
    viewCount: 290
  },
  {
    name: "Nike Basketball Official",
    description: "Bóng rổ Nike chính hãng, size 7, phù hợp cho thi đấu và luyện tập chuyên nghiệp",
    price: 450000,
    originalPrice: 500000,
    discount: 10,
    category: "sports",
    image: "https://images.unsplash.com/photo-1546519638-68e10945ff65?w=400",
    tags: ["basketball", "nike", "official", "sports", "ball"],
    inStock: true,
    viewCount: 180
  },
  {
    name: "Yoga Mat Premium 6mm",
    description: "Thảm tập yoga cao cấp, chống trượt, dày 6mm, kích thước 183x61cm",
    price: 450000,
    originalPrice: 600000,
    discount: 25,
    category: "sports",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    tags: ["yoga", "fitness", "non-slip", "mat", "exercise"],
    inStock: true,
    viewCount: 180
  },
  {
    name: "Peloton Exercise Bike",
    description: "Xe đạp tập Peloton với màn hình cảm ứng 22 inch và các bài tập trực tuyến",
    price: 15990000,
    originalPrice: 18990000,
    discount: 16,
    category: "sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    tags: ["bike", "exercise", "peloton", "fitness", "indoor"],
    inStock: false,
    viewCount: 320
  },

  // Beauty & Personal Care
  {
    name: "L'Oreal Revitalift Serum",
    description: "Serum chống lão hóa L'Oreal Revitalift với Pro-Retinol và Vitamin C",
    price: 890000,
    originalPrice: 1200000,
    discount: 26,
    category: "beauty",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a18?w=400",
    tags: ["skincare", "anti-aging", "serum", "loreal", "beauty"],
    inStock: true,
    viewCount: 420
  },
  {
    name: "Estée Lauder Advanced Night Repair",
    description: "Serum dưỡng da ban đêm Estée Lauder Advanced Night Repair với công nghệ Chronolux",
    price: 2500000,
    originalPrice: 3000000,
    discount: 17,
    category: "beauty",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a18?w=400",
    tags: ["skincare", "night-cream", "estee-lauder", "premium", "anti-aging"],
    inStock: true,
    viewCount: 280
  },
  {
    name: "Dyson Supersonic Hair Dryer",
    description: "Máy sấy tóc Dyson Supersonic với công nghệ Air Multiplier và thiết kế ergonomic",
    price: 8900000,
    originalPrice: 10990000,
    discount: 19,
    category: "beauty",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
    tags: ["hair-dryer", "dyson", "premium", "hair-care", "styling"],
    inStock: true,
    viewCount: 150
  },

  // Toys & Games
  {
    name: "LEGO Creator Expert Modular Building",
    description: "Bộ xếp hình LEGO Creator Expert Modular Building, 2568 mảnh ghép, dành cho người lớn",
    price: 3200000,
    originalPrice: 3500000,
    discount: 9,
    category: "toys",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
    tags: ["lego", "building", "collector", "adult", "creative"],
    inStock: true,
    viewCount: 150
  },
  {
    name: "PlayStation 5 Console",
    description: "Máy chơi game PlayStation 5 với SSD siêu nhanh và ray tracing",
    price: 12990000,
    originalPrice: 14990000,
    discount: 13,
    category: "toys",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
    tags: ["gaming", "playstation", "console", "ps5", "entertainment"],
    inStock: false,
    viewCount: 2500
  },
  {
    name: "Nintendo Switch OLED",
    description: "Máy chơi game Nintendo Switch OLED với màn hình 7 inch và Joy-Con controllers",
    price: 8990000,
    originalPrice: 9990000,
    discount: 10,
    category: "toys",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
    tags: ["gaming", "nintendo", "switch", "portable", "family"],
    inStock: true,
    viewCount: 1800
  },

  // Food & Beverages
  {
    name: "Organic Green Tea Premium",
    description: "Trà xanh hữu cơ cao cấp, 100g, từ vùng trà Shan Tuyết Việt Nam",
    price: 180000,
    originalPrice: 200000,
    discount: 10,
    category: "food",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    tags: ["tea", "organic", "premium", "vietnamese", "healthy"],
    inStock: true,
    viewCount: 95
  },
  {
    name: "Nespresso Coffee Capsules Variety Pack",
    description: "Bộ 50 viên nang cà phê Nespresso đa dạng hương vị, phù hợp cho máy Nespresso",
    price: 450000,
    originalPrice: 550000,
    discount: 18,
    category: "food",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    tags: ["coffee", "nespresso", "capsules", "variety", "premium"],
    inStock: true,
    viewCount: 120
  },
  {
    name: "KitchenAid Stand Mixer",
    description: "Máy trộn bột KitchenAid Stand Mixer với 5 quart bowl và 10 tốc độ",
    price: 8900000,
    originalPrice: 10990000,
    discount: 19,
    category: "food",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    tags: ["kitchen", "mixer", "kitchenaid", "baking", "appliance"],
    inStock: true,
    viewCount: 180
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting to seed database with enhanced data...');
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${products.length} products`);
    
    // Index products in Elasticsearch (if enabled)
    console.log('🔍 Indexing products in Elasticsearch...');
    let indexedCount = 0;
    for (const product of products) {
      try {
        await indexProduct(product);
        indexedCount++;
      } catch (error) {
        console.log(`⚠️ Failed to index product ${product.name}:`, error.message);
      }
    }
    console.log(`📊 Indexed ${indexedCount}/${products.length} products in Elasticsearch`);
    
    // Display summary
    console.log('\n📈 Database Seeding Summary:');
    console.log(`📦 Total products: ${products.length}`);
    console.log(`📱 Electronics: ${products.filter(p => p.category === 'electronics').length}`);
    console.log(`👕 Clothing: ${products.filter(p => p.category === 'clothing').length}`);
    console.log(`📚 Books: ${products.filter(p => p.category === 'books').length}`);
    console.log(`🏠 Home: ${products.filter(p => p.category === 'home').length}`);
    console.log(`⚽ Sports: ${products.filter(p => p.category === 'sports').length}`);
    console.log(`💄 Beauty: ${products.filter(p => p.category === 'beauty').length}`);
    console.log(`🧸 Toys: ${products.filter(p => p.category === 'toys').length}`);
    console.log(`🍵 Food: ${products.filter(p => p.category === 'food').length}`);
    console.log(`💰 Average price: ${Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length).toLocaleString()} VND`);
    console.log(`🏷️ Average discount: ${Math.round(products.reduce((sum, p) => sum + p.discount, 0) / products.length)}%`);
    console.log(`👁️ Average views: ${Math.round(products.reduce((sum, p) => sum + p.viewCount, 0) / products.length)}`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('🚀 Ready for fuzzy search and advanced filtering!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleProducts };