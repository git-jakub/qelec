// src/components/AdminPortal/AdminPortal.js

import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const AdminPortal = () => {
    return (
        <div className="admin-portal">
            <Navbar backPath="/" nextPath="/jobdetails" />
            <h2>Admin Portal</h2>
            <nav>
                <ul>
                    <li><Link to="timesetter">Time Setter</Link></li>
                    <li><Link to="manage-users">Manage Users</Link></li>
                    <li><Link to="manage-orders">Manage Orders</Link></li>
                    <li><Link to="generate-invoice">Generate Invoice</Link></li> {/* Added Generate Invoice link */}
                </ul>
            </nav>
            <div className="admin-content">
                {/* Outlet will render nested routes */}
                <Outlet />
            </div>
        </div>
    );
};

export default AdminPortal;
