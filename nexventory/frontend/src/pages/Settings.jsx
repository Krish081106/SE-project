import React, { useState } from 'react';
import { Moon, Globe, Shield } from 'lucide-react';
import { useNexventory } from '../context/NexventoryContext';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useNexventory();
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
