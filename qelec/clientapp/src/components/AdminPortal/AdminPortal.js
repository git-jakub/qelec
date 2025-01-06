import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const AdminPortal = () => {
    return (
        <div className="admin-portal">
            <Navbar backPath="/" nextPath="/jobdetails" />
            <h2>Admin Portal</h2>
            <nav>
                <ul>
                    <li><Link to="/adminportal/timesetter">Time Setter</Link></li>
                    <li><Link to="/adminportal/manage-users">Manage Users</Link></li>
                    <li><Link to="/adminportal/manage-orders">Manage Orders</Link></li>
                    <li><Link to="/adminportal/generate-invoice">Generate Invoice</Link></li>
                    <li><Link to="/adminportal/generate-pat-certificate">Generate PAT Certificate</Link></li>
                    <li><Link to="/adminportal/analytics-reports">Analytics Reports</Link></li>

                </ul>
            </nav>
        </div>
    );
};

export default AdminPortal;
