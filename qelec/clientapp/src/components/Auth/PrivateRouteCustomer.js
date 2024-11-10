// src/components/Auth/PrivateRouteCustomer.js
import React from 'react';
import { Navigate } from 'react-router-dom';



const PrivateRouteCustomer = ({ children }) => {
    // Check if the user is authenticated and has the 'Customer' role
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');


    if (!token || userRole !== 'Customer') {
        return <Navigate to="/customerportal" replace />;
    }

    return children;
};

export default PrivateRouteCustomer;
