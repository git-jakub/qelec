import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import AuthService from './Auth/AuthService';

const Navbar = ({ backPath, nextPath }) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        // Retrieve userName and role using AuthService
        const storedName = AuthService.getUserName();
        const storedRole = AuthService.getUserRole(); // Method to get user role
        setUserName(storedName || '');
        setUserRole(storedRole || '');
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        setUserName('');
        setUserRole('');
        navigate('/login');
    };

    return (
        <div className="navbar">
            {/* Sekcja po lewej stronie */}
            <div className="navbar-left">
                <button onClick={() => navigate(backPath)} className="back-button">Back</button>

                <button onClick={() => userName ? handleLogout() : navigate('/login')} className="login-button">
                    {userName ? 'Logout' : 'Login'}
                </button>

                {/* Wyświetl wiadomość i portal tylko jeśli użytkownik jest zalogowany */}
                {userName && (
                    <>
                        <span className="welcome-message">Welcome, {userName}!</span>
                        <button
                            onClick={() => navigate(userRole === 'Admin' ? '/adminportal' : '/customerportal')}
                            className="portal-button"
                        >
                            {userRole === 'Admin' ? 'Admin Portal' : 'Customer Portal'}
                        </button>
                    </>
                )}
            </div>

            {/* Sekcja po prawej stronie */}
            <div className="navbar-right">
                <button onClick={() => navigate(nextPath)} className="next-button">Next</button>
            </div>
        </div>
    );
};

export default Navbar;
