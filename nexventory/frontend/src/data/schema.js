/**
 * Nexventory Database Schema Documentation
 * 
 * This file defines the MongoDB schema structures used in the application.
 * Although the app currently uses local mock data, these schemas represent 
 * the structure for a future backend integration.
 */

// 1. Products Collection
// Stores inventory item details
const ProductSchema = {
    _id: "ObjectId",           // Unique identifier
    name: "String",            // Product name
    category: "String",        // Category (Electronics, Accessories, etc.)
    price: "Number",           // Unit price
    stock: "Number",           // Current stock quantity
    status: "String",          // "In Stock" | "Low Stock" | "Out of Stock"
    createdAt: "Date",
    updatedAt: "Date"
};

// 2. Orders Collection
// Stores sales history and order details
const OrderSchema = {
    _id: "ObjectId",           // Unique identifier
    billId: {                  // Custom formatted ID (e.g., INV-123456)
        type: "String",
        unique: true
    },
    customer: {
        name: "String",
        phone: "String",         // Optional
        email: "String"          // Optional
    },
    items: [                   // Array of purchased items
        {
            productId: "ObjectId", // Reference to Products collection
            name: "String",        // Snapshot of product name at time of sale
            price: "Number",       // Snapshot of price at time of sale
            quantity: "Number",
            total: "Number"        // price * quantity
        }
    ],
    totalAmount: "Number",     // Grand total including tax
    taxAmount: "Number",       // Calculated tax
    status: "String",          // "Completed" | "Pending" | "Cancelled"
    date: "Date",              // Transaction timestamp
    paymentMethod: "String"    // "Cash" | "Card" | "Online"
};

// 3. Settings Collection
// Stores application configuration
const SettingsSchema = {
    _id: "ObjectId",
    darkMode: "Boolean",
    currency: {
        type: "String",
        default: "INR"
    },
    notifications: {
        email: "Boolean",
        push: "Boolean"
    },
    security: {
        twoFactorEnabled: "Boolean"
    }
};

// 4. Users Collection (Future Scope)
// For authentication and role management
const UserSchema = {
    _id: "ObjectId",
    username: "String",
    email: "String",
    passwordHash: "String",
    role: "String",            // "Admin" | "Staff"
    avatar: "String"           // URL to avatar image
};

export const Schemas = {
    Product: ProductSchema,
    Order: OrderSchema,
    Settings: SettingsSchema,
    User: UserSchema
};
