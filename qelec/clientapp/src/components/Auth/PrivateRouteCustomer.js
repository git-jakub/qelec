// src/components/Auth/PrivateRouteCustomer.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Named import

const PrivateRouteCustomer = ({ children }) => {
    // Get the token and role from localStorage
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // Check if the token is valid and the user has the 'Customer' role
    if (!token || userRole !== 'Customer') {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);

        // Check if the token is expired
        if (decoded.exp < Date.now() / 1000) {
            console.error("Token expired. Redirecting to login.");
            return <Navigate to="/login" replace />;
        }
    } catch (error) {
        console.error("Invalid token. Redirecting to login.");
        return <Navigate to="/login" replace />;
    }

    // If the checks pass, render the children components
    return children;
};

export default PrivateRouteCustomer;
