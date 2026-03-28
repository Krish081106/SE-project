import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [resetLink, setResetLink] = useState('');
    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setResetLink('');

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            const data = await forgotPassword(email);
            setMessage(data.message);
            if (data.resetToken) {
                // Since there is no email service, we show the link on screen for testing
                setResetLink(`/reset-password/${data.resetToken}`);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <Box size={40} color="var(--primary)" />
                    <h2>Forgot Password</h2>
                    <p>Enter your email to receive a password reset link.</p>
                </div>

                {error && <div className="auth-error">{error}</div>}
                {message && <div className="auth-success" style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>{message}</div>}
                
                {resetLink && (
                    <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: 'var(--radius)', marginBottom: '1rem', textAlign: 'center', wordBreak: 'break-all' }}>
                        <p style={{ marginBottom: '0.5rem', fontWeight: '500' }}>Test Link (Simulated Email):</p>
                        <Link to={resetLink} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Click here to reset your password</Link>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-4">
                        <KeyRound size={18} /> Send Reset Link
                    </button>
                </form>

                <p className="auth-footer">
                    Remember your password? <Link to="/login" className="auth-link">Back to login</Link>
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

export default ForgotPassword;
