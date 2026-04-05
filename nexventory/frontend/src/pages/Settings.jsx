import React, { useState } from 'react';
import { Moon, Globe, Shield, Bell, Package, RotateCcw } from 'lucide-react';
import { useNexventory } from '../context/NexventoryContext';

const Settings = () => {
  const { darkMode, toggleDarkMode, lowStockThreshold, setLowStockThreshold, notifications, resetDismissedNotifications } = useNexventory();
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    twoFactor: false,
    currency: 'INR',
  });

  const handleToggle = (key) => {
    if (key === 'darkMode') {
      toggleDarkMode();
    } else {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  return (
    <div className="page-container max-w-2xl">
      <h2>Settings</h2>

      <div className="section-group">
        <h3>Preferences</h3>
        <div className="card settings-card">
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon"><Moon size={20} /></div>
              <div>
                <h4>Dark Mode</h4>
                <p>Enable dark theme for the application</p>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => handleToggle('darkMode')}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon"><Globe size={20} /></div>
              <div>
                <h4>Currency</h4>
                <p>Select your preferred currency</p>
              </div>
            </div>
            <select
              className="currency-select"
              value="INR"
              disabled
            >
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="section-group">
        <h3>Notifications</h3>
        <div className="card settings-card">
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon" style={{ color: '#f59e0b' }}><Package size={20} /></div>
              <div>
                <h4>Low Stock Threshold</h4>
                <p>Get notified when product stock falls below this number</p>
              </div>
            </div>
            <div className="threshold-input-group">
              <button
                className="threshold-btn"
                onClick={() => setLowStockThreshold(prev => Math.max(1, prev - 1))}
              >−</button>
              <input
                type="number"
                className="threshold-input"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                id="low-stock-threshold"
              />
              <button
                className="threshold-btn"
                onClick={() => setLowStockThreshold(prev => prev + 1)}
              >+</button>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon" style={{ color: '#6366f1' }}><Bell size={20} /></div>
              <div>
                <h4>Stock Notifications</h4>
                <p>{notifications.length > 0 ? `${notifications.length} active alert${notifications.length > 1 ? 's' : ''}` : 'No active alerts'}</p>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => handleToggle('notifications')}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-icon" style={{ color: '#10b981' }}><RotateCcw size={20} /></div>
              <div>
                <h4>Reset Dismissed Alerts</h4>
                <p>Show all previously dismissed stock notifications again</p>
              </div>
            </div>
            <button className="btn btn-outline" onClick={resetDismissedNotifications} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              Reset
            </button>
          </div>
        </div>
      </div>


      <style>{`
        .max-w-2xl { max-width: 42rem; }
        
        .section-group {
          margin-top: 2rem;
        }

        .section-group h3 {
          margin-bottom: 1rem;
          color: var(--text-muted);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .settings-card {
          padding: 0;
          overflow: hidden;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .setting-item:last-child {
          border-bottom: none;
        }

        .setting-info {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .setting-icon {
          width: 40px;
          height: 40px;
          background-color: var(--background);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .setting-info h4 {
          margin-bottom: 0.25rem;
        }

        .setting-info p {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .currency-select {
          width: 100px;
          padding: 0.5rem;
        }

        .threshold-input-group {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
        }

        .threshold-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: var(--background);
          color: var(--text-main);
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .threshold-btn:hover {
          background: var(--primary);
          color: white;
        }

        .threshold-input {
          width: 48px;
          height: 36px;
          border: none;
          border-left: 1px solid var(--border);
          border-right: 1px solid var(--border);
          text-align: center;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
          background: var(--surface);
          -moz-appearance: textfield;
        }

        .threshold-input::-webkit-outer-spin-button,
        .threshold-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .btn-outline {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-main);
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-outline:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(79, 70, 229, 0.05);
        }

        /* Switch Toggle */
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 28px;
        }

        .switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: .4s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }

        input:checked + .slider {
          background-color: var(--primary);
        }

        input:checked + .slider:before {
          transform: translateX(22px);
        }

        .slider.round {
          border-radius: 34px;
        }

        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Settings;
