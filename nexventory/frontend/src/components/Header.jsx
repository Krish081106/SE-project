import React, { useState } from 'react';
import { User, LogOut, X, Mail, Phone, Shield, Menu, UserPlus, Bell, AlertTriangle, Package, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNexventory } from '../context/NexventoryContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, toggleSidebar }) => {
    const { user, logout } = useAuth();
    const { notifications, dismissNotification, dismissAllNotifications } = useNexventory();
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const handleAddAccount = () => {
        logout();
        window.location.href = '/register';
    };

    return (
        <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="icon-btn" onClick={toggleSidebar} title="Toggle Sidebar">
                    <Menu size={24} />
                </button>
                <h1 className="page-title">{title}</h1>
            </div>

            <div className="header-actions">
                {/* Notification Bell */}
                <div style={{ position: 'relative' }}>
                    <button
                        className="icon-btn notification-bell-btn"
                        onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); }}
                        title="Notifications"
                        id="notification-bell"
                    >
                        <Bell size={20} />
                        {notifications.length > 0 && (
                            <span className="notification-badge">{notifications.length}</span>
                        )}
                    </button>

                    {showNotifications && (
                        <>
                            <div className="dropdown-backdrop" onClick={() => setShowNotifications(false)}></div>
                            <div className="notification-panel" id="notification-panel">
                                <div className="notification-panel-header">
                                    <h4>Notifications</h4>
                                    {notifications.length > 0 && (
                                        <button className="notif-clear-all" onClick={() => { dismissAllNotifications(); setShowNotifications(false); }}>
                                            <CheckCheck size={14} /> Clear all
                                        </button>
                                    )}
                                </div>
                                <div className="notification-panel-body">
                                    {notifications.length === 0 ? (
                                        <div className="notif-empty">
                                            <Bell size={32} />
                                            <p>No notifications</p>
                                            <span>All caught up!</span>
                                        </div>
                                    ) : (
                                        notifications.map(notif => (
                                            <div key={notif.id} className={`notif-item notif-${notif.type}`} id={`notif-${notif.id}`}>
                                                <div className="notif-icon-wrap">
                                                    {notif.type === 'danger' ? <AlertTriangle size={18} /> : <Package size={18} />}
                                                </div>
                                                <div className="notif-content">
                                                    <p className="notif-message">{notif.message}</p>
                                                    <span className="notif-tag">
                                                        {notif.type === 'danger' ? 'Out of Stock' : 'Low Stock'}
                                                    </span>
                                                </div>
                                                <button
                                                    className="notif-dismiss"
                                                    onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }}
                                                    title="Dismiss"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="user-profile" onClick={() => setShowProfile(true)} style={{ cursor: 'pointer' }} title="View Profile">
                    <div className="avatar">
                        <User size={20} />
                    </div>
                    <span className="user-name">{user?.name || 'Admin User'}</span>
                </div>
                
                <div style={{ position: 'relative' }}>
                    <button className="icon-btn logout-btn" onClick={() => setShowDropdown(!showDropdown)} title="Account Options">
                        <LogOut size={20} />
                    </button>
                    
                    {showDropdown && (
                        <>
                            <div className="dropdown-backdrop" onClick={() => setShowDropdown(false)}></div>
                            <div className="header-dropdown">
                                <button onClick={handleAddAccount} className="dropdown-item">
                                    <UserPlus size={16} /> Add another account
                                </button>
                                <button onClick={handleLogout} className="dropdown-item text-danger">
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {showProfile && (
                <div className="modal-overlay" onClick={() => setShowProfile(false)}>
                    <div className="modal-content profile-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>My Profile</h3>
                            <button type="button" className="close-btn" onClick={() => setShowProfile(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="profile-details-body">
                            <div className="profile-hero">
                                <div className="avatar-large">
                                    <User size={36} />
                                </div>
                                <div className="hero-text">
                                    <h4>{user?.name || 'Admin User'}</h4>
                                    <span className="status-badge">● Active Space</span>
                                </div>
                            </div>
                            
                            <div className="info-grid">
                                <div className="info-item">
                                    <div className="info-icon-wrapper"><Mail size={18} /></div>
                                    <div className="info-text">
                                        <label>Email Address</label>
                                        <p>{user?.email || 'admin@example.com'}</p>
                                    </div>
                                </div>
                                
                                <div className="info-item">
                                    <div className="info-icon-wrapper"><Phone size={18} /></div>
                                    <div className="info-text">
                                        <label>Mobile Number</label>
                                        <p>{user?.mobile || 'Not Provided'}</p>
                                    </div>
                                </div>
                                
                                <div className="info-item">
                                    <div className="info-icon-wrapper"><Shield size={18} /></div>
                                    <div className="info-text">
                                        <label>Account Role</label>
                                        <p>System Administrator</p>
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-primary w-full" onClick={() => setShowProfile(false)}>
                                Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .header {
          height: 64px;
          background-color: var(--surface);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 5;
        }

        .page-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .icon-btn {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: background-color 0.2s;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .icon-btn:hover {
          background-color: var(--background);
          color: var(--text-main);
        }

        .logout-btn:hover {
          color: var(--danger);
        }

        .dropdown-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 9;
        }

        .header-dropdown {
          position: absolute;
          top: 120%;
          right: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
          min-width: 200px;
          display: flex;
          flex-direction: column;
          z-index: 10;
          overflow: hidden;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--text-main);
          font-size: 0.875rem;
          font-weight: 500;
          text-align: left;
          transition: background-color 0.2s;
        }

        .dropdown-item:hover {
          background: var(--background);
        }

        .dropdown-item.text-danger {
          color: var(--danger);
        }

        .dropdown-item.text-danger:hover {
          background: rgba(239, 68, 68, 0.05);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius);
        }

        .avatar {
          width: 36px;
          height: 36px;
          background-color: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-name {
          font-weight: 500;
          font-size: 0.875rem;
          color: var(--text-main);
        }

        .profile-modal-content {
          max-width: 420px;
          padding: 0;
          overflow: hidden;
        }

        .profile-details-body {
          padding: 1.5rem;
        }

        .profile-hero {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .avatar-large {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), #818cf8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
        }

        .hero-text h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          color: var(--text-main);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
        }

        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          transition: border-color 0.2s;
        }

        .info-item:hover {
          border-color: var(--primary);
        }

        .info-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          box-shadow: var(--shadow-sm);
        }

        .info-text label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .info-text p {
          margin: 0;
          color: var(--text-main);
          font-weight: 500;
        }

        .w-full {
          width: 100%;
          justify-content: center;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: var(--surface);
          border-radius: var(--radius);
          width: 100%;
          max-width: 500px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: var(--text-main);
        }

        .close-btn {
          color: var(--text-muted);
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: var(--danger);
        }

        /* ========== Notification Bell & Panel ========== */
        .notification-bell-btn {
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
          animation: badgePulse 2s ease-in-out infinite;
        }

        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        .notification-panel {
          position: absolute;
          top: 120%;
          right: -60px;
          width: 380px;
          max-height: 480px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
          z-index: 100;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: panelSlideIn 0.2s ease-out;
        }

        @keyframes panelSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .notification-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border);
        }

        .notification-panel-header h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .notif-clear-all {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--primary);
          background: rgba(79, 70, 229, 0.08);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .notif-clear-all:hover {
          background: rgba(79, 70, 229, 0.15);
        }

        .notification-panel-body {
          overflow-y: auto;
          max-height: 400px;
          padding: 0.5rem;
        }

        .notif-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          color: var(--text-muted);
          gap: 0.5rem;
        }

        .notif-empty p {
          margin: 0;
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-main);
        }

        .notif-empty span {
          font-size: 0.8rem;
        }

        .notif-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          border-radius: 10px;
          margin-bottom: 0.25rem;
          transition: background 0.2s;
          position: relative;
        }

        .notif-item:hover {
          background: var(--background);
        }

        .notif-icon-wrap {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notif-warning .notif-icon-wrap {
          background: rgba(245, 158, 11, 0.12);
          color: #f59e0b;
        }

        .notif-danger .notif-icon-wrap {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
        }

        .notif-content {
          flex: 1;
          min-width: 0;
        }

        .notif-message {
          margin: 0;
          font-size: 0.825rem;
          font-weight: 500;
          color: var(--text-main);
          line-height: 1.45;
        }

        .notif-tag {
          display: inline-block;
          margin-top: 0.35rem;
          font-size: 0.675rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }

        .notif-warning .notif-tag {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }

        .notif-danger .notif-tag {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .notif-dismiss {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          opacity: 0;
          transition: all 0.2s;
        }

        .notif-item:hover .notif-dismiss {
          opacity: 1;
        }

        .notif-dismiss:hover {
          background: var(--border);
          color: var(--danger);
        }
      `}</style>
        </header>
    );
};

export default Header;
