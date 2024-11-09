import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import './CustomerPortal.css';
import Navbar from '../../components/Navbar';

const CustomerPortal = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            console.log("Token in CustomerPortal:", token);

            // Decode the token to check its claims
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    console.log("Decoded token:", decoded);
                    console.log("Token expiration:", decoded.exp, "Current timestamp:", Math.floor(Date.now() / 1000));
                } catch (error) {
                    console.error("Error decoding token:", error);
                    return;
                }
            }

            if (!token) {
                console.error("User not authenticated");
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                console.log("Response status:", response.status);

                if (!response.ok) {
                    if (response.status === 401) {
                        console.error("Unauthorized. Redirecting to login.");
                        navigate('/login');
                    } else {
                        throw new Error('Failed to fetch orders');
                    }
                } else {
                    const data = await response.json();
                    setOrders(data);
                    console.log("Orders data received:", data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [navigate]);

    return (
        <div className="customer-portal">
            <Navbar backPath="/" nextPath="/jobdetails" />
            <h2>My Orders</h2>
            <ul>
                {orders.map((order) => (
                    <li key={order.OrderId}>
                        <p>Order ID: {order.OrderId}</p>
                        <p>Status: {order.status}</p>
                        <button onClick={() => navigate(`/orders/${order.OrderId}`)}>View Details</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomerPortal;
