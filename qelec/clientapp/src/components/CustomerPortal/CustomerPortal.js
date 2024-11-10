// src/components/AdminPortal/AdminPortal.js

import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const CustomerPortal = () => {
    return (
        <div className="customer-portal">
            <Navbar backPath="/" nextPath="/jobdetails" />
            <h2>Customer Portal</h2>
            <nav>
                <ul>
               
                    <li><Link to="manage-your-orders">Manage Orders</Link></li>
                    {/* Add more admin links as needed */}
                </ul>
            </nav>
           
        </div>
    );
};

export default CustomerPortal;
