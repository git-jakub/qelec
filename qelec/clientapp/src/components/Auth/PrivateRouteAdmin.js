// src/components/Auth/PrivateRouteAdmin.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRouteAdmin = ({ children }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // Check if the user has a token and the admin role
    if (!token || userRole !== 'Admin') {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRouteAdmin;
