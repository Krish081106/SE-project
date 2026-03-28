import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, X, Trash2, Edit2 } from 'lucide-react';
import { useNexventory } from '../context/NexventoryContext';

const Products = () => {
    const { products, addProduct, updateProduct, deleteProduct, formatCurrency } = useNexventory();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [sortBy, setSortBy] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');

    // New Product Form State
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        status: 'In Stock'
    });

    const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

    let processedProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              product.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory ? product.category === filterCategory : true;
        return matchesSearch && matchesCategory;
    });

    if (sortBy === 'price-asc') {
        processedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
        processedProducts.sort((a, b) => b.price - a.price);
    }

    const handleAddProduct = (e) => {
        e.preventDefault();
        setError('');
        if (!newProduct.name || !newProduct.price) return;

        if (parseFloat(newProduct.price) <= 0) {
            setError('Price must be greater than zero.');
            return;
        }

        if (isEditing) {
            updateProduct(editingId, {
                ...newProduct,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock) || 0
            });
        } else {
            addProduct({
                ...newProduct,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock) || 0
            });
        }

        // Reset and close
        setNewProduct({ name: '', category: '', price: '', stock: '', status: 'In Stock' });
        setIsEditing(false);
        setEditingId(null);
        setError('');
        setShowModal(false);
    };

    const handleEditClick = (product) => {
        setNewProduct({
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            status: product.status
        });
        setIsEditing(true);
        setEditingId(product.id);
        setError('');
        setShowModal(true);
    };

    const openAddModal = () => {
        setIsEditing(false);
        setEditingId(null);
        setNewProduct({ name: '', category: '', price: '', stock: '', status: 'In Stock' });
        setError('');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setIsEditing(false);
        setEditingId(null);
        setNewProduct({ name: '', category: '', price: '', stock: '', status: 'In Stock' });
        setError('');
        setShowModal(false);
    };

    return (
        <div className="page-container">
            {/* Action Bar */}
            <div className="action-bar">
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="action-buttons">
                    <select 
                        className="btn btn-outline" 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)}
                        style={{ outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    
                    <select 
                        className="btn btn-outline"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="">Sort By</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                    <button className="btn btn-primary" onClick={openAddModal}>
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className="card">
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedProducts.length > 0 ? (
                                processedProducts.map((product, index) => (
                                    <tr key={product.id}>
                                        <td className="font-bold text-muted">{index + 1}</td>
                                        <td className="font-mono text-sm text-muted">#{product.id}</td>
                                        <td className="font-bold">{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>{formatCurrency(product.price)}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <span className={`status-badge ${product.status.toLowerCase().replace(/ /g, '-')}`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button className="icon-btn-sm" onClick={() => deleteProduct(product.id)}>
                                                    <Trash2 size={18} />
                                                </button>
                                                <button className="icon-btn-sm" onClick={() => handleEditClick(product)}>
                                                    <Edit2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-8 text-muted">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Product Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                            <button type="button" className="close-btn" onClick={handleCloseModal}>
                                <X size={20} />
                            </button>
                        </div>
                        {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}
                        <form onSubmit={handleAddProduct}>
                            <div className="form-group mb-4">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>
                            <div className="form-row mb-4">
                                <div className="form-group">
                                    <label>Category</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        value={newProduct.status}
                                        onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
                                    >
                                        <option>In Stock</option>
                                        <option>Low Stock</option>
                                        <option>Out of Stock</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row mb-6">
                                <div className="form-group">
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock Quantity</label>
                                    <input
                                        type="number"
                                        required
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {isEditing ? 'Update Product' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Styles (Scoped) */}
            <style>{`
        .page-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: var(--surface);
          padding: 1rem;
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
        }

        .search-container {
          position: relative;
          width: 300px;
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
        }

        .action-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .font-mono {
          font-family: monospace;
        }

        .text-center { text-align: center; }
        .py-8 { padding-top: 2rem; padding-bottom: 2rem; }

        .icon-btn-sm {
          color: var(--text-muted);
          padding: 4px;
          border-radius: 4px;
        }

        .icon-btn-sm:hover {
          background-color: var(--background);
          color: var(--text-main);
        }

        .flex { display: flex; }
        .gap-2 { gap: 0.5rem; }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-block;
        }

        .status-badge.in-stock { background-color: #d1fae5; color: #065f46; }
        .status-badge.low-stock { background-color: #fef3c7; color: #92400e; }
        .status-badge.out-of-stock { background-color: #fee2e2; color: #991b1b; }

        /* Modal Styles */
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
        }

        .close-btn {
          color: var(--text-muted);
        }

        .close-btn:hover {
          color: var(--text-main);
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
      `}</style>
        </div>
    );
};

export default Products;
