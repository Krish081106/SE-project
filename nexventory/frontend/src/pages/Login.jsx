import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            await login(email, password);
            navigate('/app');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <Box size={40} color="var(--primary)" />
                    <h2>Nexventory Login</h2>
                    <p>Welcome back! Please login to your account.</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                        <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot Password?</Link>
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-4">
                        <LogIn size={18} /> Sign In
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
                </p>
            </div>
            <style>{`
                .auth-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: var(--background); }
                .auth-card { background: var(--surface); padding: 2.5rem; border-radius: var(--radius); box-shadow: var(--shadow-md); width: 100%; max-width: 400px; }
                .auth-header { text-align: center; margin-bottom: 2rem; }
                .auth-header h2 { margin: 1rem 0 0.5rem; font-size: 1.5rem; }
                .auth-header p { color: var(--text-muted); font-size: 0.875rem; }
                .auth-error { background-color: #fee2e2; color: #b91c1c; padding: 0.75rem; border-radius: var(--radius); margin-bottom: 1rem; font-size: 0.875rem; text-align: center;}
                .auth-form { display: flex; flex-direction: column; gap: 1rem; }
                .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-muted); }
                .auth-link { color: var(--primary); text-decoration: none; font-weight: 500; }
                .w-full { width: 100%; justify-content: center;}
                .mt-4 { margin-top: 1rem; }
            `}</style>
        </div>
    );
};

export default Login;
