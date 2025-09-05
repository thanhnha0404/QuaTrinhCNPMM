require('dotenv').config();
const mongoose = require("mongoose");
const Product = require("./models/product");

mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedProducts = async () => {
  try {
    // Xóa dữ liệu cũ
    await Product.deleteMany({});

    // Tạo mảng sản phẩm mẫu
    const products = [];
    for (let i = 1; i <= 50; i++) {
      products.push({
        name: `Sản phẩm ${i}`,
        price: Math.floor(Math.random() * 1000000) + 10000,
        image: `https://picsum.photos/200?random=${i}`,
      });
    }

    // Lưu vào DB
    await Product.insertMany(products);
    console.log("✅ Seed thành công 50 sản phẩm!");
    process.exit();
  } catch (error) {
    console.error("❌ Lỗi khi seed:", error);
    process.exit(1);
  }
};

seedProducts();