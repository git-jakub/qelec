import React, { useState } from 'react';
import AuthService from './AuthService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Sending email:", email);
            const response = await AuthService.requestPasswordReset(email);
            setMessage(response.message);
            setError('');
        } catch (err) {
            setError(err.message);
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
