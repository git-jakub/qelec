// src/components/Auth/PrivateRouteCustomer.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from './AuthService';


const PrivateRouteCustomer = ({ children }) => {
    // Check if the user is authenticated and has the 'Customer' role
    const isAuthenticated = AuthService.isAuthenticated();
    const userRole = AuthService.getUserRole();

    if (!isAuthenticated || userRole !== 'Customer') {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRouteCustomer;
