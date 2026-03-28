# Nexventory - Complete Codebase Documentation

This document explains exactly how the Nexventory application works, broken down file-by-file to help you understand the architecture, data flow, and code logic.

---

## 🏗️ Backend Architecture (Node.js + Express + MongoDB)
The backend acts as the secure brain of your application. It talks to the database, verifies user passwords, and strictly controls who can see what data.

### `backend/index.js` (The Server Engine)
* **What it is:** The main entry point for your entire backend API.
* **What the code does:** 
  * Connects to your MongoDB database using Mongoose.
  * Sets up `cors` so your React frontend is allowed to talk to it.
  * Defines all the core CRUD (Create, Read, Update, Delete) routes for Products and Orders.
  * It intercepts requests, runs them through the `protect` middleware to ensure the user is logged in, and then fetches data specifically isolated to `req.user.id`.

### `backend/routes/auth.js` (User Registration & Login)
* **What it is:** The security gatekeeper handling user accounts.
* **What the code does:** 
  * `/register`: Accepts a new username, email, and password. It checks if the email already exists, hashes the password for security, and saves the new User to the database.
  * `/login`: Verifies the provided email and password. If matched, it generates a secret JWT (JSON Web Token) that the frontend uses like a "VIP Pass" to access data.

### `backend/models/User.js`
* **What it is:** The MongoDB Schema defining what a "User" looks like.
* **What the code does:** Contains properties like `name`, `email`, `password`, and `mobile`. It includes a pre-save hook that automatically scrambles (hashes) the password using `bcryptjs` before it ever gets saved to the database.

### `backend/models/Product.js` & `backend/models/Order.js`
* **What it is:** The database blue-prints for your inventory and sales.
* **What the code does:** Both files define exactly what data is stored for a product/order (price, stock, customer name). Most importantly, both files contain a `user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }` property. This is the **Multi-Tenancy Isolation** field: it forcibly chains every single product and order uniquely to the account that created it.

### `backend/middleware/authMiddleware.js`
* **What it is:** The bouncer of the data club.
* **What the code does:** Exports a `protect` function. Whenever a protected route (like fetching products) is called, it catches the request, rips open the incoming HTTP Header, pulls out the JWT token, unencrypts it, and verifies exactly which user is making the request. If the token is fake or expired, it immediately returns an HTTP 401 Unauthorized Error.

---

## 🎨 Frontend Architecture (React.js + Vite)
The frontend is the interactive visual layer running in the user's browser. It asks the backend for data and paints it beautifully on the screen.

### `frontend/src/App.jsx`
* **What it is:** The master router and layout orchestrator.
* **What the code does:** It defines the `React Router` paths. It sends unauthenticated users to `/login` or `/` (Landing Page). It wraps all private routes (like `/app/dashboard`) inside a `ProtectedRoute` component, which kicks you back to the login screen if you try to sneak in without a valid account.

### `frontend/src/context/AuthContext.jsx`
* **What it is:** The global memory state for user authentication.
* **What the code does:** It provides a `login`, `register`, and `logout` function to any component in the app. It holds the JWT token in `localStorage` securely so that if the user refreshes the browser, they don't get logged out.

### `frontend/src/context/NexventoryContext.jsx`
* **What it is:** The central nervous system for your inventory data.
* **What the code does:** When a user logs in, this context instantly fires off a `fetch()` request to the backend API. It downloads all of that specific user's Products and Orders and stores them globally in React State arrays (`products`, `orders`). Any mathematical calculation (like Total Revenue or Low Stock limits) happens here so the numbers are always hyper-accurate across all pages.

### `frontend/src/pages/Landing.jsx`
* **What it is:** The public-facing marketing presentation.
* **What the code does:** Simply renders the initial "Smart Inventory Management" header, feature cards, and the main CTA buttons bridging users to Login or Registration.

### `frontend/src/pages/Register.jsx`
* **What it is:** The account creation form.
* **What the code does:** Captures the user's typed inputs. It contains aggressive **Frontend Validation Checkers**: it runs JavaScript Regex string tests instantly rejecting any passwords that don't meet your strict security rules (8 characters + 1 number + 1 symbol) before even bothering the backend server.

### `frontend/src/pages/Dashboard.jsx`
* **What it is:** The analytics headquarters.
* **What the code does:** Reads the numbers processed by `NexventoryContext` and renders them into the main stat blocks. It leverages the `Chart.js` library to visually render the huge blue line-graph mapping out your weekly/monthly sales curves dynamically.

### `frontend/src/pages/Products.jsx`
* **What it is:** The CRUD interface for the inventory database.
* **What the code does:** Displays all items in a beautifully styled table. It handles the "Add New Product" modal form, grabbing the user's typed inputs, packaging them into JSON, and `POST`ing them directly back to the `backend/index.js` route.

### `frontend/src/components/Header.jsx`
* **What it is:** The global top-navigation bar.
* **What the code does:** Contains the current page title and the User Profile dropdown. Importantly, it holds the `handleLogout` function which physically destroys the cached React Memory by aggressively calling `window.location.href = '/'` (a hard refresh) so that future logins on the same device don't see ghost data!
