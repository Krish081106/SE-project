require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Settings = require('./models/Settings');

// Initial Mock Data from src/data/mockData.js
const mockProducts = [
    { id: 'PROD-001', name: 'Wireless Headphones', category: 'Electronics', price: 99.99, stock: 45, status: 'In Stock' },
    { id: 'PROD-002', name: 'Mechanical Keyboard', category: 'Electronics', price: 129.50, stock: 12, status: 'Low Stock' },
    { id: 'PROD-003', name: 'Ergonomic Mouse', category: 'Accessories', price: 49.99, stock: 0, status: 'Out of Stock' },
    { id: 'PROD-004', name: 'USB-C Hub', category: 'Accessories', price: 29.99, stock: 88, status: 'In Stock' },
    { id: 'PROD-005', name: 'Monitor Stand', category: 'Furniture', price: 65.00, stock: 23, status: 'In Stock' },
    { id: 'PROD-006', name: 'Webcam 1080p', category: 'Electronics', price: 79.99, stock: 5, status: 'Low Stock' },
    { id: 'PROD-007', name: 'Desk Pad', category: 'Accessories', price: 15.00, stock: 120, status: 'In Stock' },
];

const mockOrders = [
    { id: 'ORD-2023-001', customer: 'Alice Johnson', date: '2023-10-25', total: 149.98, items: 2, status: 'Completed' },
    { id: 'ORD-2023-002', customer: 'Bob Smith', date: '2023-10-25', total: 29.99, items: 1, status: 'Completed' },
    { id: 'ORD-2023-003', customer: 'Charlie Brown', date: '2023-10-24', total: 259.00, items: 3, status: 'Pending' },
    { id: 'ORD-2023-004', customer: 'Diana Prince', date: '2023-10-24', total: 99.99, items: 1, status: 'Completed' },
];

const seedData = async () => {
    try {
        await connectDB();

        console.log('Clearing existing data...');
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Settings.deleteMany({});

        console.log('Inserting mock products...');
        await Product.insertMany(mockProducts);

        console.log('Inserting mock orders...');
        await Order.insertMany(mockOrders);

        console.log('Inserting default settings...');
        await Settings.create({ darkMode: false, currency: 'INR' });

        console.log('Data seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error with data seeding: ${error.message}`);
        process.exit(1);
    }
};

seedData();
