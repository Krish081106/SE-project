import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Printer, Save, Calculator } from 'lucide-react';
import { useNexventory } from '../context/NexventoryContext';

const Billing = () => {
    const { products, addOrder, formatCurrency } = useNexventory();
    const [billId, setBillId] = useState('');
    const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
    const [items, setItems] = useState([
        { id: Date.now(), productId: '', price: 0, quantity: 1, total: 0 }
    ]);
    const [grandTotal, setGrandTotal] = useState(0);

    useEffect(() => {
        generateBillId();
    }, []);

    useEffect(() => {
        calculateGrandTotal();
    }, [items]);

    const generateBillId = () => {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        setBillId(`INV-${timestamp}-${random}`);
    };

    const calculateGrandTotal = () => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setGrandTotal(total);
    };

    const getAvailableStock = (productId, excludeIndex = -1) => {
        const product = products.find(p => p.id === productId);
        if (!product) return 0;
        
        const inCartQty = items
            .filter((item, i) => item.productId === productId && i !== excludeIndex)
            .reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
            
        return Math.max(0, product.stock - inCartQty);
    };

    const handleProductChange = (index, productId) => {
        const product = products.find(p => p.id === productId);
        const newItems = [...items];
        newItems[index].productId = productId;
        newItems[index].name = product ? product.name : '';
        newItems[index].price = product ? product.price : 0;
        newItems[index].total = newItems[index].quantity * (product ? product.price : 0);
        setItems(newItems);
    };

    const handleQuantityChange = (index, quantity) => {
        const newItems = [...items];
        let newQty = parseInt(quantity) || 0;
        
        if (newItems[index].productId) {
            const product = products.find(p => p.id === newItems[index].productId);
            const maxAllowed = getAvailableStock(newItems[index].productId, index);
            
            if (product && newQty > maxAllowed) {
                alert(`Cannot add more. Real-time available stock remaining: ${maxAllowed}.`);
                newQty = maxAllowed;
            }
        }

        newItems[index].quantity = newQty;
        newItems[index].total = newItems[index].quantity * newItems[index].price;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { id: Date.now(), productId: '', price: 0, quantity: 1, total: 0 }]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        }
    };

    const validateOrder = () => {
        if (!customer.name || !/^[A-Za-z\s]+$/.test(customer.name)) {
            alert('Please enter a valid customer name (letters and spaces only).');
            return false;
        }

        if (!customer.phone || !/^\d{10}$/.test(customer.phone) || customer.phone === '0000000000') {
            alert('Please enter a valid 10-digit mobile number (cannot be all zeros).');
            return false;
        }

        if (!customer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        if (items.some(i => !i.productId)) {
            alert('Please select products for all items in the invoice.');
            return false;
        }
        
        return true;
    };

    const handlePrint = () => {
        if (validateOrder()) {
            window.print();
        }
    };

    const handleSubmit = () => {
        if (!validateOrder()) return;

        const newOrder = {
            id: `ORD-${Date.now()}`,
            billId,
            customer,
            items: items.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                total: item.total
            })),
            totalAmount: grandTotal * 1.18, // Store as number for stats including GST
            date: new Date().toISOString(),
            status: 'Completed'
        };

        addOrder(newOrder);

        alert('Order created successfully and saved to history!');
        // Reset form
        setCustomer({ name: '', phone: '', email: '' });
        setItems([{ id: Date.now(), productId: '', price: 0, quantity: 1, total: 0 }]);
        generateBillId();
    };

    return (
        <div className="page-container">
            <div className="billing-header">
                <div>
                    <h2>New Invoice</h2>
                    <p className="text-muted">Create a new bill for customer</p>
                </div>
                <div className="bill-id-badge">
                    {billId}
                </div>
            </div>

            <div className="billing-grid">
                {/* Customer Details */}
                <div className="card customer-section">
                    <h3>Customer Details</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Customer Name</label>
                            <input
                                type="text"
                                placeholder="Enter name"
                                value={customer.name}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^A-Za-z\s]/g, '');
                                    setCustomer({ ...customer, name: val });
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                placeholder="Enter 10-digit phone"
                                value={customer.phone}
                                maxLength={10}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setCustomer({ ...customer, phone: val });
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                required
                                placeholder="Enter email"
                                value={customer.email}
                                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Product Items */}
                <div className="card items-section">
                    <div className="items-header">
                        <h3>Order Items</h3>
                        <button className="btn btn-primary btn-sm" onClick={addItem}>
                            <Plus size={16} /> Add Item
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '40%' }}>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th className="print-hide">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>
                                            <select
                                                value={item.productId}
                                                onChange={(e) => handleProductChange(index, e.target.value)}
                                                className="product-select"
                                            >
                                                <option value="">Select Product</option>
                                                {products.filter(p => p.stock > 0 && p.status !== 'Out of Stock').map(p => {
                                                    const available = getAvailableStock(p.id, item.productId === p.id ? index : -1);
                                                    return (
                                                        <option key={p.id} value={p.id} disabled={available === 0 && item.productId !== p.id}>
                                                            {p.name} - Stock: {available} ({formatCurrency(p.price)})
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </td>
                                        <td>{formatCurrency(item.price)}</td>
                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                max={item.productId ? getAvailableStock(item.productId, index) : undefined}
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                className="qty-input"
                                            />
                                        </td>
                                        <td className="font-bold">{formatCurrency(item.total)}</td>
                                        <td className="print-hide">
                                            <button
                                                className="icon-btn-danger"
                                                onClick={() => removeItem(index)}
                                                disabled={items.length === 1}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary & Actions */}
                <div className="card summary-section">
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>{formatCurrency(grandTotal)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Tax (18% GST)</span>
                        <span>{formatCurrency(grandTotal * 0.18)}</span>
                    </div>
                    <div className="summary-total">
                        <span>Grand Total</span>
                        <span>{formatCurrency(grandTotal * 1.18)}</span>
                    </div>

                    <div className="action-buttons-large">
                        <button className="btn btn-outline" onClick={handlePrint}>
                            <Printer size={20} /> Print
                        </button>
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            <Save size={20} /> Generate Bill
                        </button>
                    </div>
                </div>
            </div>

            {/* --- PRINT ONLY INVOICE --- */}
            <div className="print-only invoice-print-container">
                <div className="invoice-print-header">
                    <h1>Nexventory</h1>
                    <h2>INVOICE</h2>
                </div>
                
                <div className="invoice-print-info">
                    <div className="info-block">
                        <strong>Bill To:</strong>
                        <p>{customer.name || 'Customer Name'}</p>
                        <p>{customer.phone || 'Phone Number'}</p>
                        <p>{customer.email || 'Email Address'}</p>
                    </div>
                    <div className="info-block text-right">
                        <p><strong>Invoice #:</strong> {billId}</p>
                        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <table className="invoice-print-table">
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.filter(item => item.productId).map((item, i) => (
                            <tr key={i}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{formatCurrency(item.price)}</td>
                                <td>{formatCurrency(item.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="invoice-print-summary">
                    <div className="summary-line">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(grandTotal)}</span>
                    </div>
                    <div className="summary-line">
                        <span>Tax (18% GST):</span>
                        <span>{formatCurrency(grandTotal * 0.18)}</span>
                    </div>
                    <div className="summary-line grand-total">
                        <span>Grand Total:</span>
                        <span>{formatCurrency(grandTotal * 1.18)}</span>
                    </div>
                </div>
                
                <div className="invoice-print-footer">
                    <p>Thank you for your business!</p>
                </div>
            </div>

            <style>{`
        .billing-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .bill-id-badge {
          background-color: var(--surface);
          padding: 0.5rem 1rem;
          border-radius: var(--radius);
          font-family: monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
          border: 1px solid var(--border);
        }

        .billing-grid {
          display: grid;
          gap: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        .items-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .items-table td {
          vertical-align: middle;
        }

        .product-select {
          min-width: 200px;
        }

        .qty-input {
          width: 80px;
        }

        .icon-btn-danger {
          color: var(--danger);
          padding: 4px;
          border-radius: 4px;
        }

        .icon-btn-danger:hover {
          background-color: rgba(239, 68, 68, 0.1);
        }

        .icon-btn-danger:disabled {
          color: var(--text-muted);
          cursor: not-allowed;
          background: none;
        }

        .summary-section {
          background-color: var(--surface);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: flex-end;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          width: 300px;
          color: var(--text-muted);
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          width: 300px;
          padding-top: 1rem;
          border-top: 2px solid var(--border);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .action-buttons-large {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          width: 300px;
        }
        
        .action-buttons-large button {
          flex: 1;
        }

        .print-only { display: none; }

        @media print {
          /* Force colors to print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden;
          }
          
          .print-only, .print-only * {
            visibility: visible;
          }
          
          .print-only {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2rem;
            color: black;
          }

          .invoice-print-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #333;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
          }
          
          .invoice-print-header h1 { color: var(--primary); margin: 0; font-size: 2rem; }
          .invoice-print-header h2 { color: #666; font-weight: 300; margin: 0; font-size: 1.5rem; }
          
          .invoice-print-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2rem;
          }
          
          .invoice-print-info p { margin: 0.25rem 0; color: #333; font-size: 1rem; }
          .text-right { text-align: right; }
          
          .invoice-print-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2rem;
          }
          
          .invoice-print-table th, .invoice-print-table td {
            border-bottom: 1px solid #ddd;
            padding: 0.75rem;
            text-align: left;
            color: #000;
          }
          
          .invoice-print-table th {
            background-color: #f8fafc !important;
            font-weight: 600;
            color: #333;
          }
          
          .invoice-print-summary {
            width: 300px;
            margin-left: auto;
          }
          
          .summary-line {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            color: #333;
          }
          
          .summary-line.grand-total {
            font-weight: bold;
            font-size: 1.25rem;
            border-top: 2px solid #333;
            margin-top: 0.5rem;
            padding-top: 1rem;
          }
          
          .invoice-print-footer {
            margin-top: 4rem;
            text-align: center;
            color: #666;
            font-size: 0.875rem;
            border-top: 1px solid #ddd;
            padding-top: 1rem;
          }
        }
      `}</style>
        </div>
    );
};

export default Billing;
