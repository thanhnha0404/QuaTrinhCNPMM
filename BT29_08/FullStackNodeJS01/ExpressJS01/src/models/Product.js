const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      index: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
      enum: [
        "electronics",
        "clothing",
        "books",
        "home",
        "sports",
        "beauty",
        "toys",
        "food",
      ],
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    viewCount: {
      type: Number,
      default: 0,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    tags: [String],
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Tự tạo createdAt, updatedAt
  }
);

// Tránh lỗi OverwriteModelError
module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
