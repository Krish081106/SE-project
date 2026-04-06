export const mockProducts = [
    { id: 'PROD-001', name: 'Basmati Rice 5kg', category: 'Groceries', price: 12.99, stock: 42, status: 'In Stock' },
    { id: 'PROD-002', name: 'Whole Wheat Flour 5kg', category: 'Groceries', price: 9.49, stock: 30, status: 'In Stock' },
    { id: 'PROD-003', name: 'Sunflower Cooking Oil 1L', category: 'Groceries', price: 4.29, stock: 8, status: 'Low Stock' },
    { id: 'PROD-004', name: 'Brown Bread Loaf', category: 'Bakery', price: 1.99, stock: 0, status: 'Out of Stock' },
    { id: 'PROD-005', name: 'Free-Range Eggs (12 pack)', category: 'Dairy & Eggs', price: 3.99, stock: 55, status: 'In Stock' },
    { id: 'PROD-006', name: 'Organic Milk 1L', category: 'Dairy & Eggs', price: 2.49, stock: 12, status: 'Low Stock' },
    { id: 'PROD-007', name: 'Bananas (1 Dozen)', category: 'Fruits', price: 1.89, stock: 75, status: 'In Stock' },
    { id: 'PROD-008', name: 'Fresh Apples 1kg', category: 'Fruits', price: 3.59, stock: 33, status: 'In Stock' },
    { id: 'PROD-009', name: 'Potatoes 2kg', category: 'Vegetables', price: 2.49, stock: 64, status: 'In Stock' },
    { id: 'PROD-010', name: 'Onions 1kg', category: 'Vegetables', price: 1.79, stock: 95, status: 'In Stock' },
    { id: 'PROD-011', name: 'Sugar 1kg', category: 'Groceries', price: 1.49, stock: 120, status: 'In Stock' },
    { id: 'PROD-012', name: 'Iodized Salt 1kg', category: 'Groceries', price: 0.99, stock: 200, status: 'In Stock' },
];

export const mockOrders = [
    { id: 'ORD-2023-001', customer: 'Alice Johnson', date: '2023-10-25', total: 149.98, items: 2, status: 'Completed' },
    { id: 'ORD-2023-002', customer: 'Bob Smith', date: '2023-10-25', total: 29.99, items: 1, status: 'Completed' },
    { id: 'ORD-2023-003', customer: 'Charlie Brown', date: '2023-10-24', total: 259.00, items: 3, status: 'Pending' },
    { id: 'ORD-2023-004', customer: 'Diana Prince', date: '2023-10-24', total: 99.99, items: 1, status: 'Completed' },
];

export const initialStats = {
    totalStock: 0,
    todayRevenue: 0,
    todayCustomers: 0,
    totalOrders: 0,
    monthOrdersData: [0, 0, 0, 0],
    salesData: {
        weekly: { labels: [], datasets: [{ data: [] }] },
        monthly: { labels: [], datasets: [{ data: [] }] }
    }
};

export const salesData = {
    weekly: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Sales (₹)',
            data: [450, 620, 390, 850, 1200, 950, 780],
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            fill: true,
            tension: 0.4,
        }]
    },
    monthly: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Sales (₹)',
            data: [3200, 4100, 2900, 5600],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4,
        }]
    }
};
