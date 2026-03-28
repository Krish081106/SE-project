import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Map paths to page titles
    const getPageTitle = (pathname) => {
        switch (pathname) {
            case '/': return 'Dashboard';
            case '/products': return 'Product Management';
            case '/orders': return 'Orders';
            case '/billing': return 'Billing & Invoicing';
            case '/reports': return 'Sales Reports';
            case '/settings': return 'Settings';
            default: return 'Nexventory';
        }
    };

    return (
        <div className="layout">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`main-content ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
                <Header title={getPageTitle(location.pathname)} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="content-area">
                    <Outlet />
                </main>
            </div>

            <style>{`
        .layout {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          margin-left: 260px;
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: var(--background);
          transition: margin-left 0.3s ease;
        }

        .main-content.sidebar-closed {
          margin-left: 0;
        }

        .content-area {
          padding: 2rem;
          flex: 1;
          overflow-y: auto;
        }
      `}</style>
        </div>
    );
};

export default Layout;
