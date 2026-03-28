import React, { useState } from 'react';
import { User, LogOut, X, Mail, Phone, Shield, Menu, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

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
      `}</style>
        </header>
    );
};

export default Header;
