import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, UserPlus } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!/^[A-Za-z\s]+$/.test(name)) {
            setError('Name can only contain letters and spaces.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        
        if (!email.toLowerCase().endsWith('.com')) {
            setError('Sorry, please enter a correct email ID ending with .com');
            return;
        }

        if (mobile.length !== 10 || !/^\d+$/.test(mobile) || mobile === '0000000000') {
            setError('Please enter exactly a 10-digit mobile number.');
            return;
        }

        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if (password.length < 8 || !/\d/.test(password) || !specialCharRegex.test(password)) {
            setError('Password must be at least 8 characters long and contain at least one digit and one special character.');
            return;
        }

        try {
            await register(name, email, password, mobile);
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
                    <h2>Create Account</h2>
                    <p>Get started with your Nexventory workspace.</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Full Name *</label>
                        <input type="text" required value={name} onChange={(e) => {
                            const val = e.target.value.replace(/[^A-Za-z\s]/g, '');
                            setName(val);
                        }} placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                        <label>Email Address *</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                        <label>Mobile Number *</label>
                        <input type="text" required maxLength={10} value={mobile} onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setMobile(val);
                        }} placeholder="10-digit mobile" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" />
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-4">
                        <UserPlus size={18} /> Create Account
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
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

export default Register;
