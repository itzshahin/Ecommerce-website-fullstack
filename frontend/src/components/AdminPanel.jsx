import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const nav = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'shaahinshahies7@gmail.com' && password === 'suii') {
            setSuccessMessage('Welcome Admin!!');
            setTimeout(() => {
                nav('/AddProduct');
            }, 1000);
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleLogin} className="auth-form">
                <h1>ADMIN PANEL</h1>
                <input
                    type="email"
                    placeholder="EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" onClick={handleLogin}>LOGIN </button>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}

export default AdminLogin;
