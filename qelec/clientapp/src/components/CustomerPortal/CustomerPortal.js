

import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { jwtDecode } from "jwt-decode"; // Named import

const CustomerPortal = () => {
    return (
        <div className="customer-portal">
            <Navbar backPath="/" nextPath="/jobdetails" />
            <h2>Customer Portal</h2>
            <nav>
                <ul>
               
                    <li><Link to="manageyourorders">Manage Orders</Link></li>
                    {/* Add more admin links as needed */}
                </ul>
            </nav>
           
        </div>
    );
};

export default CustomerPortal;
