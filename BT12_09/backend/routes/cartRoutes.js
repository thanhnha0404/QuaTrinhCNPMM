const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get cart by sessionId or userId
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const cart = await Cart.findOne({
      $or: [
        { sessionId: identifier },
        { user: identifier }
      ],
      isActive: true
    }).populate('items.product');

    if (!cart) {
      return res.json({ items: [], totalAmount: 0 });
    }

    res.json({
      _id: cart._id,
      items: cart.items,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart
router.post('/:identifier/items', async (req, res) => {
  try {
    const { identifier } = req.params;
    const { productId, quantity = 1 } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Find or create cart
    let cart = await Cart.findOne({
      $or: [
        { sessionId: identifier },
        { user: identifier }
      ],
      isActive: true
    });

    if (!cart) {
      cart = new Cart({
        sessionId: identifier,
        items: []
      });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(item => 
      item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.json({
      _id: cart._id,
      items: cart.items,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item quantity
router.patch('/:identifier/items/:itemId', async (req, res) => {
  try {
    const { identifier, itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({
      $or: [
        { sessionId: identifier },
        { user: identifier }
      ],
      isActive: true
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check stock
    const product = await Product.findById(item.product);
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.json({
      _id: cart._id,
      items: cart.items,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from cart
router.delete('/:identifier/items/:itemId', async (req, res) => {
  try {
    const { identifier, itemId } = req.params;

    const cart = await Cart.findOne({
      $or: [
        { sessionId: identifier },
        { user: identifier }
      ],
      isActive: true
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items.pull(itemId);
    await cart.save();
    await cart.populate('items.product');

    res.json({
      _id: cart._id,
      items: cart.items,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear entire cart
router.delete('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;

    const cart = await Cart.findOne({
      $or: [
        { sessionId: identifier },
        { user: identifier }
      ],
      isActive: true
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({
      _id: cart._id,
      items: [],
      totalAmount: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
