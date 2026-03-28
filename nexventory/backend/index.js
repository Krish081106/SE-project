require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const mockData = {
    products: [
        { id: 'PROD-001', name: 'Wireless Headphones', category: 'Electronics', price: 99.99, stock: 45, status: 'In Stock' },
        { id: 'PROD-002', name: 'Mechanical Keyboard', category: 'Electronics', price: 129.50, stock: 12, status: 'Low Stock' },
        { id: 'PROD-003', name: 'Ergonomic Mouse', category: 'Accessories', price: 49.99, stock: 0, status: 'Out of Stock' },
        { id: 'PROD-004', name: 'USB-C Hub', category: 'Accessories', price: 29.99, stock: 88, status: 'In Stock' },
    ],
    orders: [
        { id: 'ORD-2023-001', customer: 'Alice Johnson', date: '2023-10-25', total: 149.98, items: 2, status: 'Completed' },
        { id: 'ORD-2023-002', customer: 'Bob Smith', date: '2023-10-25', total: 29.99, items: 1, status: 'Completed' },
    ]
};

const app = express();
const PORT = process.env.PORT || 5000;

const Product = require('./models/Product');
const Order = require('./models/Order');
const { protect } = require('./middleware/authMiddleware');

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.send('Nexventory API is running');
});

// Protect all /api/products and /api/orders routes
app.use('/api/products', protect);
app.use('/api/orders', protect);

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({ user: req.user.id });
        if (products.length === 0) {
            return res.json([]);
        }
        res.json(products);
    } catch (error) {
        console.warn('DB Fetch failed, falling back to mock data');
        res.json(mockData.products);
    }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id });
        if (orders.length === 0) {
            return res.json([]);
        }
        res.json(orders);
    } catch (error) {
        console.warn('DB Fetch failed, falling back to mock data');
        res.json(mockData.orders);
    }
});

// Create a product
app.post('/api/products', async (req, res) => {
    try {
        const { name, category, price, stock } = req.body;
        
        // Simple status logic
        let status = 'In Stock';
        if (stock === 0) status = 'Out of Stock';
        else if (stock < 10) status = 'Low Stock';

        const newProduct = new Product({
            user: req.user.id,
            id: `PROD-${Date.now().toString().slice(-4)}`,
            name,
            category,
            price,
            stock,
            status
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { stock } = req.body;
        
        // Update status if stock is provided
        if (stock !== undefined) {
            if (stock === 0) req.body.status = 'Out of Stock';
            else if (stock < 10) req.body.status = 'Low Stock';
            else req.body.status = 'In Stock';
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ id: req.params.id, user: req.user.id });
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create an Order with Stock Deduction
app.post('/api/orders', async (req, res) => {
    try {
        const { customer, items, totalAmount, date } = req.body;

        // 1. Verify and Update Stock for each item
        for (const item of items) {
            const product = await Product.findOne({ id: item.productId, user: req.user.id });
            
            if (!product) {
                return res.status(404).json({ message: `Product ${item.productId} not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            // Deduct stock
            product.stock -= item.quantity;
            
            // Update status
            if (product.stock === 0) product.status = 'Out of Stock';
            else if (product.stock < 10) product.status = 'Low Stock';
            else product.status = 'In Stock';

            await product.save();
        }

        // 2. Create the Order
        const newOrder = new Order({
            user: req.user.id,
            id: `ORD-${Date.now().toString().slice(-4)}`,
            customer,
            items,
            totalAmount,
            date: date || new Date().toISOString().split('T')[0],
            status: 'Completed'
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update Order Status
app.put('/api/orders/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
