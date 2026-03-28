const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

dotenv.config();

const indianProducts = [
    { name: 'Aashirvaad Shudh Chakki Atta', category: 'Groceries', price: 210, stock: 45 },
    { name: 'Amul Taaza Toned Milk (1L)', category: 'Dairy', price: 68, stock: 120 },
    { name: 'Parle-G Biscuit Family Pack', category: 'Snacks', price: 40, stock: 200 },
    { name: 'Tata Salt (1kg)', category: 'Groceries', price: 24, stock: 150 },
    { name: 'Maggi 2-Minute Noodles (4 Pack)', category: 'Snacks', price: 56, stock: 85 },
    { name: 'Brooke Bond Red Label Tea (500g)', category: 'Beverages', price: 250, stock: 40 },
    { name: 'Haldiram\'s Bhujia Sev', category: 'Snacks', price: 105, stock: 65 },
    { name: 'Fortune Sunlite Refined Oil (1L)', category: 'Groceries', price: 135, stock: 60 },
    { name: 'Dabur Honey (500g)', category: 'Groceries', price: 175, stock: 35 },
    { name: 'Amul Butter (500g)', category: 'Dairy', price: 270, stock: 45 },
    { name: 'Everest Garam Masala (100g)', category: 'Spices', price: 82, stock: 90 },
    { name: 'Surf Excel Quick Wash (1kg)', category: 'Household', price: 205, stock: 55 },
    { name: 'Colgate Strong Teeth (200g)', category: 'Personal Care', price: 112, stock: 75 },
    { name: 'Thumbs Up (2.25L)', category: 'Beverages', price: 95, stock: 48 },
    { name: 'Gowardhan Ghee (1L)', category: 'Dairy', price: 650, stock: 25 },
];

const indianNames = [
    'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Gupta', 'Vikram Singh',
    'Neha Desai', 'Rohan Mehta', 'Pooja Joshi', 'Aditya Verma', 'Riya Shah',
    'Karan Reddy', 'Ananya Iyer', 'Arjun Kapoor', 'Meera Nair', 'Siddharth Rao',
    'Kavya Menon', 'Rajesh Tiwari', 'Swati Mishra', 'Deepak Chauhan', 'Divya Ahuja'
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nexventory');
        console.log('MongoDB Connected.');

        const user = await User.findOne({ name: { $regex: /manthan amreliya/i } }).sort({ createdAt: -1 });
        
        if (!user) {
            console.error('Account named Manthan Amreliya not found! Cannot seed isolated data.');
            process.exit(1);
        }

        console.log(`Seeding data for User: ${user.name} (${user._id})`);

        // Clear existing data for this user
        await Product.deleteMany({ user: user._id });
        await Order.deleteMany({ user: user._id });
        console.log('Cleared existing products and orders for this user.');

        // Insert Products
        const createdProducts = [];
        for (let i = 0; i < indianProducts.length; i++) {
            const p = indianProducts[i];
            let status = 'In Stock';
            if (p.stock === 0) status = 'Out of Stock';
            else if (p.stock < 10) status = 'Low Stock';

            const newProduct = await Product.create({
                user: user._id,
                id: `PROD-${Date.now().toString().slice(-4) + i}`,
                name: p.name,
                category: p.category,
                price: p.price,
                stock: p.stock,
                status: status
            });
            createdProducts.push(newProduct);
        }
        console.log(`Inserted ${createdProducts.length} Indian products.`);

        // Insert 50 Orders (5 per day for 10 days)
        let totalOrders = 0;
        const now = new Date();
        
        for (let dayOffset = 0; dayOffset < 10; dayOffset++) {
            for (let orderNum = 0; orderNum < 5; orderNum++) {
                // Pick 1-3 random products for this order
                const numItems = Math.floor(Math.random() * 3) + 1;
                const items = [];
                let orderTotal = 0;
                
                for (let k = 0; k < numItems; k++) {
                    const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
                    const quantity = Math.floor(Math.random() * 3) + 1;
                    const price = randomProduct.price;
                    const total = price * quantity;
                    
                    // Deduct stock natively? The prompt says "fill the details properly" 
                    // But we already set static stock above. Since this is an offline seeder,
                    // we can just leave the stock as-is for the demo or deduct it. 
                    // Let's just generate the historical orders.
                    
                    items.push({
                        productId: randomProduct.id,
                        name: randomProduct.name,
                        quantity,
                        price,
                        total
                    });
                    
                    orderTotal += total;
                }

                // Random customer
                const randomCustomer = indianNames[Math.floor(Math.random() * indianNames.length)];
                
                // Historical Date (current time minus dayOffset days, minus some random hours)
                const orderDate = new Date(now);
                orderDate.setDate(orderDate.getDate() - dayOffset);
                orderDate.setHours(orderDate.getHours() - Math.floor(Math.random() * 10));

                await Order.create({
                    user: user._id,
                    id: `ORD-${Date.now().toString().slice(-4)}${dayOffset}${orderNum}`,
                    customer: { name: randomCustomer, phone: '9' + Math.floor(Math.random() * 900000000 + 100000000) },
                    items: items,
                    totalAmount: orderTotal,
                    date: orderDate.toISOString(),
                    status: 'Completed'
                });
                totalOrders++;
            }
        }

        console.log(`Inserted ${totalOrders} historical orders across 10 days.`);
        console.log('Database Seeding Completed Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error with Seeder: ', error);
        process.exit(1);
    }
};

seedDatabase();
