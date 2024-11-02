import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRouteAdmin = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuthorization = () => {
            const token = localStorage.getItem('token');
            const userRole = localStorage.getItem('role');

            // Check if the user is authenticated and has the admin role
            if (token && userRole === 'admin') {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
            setLoading(false);
        };

        checkAuthorization();
    }, []);

    // Display loading state while checking authorization
    if (loading) {
        return <div>Loading...</div>;
    }

    // Redirect to login if not authorized
    if (!isAuthorized) {
        return <Navigate to="/login" replace />;
    }

    // Render child components if authorized
    return children;
};

export default PrivateRouteAdmin;
