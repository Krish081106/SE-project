import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Receipt, BarChart3, Settings, Box } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const navItems = [
    { path: '/app', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/app/products', label: 'Products', icon: Package },
    { path: '/app/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/app/billing', label: 'Billing', icon: Receipt },
    { path: '/app/reports', label: 'Reports', icon: BarChart3 },
    { path: '/app/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`sidebar ${isOpen ? '' : 'closed'}`}>
      <div className="logo-container">
        <Box className="logo-icon" size={28} color="var(--primary)" />
        <span className="logo-text">Nexventory</span>
      </div>
      
      <nav className="nav-menu">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <style>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background-color: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 10;
          transition: transform 0.3s ease;
        }

        .sidebar.closed {
          transform: translateX(-100%);
        }

        .logo-container {
          height: 64px;
          display: flex;
          align-items: center;
          padding: 0 1.5rem;
          gap: 0.75rem;
          border-bottom: 1px solid var(--border);
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.025em;
        }

        .nav-menu {
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius);
          color: var(--text-muted);
          font-weight: 500;
          transition: all 0.2s;
        }

        .nav-item:hover {
          background-color: var(--background);
          color: var(--text-main);
        }

        .nav-item.active {
          background-color: rgba(79, 70, 229, 0.1); /* Primary with opacity */
          color: var(--primary);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
