const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys', 'food']
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/300x300?text=No+Image'
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    viewCount: {
        type: Number,
        default: 0,
        min: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    weight: {
        type: Number,
        min: 0
    },
    dimensions: {
        length: { type: Number, min: 0 },
        width: { type: Number, min: 0 },
        height: { type: Number, min: 0 }
    },
    brand: {
        type: String,
        trim: true
    },
    sku: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    }
}, {
    timestamps: true
});

// Index for better query performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1, rating: -1 });
productSchema.index({ viewCount: -1, createdAt: -1 });
productSchema.index({ tags: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });

const Product = mongoose.model('product', productSchema);

module.exports = Product;
