require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const User = require('./models/User');
const Product = require('./models/Product');

const seedGeneralShopItems = async () => {
    await connectDB();

    const user = await User.findOne();

    if (!user) {
        console.error("No user found in the database. Please create an account in the UI first.");
        process.exit(1);
    }

    const items = [
        { name: "Aashirvaad Whole Wheat Atta 5kg", category: "Groceries", price: 230, wholesalePrice: 200, stock: 50 },
        { name: "Tata Salt 1kg", category: "Groceries", price: 28, wholesalePrice: 22, stock: 100 },
        { name: "Maggi 2-Minute Noodles", category: "Snacks", price: 14, wholesalePrice: 12, stock: 200 },
        { name: "Amul Butter 100g", category: "Dairy", price: 58, wholesalePrice: 50, stock: 30 },
        { name: "Surf Excel Easy Wash 1kg", category: "Cleaning", price: 135, wholesalePrice: 110, stock: 40 },
        { name: "Parle-G Biscuits 130g", category: "Snacks", price: 10, wholesalePrice: 8, stock: 150 },
        { name: "Brooke Bond Red Label Tea 500g", category: "Beverages", price: 250, wholesalePrice: 210, stock: 25 },
        { name: "Nescafe Classic Coffee 50g", category: "Beverages", price: 170, wholesalePrice: 140, stock: 20 },
        { name: "Dettol Antiseptic Liquid 250ml", category: "Personal Care", price: 125, wholesalePrice: 105, stock: 35 },
        { name: "Colgate MaxFresh Toothpaste 150g", category: "Personal Care", price: 115, wholesalePrice: 95, stock: 60 },
        { name: "Dove Cream Beauty Bathing Bar 100g", category: "Personal Care", price: 65, wholesalePrice: 55, stock: 80 },
        { name: "Daawat Rozana Basmati Rice 5kg", category: "Groceries", price: 450, wholesalePrice: 380, stock: 15 },
        { name: "Haldiram Bhujia Sev 400g", category: "Snacks", price: 110, wholesalePrice: 90, stock: 40 },
        { name: "Fortune Sunlite Refined Sunflower Oil 1L", category: "Groceries", price: 140, wholesalePrice: 115, stock: 45 },
        { name: "Vim Dishwash Gel 500ml", category: "Cleaning", price: 115, wholesalePrice: 95, stock: 50 }
    ];

    const productsToInsert = items.map((item, index) => {
        let status = 'In Stock';
        if (item.stock === 0) status = 'Out of Stock';
        else if (item.stock < 10) status = 'Low Stock';

        return {
            ...item,
            user: user._id,
            id: `PROD-${Date.now().toString().slice(-4)}${index}`,
            status
        };
    });

    try {
        await Product.insertMany(productsToInsert);
        console.log("Successfully seeded 15 items for general inventory shop in India.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding items:", error.message);
        process.exit(1);
    }
};

seedGeneralShopItems();
