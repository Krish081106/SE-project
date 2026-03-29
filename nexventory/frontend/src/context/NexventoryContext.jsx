import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialStats } from '../data/mockData';
import { useAuth } from './AuthContext';

const API_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;

const NexventoryContext = createContext();

export const useNexventory = () => useContext(NexventoryContext);

export const NexventoryProvider = ({ children }) => {
    const { user } = useAuth();

    // Theme State
    const [darkMode, setDarkMode] = useState(() => {
        try {
            return localStorage.getItem('theme') === 'dark';
        } catch (e) {
            return false;
        }
    });

    // Data State
    const [products, setProducts] = useState(() => {
        try { return JSON.parse(localStorage.getItem('products')) || []; }
        catch { return []; }
    });
    const [orders, setOrders] = useState(() => {
        try { return JSON.parse(localStorage.getItem('orders')) || []; }
        catch { return []; }
    });
    const [stats, setStats] = useState(initialStats);
    const [currency, setCurrency] = useState('INR');
    const [loading, setLoading] = useState(true);

    const getHeaders = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return {
            'Content-Type': 'application/json',
            ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
        };
    };

    // Fetch data from backend
    useEffect(() => {
        if (!user) {
            return;
        }

        const fetchData = async () => {
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    fetch(`${API_URL}/products`, { headers: getHeaders() }),
                    fetch(`${API_URL}/orders`, { headers: getHeaders() })
                ]);

                if (!productsRes.ok || !ordersRes.ok) {
                    throw new Error('Authorized backend fetch failed');
                }

                const productsData = await productsRes.json();
                const ordersData = await ordersRes.json();

                setProducts(Array.isArray(productsData) ? productsData : []);
                setOrders(Array.isArray(ordersData) ? ordersData : []);
            } catch (error) {
                console.warn("Failed to fetch data from backend, preserving local cached data.", error.message);
                // Intentionally NOT overwriting setProducts/setOrders with [] so offline data remains.
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Theme Effect
    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // Background Poll for Real-Team Updates
    useEffect(() => {
        if (!user) return;
        const intervalId = setInterval(() => {
            refreshProducts();
        }, 10000); // Poll every 10 seconds
        return () => clearInterval(intervalId);
    }, [user]);

    const refreshProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/products`, { headers: getHeaders() });
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Failed to refresh products", error);
        }
    };

    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    // Update Stats Effect
    useEffect(() => {
        updateStats();
    }, [products, orders]);

    // Actions
    const toggleDarkMode = () => setDarkMode(prev => !prev);

    const addProduct = async (product) => {
        try {
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(product)
            });
            const data = await response.json();
            setProducts(prev => [data, ...prev]);
        } catch (error) {
            console.error("Failed to add product to backend", error);
            // Fallback for offline usage
            const newProduct = { ...product, id: `PROD-${Date.now().toString().slice(-4)}` };
            setProducts(prev => [newProduct, ...prev]);
        }
    };

    const updateProduct = async (id, updates) => {
        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(updates)
            });
            const data = await response.json();
            setProducts(prev => prev.map(p => p.id === id ? data : p));
        } catch (error) {
            console.error("Failed to update product in backend", error);
            setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        }
    };

    const deleteProduct = async (id) => {
        try {
            await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Failed to delete product from backend", error);
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    const deductStockLocally = (orderItems) => {
        setProducts(prev => {
            const next = [...prev];
            orderItems.forEach(item => {
                const pIndex = next.findIndex(p => p.id === item.productId);
                if (pIndex !== -1) {
                    const newStock = Math.max(0, next[pIndex].stock - (parseInt(item.quantity) || 0));
                    let newStatus = next[pIndex].status;
                    if (newStock === 0) newStatus = 'Out of Stock';
                    else if (newStock < 10) newStatus = 'Low Stock';
                    else newStatus = 'In Stock';
                    next[pIndex] = { ...next[pIndex], stock: newStock, status: newStatus };
                }
            });
            return next;
        });
    };

    const addOrder = async (order) => {
        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(order)
            });
            const data = await response.json();
            
            if (response.ok) {
                setOrders(prev => [data, ...prev]);
                deductStockLocally(order.items);
                // Refresh products to show updated stock
                refreshProducts();
                return true;
            } else {
                alert(data.message || "Failed to place order");
                return false;
            }
        } catch (error) {
            console.error("Failed to add order to backend", error);
            // Fallback
            setOrders(prev => [order, ...prev]);
            deductStockLocally(order.items);
            return true;
        }
    };

    const updateStats = () => {
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        
        const getLocalYYYYMMDD = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const todayStr = getLocalYYYYMMDD(new Date());

        const yesterday = new Date(todayMidnight);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = getLocalYYYYMMDD(yesterday);

        const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

        let todayRevenue = 0;
        let todayProfit = 0;
        const todayCustomers = new Set();
        
        let yesterdayRevenue = 0;
        let yesterdayProfit = 0;
        const yesterdayCustomers = new Set();

        const weekLabels = [];
        const weekData = [];
        const weekProfitData = [];
        const monthLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const monthData = [0, 0, 0, 0];
        const monthProfitData = [0, 0, 0, 0];
        const monthOrdersData = [0, 0, 0, 0];

        const tempDate = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(tempDate);
            d.setDate(tempDate.getDate() - i);
            weekLabels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
            weekData.push(0);
            weekProfitData.push(0);
        }

        orders.forEach(order => {
            const orderTotal = order.totalAmount || order.total || 0;
            const orderDateStr = getLocalYYYYMMDD(new Date(order.date));
            const subtotal = order.items?.reduce((s, i) => s + ((i.price || 0) * (i.quantity || 0)), 0) || 0;
            const wholesaleTotal = order.items?.reduce((s, i) => s + ((i.wholesalePrice || 0) * (i.quantity || 0)), 0) || 0;
            const profit = subtotal - wholesaleTotal;

            if (orderDateStr === todayStr) {
                todayRevenue += orderTotal;
                todayProfit += profit;
                const customerIdentifier = order.customer?.name || order.customer;
                if (customerIdentifier) todayCustomers.add(customerIdentifier);
            } else if (orderDateStr === yesterdayStr) {
                yesterdayRevenue += orderTotal;
                yesterdayProfit += profit;
                const customerIdentifier = order.customer?.name || order.customer;
                if (customerIdentifier) yesterdayCustomers.add(customerIdentifier);
            }

            const oDate = new Date(order.date);
            oDate.setHours(0, 0, 0, 0);
            const diffTime = todayMidnight - oDate;
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 6 && diffDays >= 0) {
                const index = 6 - diffDays;
                if (index >= 0 && index < 7) {
                    weekData[index] += orderTotal;
                    weekProfitData[index] += profit;
                }
            }

            if (diffDays <= 27 && diffDays >= 0) {
                const weekIndex = 3 - Math.floor(diffDays / 7);
                if (weekIndex >= 0 && weekIndex < 4) {
                    monthData[weekIndex] += orderTotal;
                    monthProfitData[weekIndex] += profit;
                    monthOrdersData[weekIndex] += 1;
                }
            }
        });

        let revenueTrend = 0;
        if (yesterdayRevenue === 0) {
            revenueTrend = todayRevenue > 0 ? 100 : 0;
        } else {
            revenueTrend = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
        }

        let customerTrend = 0;
        if (yesterdayCustomers.size === 0) {
            customerTrend = todayCustomers.size > 0 ? 100 : 0;
        } else {
            customerTrend = ((todayCustomers.size - yesterdayCustomers.size) / yesterdayCustomers.size) * 100;
        }

        let profitTrend = 0;
        if (yesterdayProfit === 0) {
            profitTrend = todayProfit > 0 ? 100 : 0;
        } else {
            profitTrend = ((todayProfit - yesterdayProfit) / yesterdayProfit) * 100;
        }

        setStats({
            totalStock,
            todayRevenue,
            todayProfit,
            todayCustomers: todayCustomers.size,
            revenueTrend: Number(revenueTrend.toFixed(1)),
            profitTrend: Number(profitTrend.toFixed(1)),
            customerTrend: Number(customerTrend.toFixed(1)),
            totalOrders: orders.length,
            monthOrdersData,
            salesData: {
                weekly: {
                    labels: weekLabels,
                    datasets: [
                        {
                            label: 'Sales (₹)',
                            data: weekData,
                            borderColor: '#4f46e5',
                            backgroundColor: 'rgba(79, 70, 229, 0.1)',
                            fill: true,
                            tension: 0.4,
                        },
                        {
                            label: 'Profit (₹)',
                            data: weekProfitData,
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true,
                            tension: 0.4,
                        }
                    ]
                },
                monthly: {
                    labels: monthLabels,
                    datasets: [
                        {
                            label: 'Sales (₹)',
                            data: monthData,
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: true,
                            tension: 0.4,
                        },
                        {
                            label: 'Profit (₹)',
                            data: monthProfitData,
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true,
                            tension: 0.4,
                        }
                    ]
                }
            }
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <NexventoryContext.Provider value={{
            darkMode,
            toggleDarkMode,
            products,
            addProduct,
            updateProduct,
            deleteProduct,
            orders,
            addOrder,
            stats,
            currency,
            formatCurrency
        }}>
            {children}
        </NexventoryContext.Provider>
    );
};
