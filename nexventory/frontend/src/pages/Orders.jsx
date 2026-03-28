import React, { useState } from 'react';
import { FileText, ChevronDown, X, Search } from 'lucide-react';
import { useNexventory } from '../context/NexventoryContext';

const Orders = () => {
  const { orders, formatCurrency } = useNexventory();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter orders by customer name
  const filteredOrders = orders.filter(o => {
    const customerName = o.customer?.name || o.customer || '';
    return customerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Group orders by date
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const d = new Date(order.date);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(order);
    return acc;
  }, {});

  // Sort dates descending
  const sortedDates = Object.keys(groupedOrders).sort((a, b) => new Date(b) - new Date(a));

  // Calculate stats dynamically
  const totalOrders = filteredOrders.length;
  const todayOrders = filteredOrders.filter(o => {
    const d = new Date(o.date);
    const today = new Date();
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
  }).length;

  return (
    <div className="page-container">
      <div className="orders-header">
        <h2>Order History</h2>
        
        <div className="search-container" style={{ flex: 1, maxWidth: '400px', margin: '0 2rem' }}>
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search by customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="stats-mini">
          <div className="stat-pill">
            <span className="label">Total Orders</span>
            <span className="value">{totalOrders}</span>
          </div>
          <div className="stat-pill">
            <span className="label">Today</span>
            <span className="value">{todayOrders}</span>
          </div>
        </div>
      </div>

      <div className="orders-timeline">
        {sortedDates.map((date) => (
          <div key={date} className="timeline-group">
            <div className="date-header">
              <span className="date-badge">{new Date(date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            <div className="orders-list">
              {groupedOrders[date].map((order) => (
                <div key={order.id} className="card order-card">
                  <div className="order-header">
                    <div className="order-id-group">
                      <div className="icon-box">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h4>{order.billId || order.id}</h4>
                        <p className="text-muted text-sm">{order.customer?.name || order.customer}</p>
                      </div>
                    </div>
                    <div className="order-status">
                      <span className={`status-dot ${order.status?.toLowerCase() || 'completed'}`}></span>
                      {order.status || 'Completed'}
                    </div>
                  </div>

                  <div className="order-details">
                    <div className="detail-item">
                      <span className="label">Items</span>
                      <span className="value">{Array.isArray(order.items) ? order.items.reduce((acc, item) => acc + item.quantity, 0) : order.items}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Total</span>
                      <span className="value font-bold">{formatCurrency(order.totalAmount || order.total)}</span>
                    </div>
                  </div>

                  <button
                    className="btn btn-outline btn-sm w-full mt-4"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Order Details</h3>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="order-modal-body">
              <div className="modal-row">
                <span className="label">Order ID:</span>
                <span className="value font-mono">{selectedOrder.billId || selectedOrder.id}</span>
              </div>
              <div className="modal-row">
                <span className="label">Date:</span>
                <span className="value">{new Date(selectedOrder.date).toLocaleString()}</span>
              </div>
              <div className="modal-row">
                <span className="label">Customer:</span>
                <span className="value font-bold">{selectedOrder.customer.name || selectedOrder.customer}</span>
              </div>

              <div className="items-list-modal">
                <h4>Items</h4>
                <div className="table-responsive">
                  <table className="modal-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(selectedOrder.items) ? selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.name || 'Product'}</td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(item.price)}</td>
                          <td>{formatCurrency(item.total)}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan="4">Details not available for mock data.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="modal-total-section">
                <div className="modal-row large">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(selectedOrder.totalAmount || selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .search-container {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          padding-left: 2.5rem;
          width: 100%;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background-color: var(--background);
          color: var(--text-main);
        }

        .search-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
        }

        .stats-mini {
          display: flex;
          gap: 1rem;
        }

        .stat-pill {
          background-color: var(--surface);
          padding: 0.5rem 1rem;
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-pill .label {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .stat-pill .value {
          font-weight: 700;
          color: var(--primary);
        }

        .orders-timeline {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .date-header {
          margin-bottom: 1rem;
          position: relative;
        }

        .date-header::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background-color: var(--border);
          z-index: 0;
        }

        .date-badge {
          background-color: var(--background);
          padding-right: 1rem;
          position: relative;
          z-index: 1;
          font-weight: 600;
          color: var(--text-muted);
        }

        .orders-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .order-card {
          margin-bottom: 0;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .order-id-group {
          display: flex;
          gap: 0.75rem;
        }

        .icon-box {
          width: 36px;
          height: 36px;
          background-color: rgba(79, 70, 229, 0.1);
          color: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .order-status {
          font-size: 0.75rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .status-dot.completed { background-color: var(--success); }
        .status-dot.pending { background-color: var(--warning); }

        .order-details {
          display: flex;
          justify-content: space-between;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-item .label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .w-full { width: 100%; }
        .mt-4 { margin-top: 1rem; }
        .btn-sm { padding: 0.25rem 0.75rem; font-size: 0.875rem; }

        /* Modal Specifics */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }

        .modal-content {
          background-color: var(--surface);
          padding: 1.5rem;
          border-radius: var(--radius);
          width: 100%;
          max-width: 500px;
          box-shadow: var(--shadow-md);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 1rem;
        }

        .order-modal-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .modal-row {
          display: flex;
          justify-content: space-between;
        }
        
        .modal-row .label {
            color: var(--text-muted);
        }

        .items-list-modal {
            margin-top: 1rem;
            border-top: 1px solid var(--border);
            padding-top: 1rem;
        }
        
        .items-list-modal h4 {
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
            color: var(--text-muted);
        }
        
        .modal-table {
            font-size: 0.875rem;
        }
        
        .modal-table th {
            padding: 0.5rem;
            background-color: var(--background);
        }
        .modal-table td {
            padding: 0.5rem;
            border-bottom: 1px solid var(--border);
        }

        .modal-total-section {
            margin-top: 1rem;
            border-top: 2px solid var(--border);
            padding-top: 1rem;
        }

        .modal-row.large {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default Orders;
