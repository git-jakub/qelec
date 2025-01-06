// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService';
import Navbar from '../../components/Navbar';
/*import './../SharedStyles.css';*/
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Use AuthService to handle login
            const data = await AuthService.login(email, password);
            console.log("Login response data:", data); // Check if userName is included

            if (data.userRole === 'Admin') {
                navigate('/adminportal'); // Redirect admin to admin portal
            } else if (data.userRole === 'Customer') {
                navigate('/customerportal'); // Redirect customer to cutomer portal 
            } else {
                setError('Invalid role');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'An error occurred while logging in.');
        }
    };

    return (
                   
        <div className="login-container">
            <Navbar backPath="/" nextPath="/jobdetails" />
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
            <p>
                <a href="/forgot-password">Forgot your password?</a>
            </p>

        </div>
    );
};

export default Login;
