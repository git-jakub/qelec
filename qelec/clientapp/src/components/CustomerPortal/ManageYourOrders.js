import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Użycie nawiasów klamrowych
import Navbar from '../../components/Navbar';

const ManageYourOrders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomerOrders = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error("User not authenticated");
                navigate('/login');
                return;
            }

            // Dekodowanie tokena, aby uzyskać customerId
            let customerId;
            try {
                const decoded = jwtDecode(token);
                customerId = decoded.sub; // Zakładam, że `customerId` jest przechowywany w `sub`
                console.log("Customer ID from token:", customerId);

                if (decoded.exp < Math.floor(Date.now() / 1000)) {
                    console.error("Token expired. Redirecting to login.");
                    navigate('/login');
                    return;
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                navigate('/login');
                return;
            }

            // Fetch orders for this customer
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/orders?customerId=${customerId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

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

        fetchCustomerOrders();
    }, [navigate]); // Użyj tablicy zależności dla `navigate`

    return (
        <div className="manage-your-orders">
            <Navbar backPath="/" nextPath="/jobdetails" />
            <h2>Your Orders</h2>
            <ul>
                {orders.map((order) => (
                    <li key={order.OrderId}>
                        <p>Order ID: {order.OrderId}</p>
                        <p>Status: {order.status}</p>
                        <p>Date: {order.date}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageYourOrders;
