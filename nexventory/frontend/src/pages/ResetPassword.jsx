import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Lock } from 'lucide-react';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        try {
            const data = await resetPassword(token, password);
            setMessage(data.message || 'Password successfully updated.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <Box size={40} color="var(--primary)" />
                    <h2>Reset Password</h2>
                    <p>Enter your new password below.</p>
                </div>

                {error && <div className="auth-error">{error}</div>}
                {message && <div className="auth-success" style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>{message}<br/>Redirecting to login...</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-4">
                        <Lock size={18} /> Update Password
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
                .auth-error { background-color: #fee2e2; color: #b91c1c; padding: 0.75rem; border-radius: var(--radius); marginBottom: 1rem; font-size: 0.875rem; text-align: center;}
                .auth-form { display: flex; flex-direction: column; gap: 1rem; }
                .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-muted); }
                .auth-link { color: var(--primary); text-decoration: none; font-weight: 500; }
                .w-full { width: 100%; justify-content: center;}
                .mt-4 { margin-top: 1rem; }
            `}</style>
        </div>
    );
};

export default ResetPassword;
