export const mockProducts = [
    { id: 'PROD-001', name: 'Wireless Headphones', category: 'Electronics', price: 99.99, stock: 45, status: 'In Stock' },
    { id: 'PROD-002', name: 'Mechanical Keyboard', category: 'Electronics', price: 129.50, stock: 12, status: 'Low Stock' },
    { id: 'PROD-003', name: 'Ergonomic Mouse', category: 'Accessories', price: 49.99, stock: 0, status: 'Out of Stock' },
    { id: 'PROD-004', name: 'USB-C Hub', category: 'Accessories', price: 29.99, stock: 88, status: 'In Stock' },
    { id: 'PROD-005', name: 'Monitor Stand', category: 'Furniture', price: 65.00, stock: 23, status: 'In Stock' },
    { id: 'PROD-006', name: 'Webcam 1080p', category: 'Electronics', price: 79.99, stock: 5, status: 'Low Stock' },
    { id: 'PROD-007', name: 'Desk Pad', category: 'Accessories', price: 15.00, stock: 120, status: 'In Stock' },
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
