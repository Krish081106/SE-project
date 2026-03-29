const mongoose = require('mongoose');
const Order = require('./models/Order');
const Product = require('./models/Product');
const connectDB = require('./db');
require('dotenv').config();

connectDB().then(async () => {
   const products = await Product.find({});
   console.log("Products in DB:", products.map(p => ({ name: p.name, id: p.id, stock: p.stock })));
   const orders = await Order.find({});
   console.log("Orders in DB:", orders.length);
   process.exit(0);
}).catch(err => {
   console.error(err);
   process.exit(1);
});
