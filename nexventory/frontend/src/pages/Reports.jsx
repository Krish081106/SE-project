import React from 'react';
import { Download, FileText, TrendingUp, Calendar } from 'lucide-react';
import { useNexventory } from '../context/NexventoryContext';

const Reports = () => {
    const { stats, formatCurrency } = useNexventory();

    const monthlyRevenue = stats.salesData?.monthly?.datasets[0]?.data?.reduce((a, b) => a + b, 0) || 0;
    const avgDailySales = monthlyRevenue / 30;

    const handleExport = () => {
        window.print();
    };

    return (
        <div className="page-container">
            <div className="reports-header no-print">
                <div>
                    <h2>Sales Reports</h2>
                    <p className="text-muted">Monthly sales and revenue analysis</p>
                </div>
                <button className="btn btn-primary" onClick={handleExport}>
                    <Download size={18} />
                    Export PDF
                </button>
            </div>

            {/* Report Content - This part gets printed */}
            <div className="print-area">
                <div className="print-header only-print">
                    <h1>Nexventory Sales Report</h1>
                    <p>Generated on: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Summary Cards */}
                <div className="reports-grid">
                    <div className="card report-card">
                        <div className="report-icon bg-indigo-100 text-indigo-600">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="report-label">Total Revenue</p>
                            <h3 className="report-value">{formatCurrency(monthlyRevenue)}</h3>
                            <p className="report-period">This Month</p>
                        </div>
                    </div>

                    <div className="card report-card">
                        <div className="report-icon bg-emerald-100 text-emerald-600">
                            <FileText size={24} />
                        </div>
                        <div>
                            <p className="report-label">Total Orders</p>
                            <h3 className="report-value">{stats.totalOrders ?? 0}</h3>
                            <p className="report-period">This Month</p>
                        </div>
                    </div>

                    <div className="card report-card">
                        <div className="report-icon bg-amber-100 text-amber-600">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="report-label">Avg. Daily Sales</p>
                            <h3 className="report-value">{formatCurrency(avgDailySales)}</h3>
                            <p className="report-period">Last 30 Days</p>
                        </div>
                    </div>
                </div>

                {/* Sales Table */}
                <div className="card mt-6">
                    <h3>Monthly Breakdown</h3>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Period</th>
                                    <th>Orders</th>
                                    <th>Revenue</th>
                                    <th>Growth</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Using dynamic sales data from context */}
                                {stats.salesData?.monthly?.labels?.map((month, index) => {
                                    const revenue = stats.salesData.monthly.datasets[0].data[index] || 0;
                                    const orderCount = stats.monthOrdersData?.[index] || 0;
                                    const prevRevenue = index > 0 ? (stats.salesData.monthly.datasets[0].data[index - 1] || 0) : 0;
                                    const growth = prevRevenue === 0 ? (revenue > 0 ? 100 : 0) : (((revenue - prevRevenue) / prevRevenue) * 100).toFixed(1);
                                    
                                    return (
                                        <tr key={month}>
                                            <td>{month}</td>
                                            <td>{orderCount}</td>
                                            <td>{formatCurrency(revenue)}</td>
                                            <td className={growth >= 0 ? "text-success" : "text-danger"}>
                                                {growth > 0 ? '+' : ''}{growth}%
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
        .reports-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .report-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .report-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .report-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }

        .report-label {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .report-period {
          font-size: 0.75rem;
          color: var(--text-muted);
          background-color: var(--background);
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
          margin-top: 4px;
        }
        
        .mt-6 { margin-top: 1.5rem; }
        .text-success { color: var(--success); }

        /* Print Styles */
        .only-print { display: none; }

        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .only-print {
            display: block !important;
            margin-bottom: 2rem;
            text-align: center;
          }
          .card {
            border: 1px solid #ddd;
            box-shadow: none;
          }
        }
      `}</style>
        </div>
    );
};

export default Reports;
