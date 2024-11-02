import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://localhost:7061/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);             // Save token
                localStorage.setItem('userRole', data.userRole || '');  // Save userRole

                // Check userRole and redirect accordingly
                if (data.userRole === 'Admin') {
                    console.log("Admin detected, navigating to /adminportal");
                    navigate('/adminportal');
                } else {
                    console.log("Non-admin user, navigating to /jobdetails");
                    navigate('/jobdetails');
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to login');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred while logging in.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
