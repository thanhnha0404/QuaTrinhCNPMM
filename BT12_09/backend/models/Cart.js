const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false // Allow anonymous carts
    },
    sessionId: {
        type: String,
        required: false // For anonymous users
    },
    items: [cartItemSchema],
    totalAmount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Calculate total amount before saving
cartSchema.pre('save', async function(next) {
    if (this.items.length > 0) {
        const Product = mongoose.model('product');
        let total = 0;
        
        for (const item of this.items) {
            const product = await Product.findById(item.product);
            if (product) {
                total += product.price * item.quantity;
            }
        }
        
        this.totalAmount = total;
    } else {
        this.totalAmount = 0;
    }
    
    next();
});

// Index for better query performance
cartSchema.index({ user: 1, isActive: 1 });
cartSchema.index({ sessionId: 1, isActive: 1 });

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;
