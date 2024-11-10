import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Import the Navbar component
import './SharedStyles.css';
import './WelcomePage.css';

const WelcomePage = () => {
    const navigate = useNavigate();

    const handleBookNow = () => {
        navigate('/estimates');
    };

    return (
        <div className="welcome-container">
            {/* Reusable Navbar */}
            <Navbar backPath="/ordersummary" nextPath="/estimates" /> 

            <div className="logo">
                <img src="/mainlogo.png" alt="QElectric Logo" />
            </div>
            <h1 className="title">Book Electrical works hassle-free:</h1>
            <div className="service-options">
                <div className="service-option">
                    <img src="/InstallationLogo.png" alt="Installation Work" />
                    <p>Installation Work</p>
                </div>
                <div className="service-option">
                    <img src="/CallOutsLogo.png" alt="24/7 Call Outs" />
                    <p>24/7 Call Outs</p>
                </div>
                <div className="service-option">
                    <img src="/EICRLogo.png" alt="Inspection & Testing" />
                    <p>Inspection & Testing</p>
                </div>
            </div>
            <button className="book-now-btn" onClick={handleBookNow}>
                Book Now
            </button>
        </div>
    );
};

export default WelcomePage;
