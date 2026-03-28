import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CheckCircle, TrendingUp, Users, ShoppingCart } from 'lucide-react';

const Landing = () => {
    const { user } = useAuth();
    
    // If already logged in, redirect to app
    if (user) {
        return <Navigate to="/app" replace />;
    }

    return (
        <div className="landing-container">
            <header className="landing-header">
                <div className="logo">
                    <Box size={32} color="var(--primary)" />
                    <h1>Nexventory</h1>
                </div>
                <div className="auth-buttons">
                    <Link to="/login" className="btn btn-outline">Sign In</Link>
                    <Link to="/register" className="btn btn-primary">Create Account</Link>
                </div>
            </header>

            <main className="landing-main">
                <section className="hero">
                    <h2>Smart Inventory Management for Modern Businesses</h2>
                    <p>Streamline your operations, track stock in real-time, and generate powerful insights with our all-in-one platform.</p>
                </section>

                <section className="features">
                    <h3>Everything You Need</h3>
                    <div className="features-grid">
                        <div className="feature-card">
                            <ShoppingCart className="feature-icon" />
                            <h4>Inventory Tracking</h4>
                            <p>Keep precise counts of all your products with low-stock alerts and category organization.</p>
                        </div>
                        <div className="feature-card">
                            <CheckCircle className="feature-icon" />
                            <h4>Billing & Invoicing</h4>
                            <p>Generate professional invoices instantly and calculate taxes with automatically integrated tools.</p>
                        </div>
                        <div className="feature-card">
                            <Users className="feature-icon" />
                            <h4>Customer Management</h4>
                            <p>Maintain customer records securely linked to their purchase history and orders.</p>
                        </div>
                        <div className="feature-card">
                            <TrendingUp className="feature-icon" />
                            <h4>Sales Reporting</h4>
                            <p>Gain actionable insights with visual graphs covering revenue, top products, and daily sales averages.</p>
                        </div>
                    </div>
                </section>

                <section className="cta">
                    <h2>Ready to organize your business?</h2>
                    <p>Join Nexventory today and simplify your workflow.</p>
                    <div className="cta-buttons">
                        <Link to="/login" className="btn btn-outline">Log In</Link>
                        <Link to="/register" className="btn btn-primary">Get Started</Link>
                    </div>
                </section>
            </main>

            <style>{`
                .landing-container { min-height: 100vh; display: flex; flex-direction: column; background-color: var(--background); }
                .landing-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; background: var(--surface); border-bottom: 1px solid var(--border); }
                .logo { display: flex; align-items: center; gap: 0.75rem; }
                .logo h1 { font-size: 1.5rem; color: var(--text); margin: 0; }
                .auth-buttons { display: flex; gap: 1rem; }
                
                .landing-main { flex: 1; padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; width: 100%; }
                
                .hero { text-align: center; margin-bottom: 5rem; }
                .hero h2 { font-size: 3rem; color: var(--text); margin-bottom: 1rem; max-width: 800px; margin-inline: auto; }
                .hero p { font-size: 1.25rem; color: var(--text-muted); max-width: 600px; margin-inline: auto; line-height: 1.6; }
                
                .features { margin-bottom: 5rem; }
                .features h3 { text-align: center; font-size: 2rem; margin-bottom: 3rem; color: var(--text); }
                .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
                
                .feature-card { background: var(--surface); padding: 2rem; border-radius: var(--radius); border: 1px solid var(--border); box-shadow: var(--shadow-sm); transition: transform 0.2s; }
                .feature-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-md); }
                .feature-icon { color: var(--primary); margin-bottom: 1.5rem; width: 40px; height: 40px; }
                .feature-card h4 { font-size: 1.25rem; margin-bottom: 1rem; color: var(--text); }
                .feature-card p { color: var(--text-muted); line-height: 1.6; }

                .cta { text-align: center; background: var(--surface); padding: 4rem 2rem; border-radius: var(--radius); border: 1px solid var(--border); }
                .cta h2 { font-size: 2.5rem; margin-bottom: 1rem; color: var(--text); }
                .cta p { font-size: 1.25rem; color: var(--text-muted); margin-bottom: 2rem; }
                .cta-buttons { display: flex; justify-content: center; gap: 1rem; }

                @media (max-width: 768px) {
                    .hero h2 { font-size: 2rem; }
                    .cta h2 { font-size: 2rem; }
                    .landing-header { flex-direction: column; gap: 1rem; }
                }
            `}</style>
        </div>
    );
};

export default Landing;
