import React, { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DollarSign, Users, Package, ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';
import { useNexventory } from '../context/NexventoryContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const { products, stats, formatCurrency } = useNexventory();
    const [chartView, setChartView] = useState('weekly');

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#64748b' }
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => formatCurrency(context.raw)
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(100, 116, 139, 0.2)',
                },
                ticks: {
                    color: '#64748b'
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#64748b'
                }
            }
        }
    };

    const getChartData = () => {
        const data = chartView === 'weekly' ? stats.salesData?.weekly : stats.salesData?.monthly;
        return {
            labels: data?.labels || [],
            datasets: data?.datasets || [],
        };
    };

    if (products.length === 0) {
        return (
            <div className="dashboard empty-dashboard">
                <div className="card empty-state-card">
                    <div className="empty-state-icon">
                        <Package size={48} />
                    </div>
                    <h2>Welcome to Nexventory!</h2>
                    <button className="btn btn-primary mt-4" onClick={() => window.location.href = '/app/products'}>
                        Get Started
                    </button>
                </div>
                <style>{`
                    .empty-dashboard {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: calc(100vh - 120px);
                    }
                    .empty-state-card {
                        text-align: center;
                        padding: 4rem 2rem;
                        max-width: 500px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
                    .empty-state-icon {
                        width: 80px;
                        height: 80px;
                        background: rgba(79, 70, 229, 0.1);
                        color: var(--primary);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 1.5rem;
                    }
                    .empty-state-card h2 { margin-bottom: 0.5rem; color: var(--text-main); }
                    .empty-state-card p { line-height: 1.6; margin-bottom: 1.5rem; }
                    .mt-4 { margin-top: 1rem; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="card stat-card">
                    <div className="stat-icon-wrapper bg-indigo-100 text-indigo-600">
                        <Package size={24} color="var(--primary)" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Total Stock</p>
                        <h3 className="stat-value">{stats.totalStock}</h3>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon-wrapper bg-emerald-100 text-emerald-600">
                        <IndianRupee size={24} color="var(--success)" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Today's Revenue</p>
                        <h3 className="stat-value">{formatCurrency(stats.todayRevenue)}</h3>
                        <span className={`stat-trend ${stats.revenueTrend >= 0 ? 'positive' : 'negative'}`}>
                            {stats.revenueTrend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} 
                            {stats.revenueTrend > 0 ? '+' : ''}{stats.revenueTrend}%
                        </span>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon-wrapper bg-amber-100 text-amber-600">
                        <Users size={24} color="var(--warning)" />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">Today's Customers</p>
                        <h3 className="stat-value">{stats.todayCustomers}</h3>
                        <span className={`stat-trend ${stats.customerTrend >= 0 ? 'positive' : 'negative'}`}>
                            {stats.customerTrend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} 
                            {stats.customerTrend > 0 ? '+' : ''}{stats.customerTrend}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Sales Overview Chart */}
            <div className="card chart-section">
                <div className="section-header">
                    <h2>Sales Overview</h2>
                    <div className="toggle-group">
                        <button
                            className={`toggle-btn ${chartView === 'weekly' ? 'active' : ''}`}
                            onClick={() => setChartView('weekly')}
                        >
                            Weekly
                        </button>
                        <button
                            className={`toggle-btn ${chartView === 'monthly' ? 'active' : ''}`}
                            onClick={() => setChartView('monthly')}
                        >
                            Monthly
                        </button>
                    </div>
                </div>
                <div className="chart-container">
                    <Line options={chartOptions} data={getChartData()} />
                </div>
            </div>

            {/* Top Inventory Table */}
            <div className="card table-section">
                <h2>Top Inventory (Today's Sales)</h2>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.slice(0, 5).map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{formatCurrency(product.price)}</td>
                                    <td>
                                        <span className={`status-badge ${product.status.toLowerCase().replace(/ /g, '-')}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td>{product.stock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
        .dashboard {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 0; 
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--background); 
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          color: var(--text-muted);
          font-size: 0.875rem;
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          margin-top: 0.25rem;
          font-weight: 500;
        }

        .stat-trend.positive { color: var(--success); }
        .stat-trend.negative { color: var(--danger); }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .toggle-group {
          background-color: var(--background);
          padding: 0.25rem;
          border-radius: var(--radius);
          display: flex;
          gap: 0.25rem;
        }

        .toggle-btn {
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted);
          border-radius: 4px; /* somewhat round */
        }

        .toggle-btn.active {
          background-color: var(--surface);
          color: var(--primary);
          box-shadow: var(--shadow-sm);
        }

        .chart-container {
          height: 300px;
          width: 100%;
        }

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
      `}</style>
        </div>
    );
};

export default Dashboard;
