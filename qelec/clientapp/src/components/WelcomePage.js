import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Import the Navbar component
import EstimateInputForm from './EstimateInputForm'; // Import the updated component
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

            {/* Blue Box */}
            <div className="blue-box">
                {/* Logo */}
                <div className="logo">
                    <img src="/mainlogo.png" alt="QElectric Logo" />
                </div>

                <h1 className="title">Book Electrical works hassle-free:</h1>

                {/* Icons inside the Blue Box */}
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
            </div>

            {/* Estimate Generator section below the Blue Box */}
            <div className="content">
                <EstimateInputForm />
            </div>
        </div>
    );
};

export default WelcomePage;
