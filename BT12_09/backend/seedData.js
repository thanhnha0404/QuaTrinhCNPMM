const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: "iPhone 15 Pro",
    description: "Latest iPhone with advanced camera system",
    price: 999,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
    stock: 50,
    rating: 4.8,
    brand: "Apple",
    sku: "IPH15PRO-001",
    tags: ["smartphone", "apple", "premium"],
    isFeatured: true
  },
  {
    name: "Samsung Galaxy S24",
    description: "Powerful Android smartphone with AI features",
    price: 799,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
    stock: 30,
    rating: 4.6,
    brand: "Samsung",
    sku: "SGS24-001",
    tags: ["smartphone", "android", "ai"]
  },
  {
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with Air Max technology",
    price: 150,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
    stock: 100,
    rating: 4.4,
    brand: "Nike",
    sku: "NAM270-001",
    tags: ["shoes", "running", "nike"]
  },
  {
    name: "MacBook Pro M3",
    description: "Professional laptop with M3 chip",
    price: 1999,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
    stock: 25,
    rating: 4.9,
    brand: "Apple",
    sku: "MBPM3-001",
    tags: ["laptop", "apple", "professional"],
    isFeatured: true
  },
  {
    name: "The Great Gatsby",
    description: "Classic American novel by F. Scott Fitzgerald",
    price: 12,
    category: "books",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop",
    stock: 200,
    rating: 4.7,
    brand: "Penguin Classics",
    sku: "TGG-001",
    tags: ["classic", "literature", "american"]
  },
  {
    name: "Coffee Maker Deluxe",
    description: "Automatic coffee maker with timer",
    price: 89,
    category: "home",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop",
    stock: 75,
    rating: 4.3,
    brand: "KitchenAid",
    sku: "CMD-001",
    tags: ["coffee", "kitchen", "appliance"]
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat for all exercises",
    price: 45,
    category: "sports",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
    stock: 150,
    rating: 4.5,
    brand: "Lululemon",
    sku: "YMP-001",
    tags: ["yoga", "fitness", "mat"]
  },
  {
    name: "Skincare Set",
    description: "Complete skincare routine set",
    price: 120,
    category: "beauty",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300&h=300&fit=crop",
    stock: 80,
    rating: 4.2,
    brand: "The Ordinary",
    sku: "SS-001",
    tags: ["skincare", "beauty", "routine"]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL || 'mongodb://localhost:27017/fullstackdb');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Inserted sample products');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
