require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./db');

const customers = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Rohan Gupta', 'Neha Singh', 
    'Vikram Malhotra', 'Anjali Desai', 'Suresh Menon', 'Kavita Iyer', 'Manish Reddy',
    'Arjun Nair', 'Sneha Kapoor', 'Manoj Tiwari', 'Pooja Bhatia', 'Aditya Verma',
    'Simran Kaur', 'Rahul Jain', 'Deepak Chawla', 'Meera Rajput', 'Sunil Joshi',
    'Tarun Sharma', 'Gita Patel', 'Kiran Kumar', 'Riya Desai', 'Sanjay Singh'
];

async function seed() {
    await connectDB();
    
    try {
        // Remove 2023 orders
        const deleted = await Order.deleteMany({ date: { $regex: '^2023' } });
        console.log(`Deleted ${deleted.deletedCount} old mock orders from 2023.`);
        
        // Fetch products
        const products = await Product.find({});
        if(products.length === 0) {
            console.log("No products available to generate orders.");
            process.exit(1);
        }
        
        // Generate orders for the last 15 days
        const today = new Date();
        let totalCreated = 0;
        
        // Loop through each of the last 15 days
        for (let i = 14; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            
            // 5 to 12 orders per day to look realistic
            const numOrdersThisDay = Math.floor(Math.random() * 8) + 5; 
            
            for (let j = 0; j < numOrdersThisDay; j++) {
                const customer = customers[Math.floor(Math.random() * customers.length)];
                const numItems = Math.floor(Math.random() * 4) + 1; // 1 to 4 unique items
                
                const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
                const selectedProducts = shuffledProducts.slice(0, numItems);
                
                const orderItems = [];
                let totalAmount = 0;
                
                for (const p of selectedProducts) {
                    const quantity = Math.floor(Math.random() * 3) + 1; // 1 to 3 of each item
                    
                    // Allow some buffer to generate orders dynamically despite "low" stock, 
                    // but don't negative the stock entirely if not needed.
                    if (p.stock > 0 || Math.random() > 0.5) {
                        const price = Number(p.price);
                        const itemTotal = price * quantity;
                        orderItems.push({ 
                            productId: p.id,
                            name: p.name,
                            price: price,
                            quantity: quantity,
                            total: itemTotal
                        });
                        totalAmount += itemTotal;
                        
                        // Decrease stock 
                        p.stock = Math.max(0, p.stock - quantity);
                        if (p.stock === 0) p.status = 'Out of Stock';
                        else if (p.stock < 10) p.status = 'Low Stock';
                    }
                }
                
                if (orderItems.length > 0) {
                    // Slight variation in status for realism
                    const statusRoll = Math.random();
                    let status = 'Completed';
                    if (i <= 2) { // more recent orders might be pending
                        if (statusRoll > 0.7) status = 'Pending';
                        else if (statusRoll > 0.95) status = 'Cancelled';
                    }
                    
                    const newOrder = new Order({
                        id: `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*1000)}`,
                        customer,
                        items: orderItems,
                        totalAmount: Number(totalAmount.toFixed(2)),
                        date: dateStr,
                        status
                    });
                    await newOrder.save();
                    totalCreated++;
                }
            }
        }
        
        // Save updated product stock
        for(const p of products) {
            await p.save();
        }
        
        console.log(`Successfully generated ${totalCreated} realistic orders spanning the last 15 days.`);
        process.exit(0);
        
    } catch(err) {
        console.error("Error during seeding: ", err);
        process.exit(1);
    }
}

seed();
