import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import AuthService from './Auth/AuthService';




const Navbar = ({ backPath, nextPath }) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Retrieve userName using AuthService
        const storedName = AuthService.getUserName();
        setUserName(storedName || '');
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        setUserName('');
        navigate('/login');
    };

    return (
        <div className="navbar">
            <button onClick={() => navigate(backPath)} className="back-button">Back</button>
            <button onClick={() => userName ? handleLogout() : navigate('/login')} className="login-button">
                {userName ? 'Logout' : 'Login'}
            </button>
            <h2> </h2> {/* Application logo or title */}
            <span className="welcome-message">
                {userName ? `Welcome, ${userName}!` : 'Welcome!'}
            </span>
            <button onClick={() => navigate(nextPath)} className="next-button">Next</button>
        </div>
    );
};

export default Navbar;
