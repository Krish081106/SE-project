# System Architecture Update: MongoDB User-Data Isolation & Persistence

This document formally details the backend architectural changes implemented in Nexventory to permanently bind Products, Orders, and Dashboard Metrics to fully authenticated Mongoose User sessions, isolating all multi-tenant data dynamically.

## 1. Mongoose Schema Data-Mapping Updates

To create a hard relationship between an authenticated user and their specific inventory, the `.Schema.Types.ObjectId` reference was injected natively into the root models.

### `models/Product.js`
```javascript
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    // User Relationship Mapping
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    status: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
```

### `models/Order.js`
```javascript
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    // User Relationship Mapping
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    id: { type: String, required: true },
    customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true }
    },
    items: [{
        productId: String,
        name: String,
        quantity: Number,
        price: Number,
        total: Number
    }],
    totalAmount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'Completed' }
});

module.exports = mongoose.model('Order', OrderSchema);
```

## 2. Authentication Security Middleware

This middleware intercepts every incoming API request from the React frontend, dynamically unwraps the JWT Bearer Token, and validates that the requesting account is an authentic logged-in session. It binds the active user's internal ID to `req.user` so it can be securely passed to the Mongoose query controllers.

### `middleware/authMiddleware.js`
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Unpack Bearer Token
            token = req.headers.authorization.split(' ')[1];

            // Validate Signature against `.env` Secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexventory_secret_key');

            // Hardcode User Payload
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
```

## 3. Authenticated Mongoose Query Logic (Controllers)

All `index.js` Controller routes were strictly converted from blind global reads (`Product.find({})`) to authenticated filter mappings (`Product.find({ user: req.user.id })`). 

### `index.js` Backend Logic
```javascript
const express = require('express');
const { protect } = require('./middleware/authMiddleware');
const Product = require('./models/Product');
const Order = require('./models/Order');
const router = express.Router();

// GET Products: Authenticated Querying
router.get('/api/products', protect, async (req, res) => {
    try {
        // Enforces full isolation. Users can physically only request their own documents.
        const products = await Product.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST Products: Data Injection on Save
router.post('/api/products', protect, async (req, res) => {
    try {
        const { id, name, category, price, stock, status } = req.body;

        // Binds the active authenticated ID securely behind the API curtain before saving
        const newProduct = new Product({
            user: req.user.id, 
            id,
            name,
            category,
            price,
            stock,
            status
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create isolated product' });
    }
});

// GET Orders: Authenticated Querying
router.get('/api/orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST Orders: Data Injection on Save
router.post('/api/orders', protect, async (req, res) => {
    try {
        const orderData = req.body;
        
        const newOrder = new Order({
            ...orderData,
            user: req.user.id  // Enforce Binding
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
```
