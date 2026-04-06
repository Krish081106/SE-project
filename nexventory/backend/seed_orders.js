require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = (arr) => arr[randomInt(0, arr.length - 1)];

const names = [
    "Rahul Sharma", "Priya Singh", "Amit Patel", "Neha Gupta", 
    "Ramesh Kumar", "Suresh Verma", "Anjali Yadav", "Vikram Malhotra", 
    "Meera Reddy", "Sunil Joshi", "Pooja Mishra", "Sanjay Das", 
    "Kiran Rao", "Deepak Jain", "Kavita Desai", "Aarti Iyer",
    "Mohit Chawla", "Karan Singh", "Simran Kaur", "Manoj Tiwari",
    "Ajay Jha", "Rajesh Pillai", "Gaurav Bhatt"
];

const seedOrders = async () => {
    await connectDB();

    const user = await User.findOne();
    if (!user) {
        console.error("No user found.");
        process.exit(1);
    }

    const products = await Product.find({ user: user._id });
    if (products.length === 0) {
        console.error("No products found. Please seed products first.");
        process.exit(1);
    }

    const ordersToInsert = [];
    let orderCounter = 1;

    // Loop backwards for 15 days (including today)
    for (let i = 14; i >= 0; i--) {
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - i);
        const dateString = orderDate.toISOString().split('T')[0];

        const numOrders = randomInt(1, 5);

        for (let j = 0; j < numOrders; j++) {
            const customerName = randomElement(names);
            const numItems = randomInt(1, 4); // 1 to 4 distinct items per order

            const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
            const selectedProducts = shuffledProducts.slice(0, numItems);

            let totalAmount = 0;
            const items = selectedProducts.map(p => {
                const quantity = randomInt(1, 3); // 1 to 3 units per item
                const total = p.price * quantity;
                totalAmount += total;
                return {
                    productId: p.id,
                    name: p.name,
                    quantity: quantity,
                    price: p.price,
                    wholesalePrice: p.wholesalePrice,
                    total: total
                };
            });

            // unique order ID based on timestamp and counter
            const uniqueTimestamp = Date.now().toString().slice(-6);
            const orderId = `ORD-${uniqueTimestamp}-${orderCounter++}`;

            const order = {
                user: user._id,
                id: orderId,
                customer: customerName,
                date: dateString,
                totalAmount: totalAmount,
                items: items,
                status: 'Completed'
            };
            ordersToInsert.push(order);
        }
    }

    try {
        // Clear old mock data orders for pure historical test data, or just append
        // Not clearing to keep what they might already have, just injecting new ones
        await Order.insertMany(ordersToInsert);
        console.log(`Successfully seeded ${ordersToInsert.length} orders over the last 15 days.`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding orders:", error);
        process.exit(1);
    }
};

seedOrders();
