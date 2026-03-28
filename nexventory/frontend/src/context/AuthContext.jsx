import React, { createContext, useState, useContext, useEffect } from 'react';

const API_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return true;
        } else {
            throw new Error(data.message || 'Login failed');
        }
    };

    const register = async (name, email, password, mobile) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, mobile })
        });
        const data = await response.json();
        
        if (response.ok) {
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return true;
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    };

    const forgotPassword = async (email) => {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || 'Failed to send reset email');
        }
    };

    const resetPassword = async (token, password) => {
        const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || 'Failed to reset password');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('products');
        localStorage.removeItem('orders');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, forgotPassword, resetPassword, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
