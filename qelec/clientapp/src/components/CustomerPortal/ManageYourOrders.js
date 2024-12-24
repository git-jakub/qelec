import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../../components/Navbar';
import { Table, Title } from '@mantine/core'; // Mantine components

const ManageYourOrders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomerOrders = async () => {
            const token = localStorage.getItem('token');
            console.log("Token being sent:", token); // Log the token to console

            if (!token) {
                console.error("User not authenticated");
                navigate('/login');
                return;
            }

            let userId;
            try {
                const decoded = jwtDecode(token);
                userId = decoded.sub;
                console.log("Customer ID from token:", userId);

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

            try {
                console.log("Making request with token:", token);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/orders?sub=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log("Response status:", response.status);
                if (response.status === 401) {
                    console.error("Unauthorized. Redirecting to login.");
                    navigate('/login');
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
    }, [navigate]);

    return (
        <div className="manage-your-orders">
            <Navbar backPath="/" nextPath="/jobdetails" />
            <Title order={2} align="center" mt="lg" mb="md">
                Your Orders with Details
            </Title>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <Table highlightOnHover withBorder withColumnBorders>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Status</th>
                            <th>Created Date</th>
                            <th>Updated Date</th>
                            <th>Job Description</th>
                            <th>Invoice Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.orderId}>
                                <td>{order.orderId}</td>
                                <td>{order.status}</td>
                                <td>{new Date(order.createdDate).toLocaleDateString()}</td>
                                <td>
                                    {order.updatedDate
                                        ? new Date(order.updatedDate).toLocaleDateString()
                                        : 'N/A'}
                                </td>
                                <td>
                                    {order.jobDetails?.description || 'No job details'}
                                </td>
                                <td>
                                    {order.invoiceDetails?.amount || 'No invoice details'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default ManageYourOrders;
