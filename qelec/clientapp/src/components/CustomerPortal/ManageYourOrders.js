import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../../components/Navbar';
import { Table, Title, ScrollArea } from '@mantine/core'; // Mantine components

const ManageYourOrders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomerOrders = async () => {
            const token = localStorage.getItem('token');
            console.log("Token being sent:", token);

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
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/orders/user-orders?sub=${userId}`, {
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
                <ScrollArea style={{ height: '80vh', width: '100%' }}> {/* Scrollable area */}
                    <Table
                        highlightOnHover
                        withBorder
                        withColumnBorders
                        verticalSpacing="md"
                        horizontalSpacing="md"
                    >
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Status</th>
                                <th>Created Date</th>
                                <th>Updated Date</th>
                                <th>Client Name</th>
                                <th>Client Email</th>
                                <th>Job Address</th>
                                <th>Job Description</th>
                                <th>Estimated Cost</th>
                                <th>Invoice Details</th>
                                <th>Time Slot</th>
                                <th>Status Change History</th>
                                <th>Invoice Date</th>
                                <th>Total Amount</th>
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
                                    <td>{order.jobDetails?.clientName || 'N/A'}</td>
                                    <td>{order.jobDetails?.clientEmail || 'N/A'}</td>
                                    <td>
                                        {order.jobAddress
                                            ? `${order.jobAddress.street || 'N/A'}, ${order.jobAddress.city || 'N/A'}`
                                            : 'No address details'}
                                    </td>
                                    <td>{order.estimateDetails?.jobDescription || 'No job description'}</td>
                                    <td>
                                        {order.estimateDetails?.calculatedCost
                                            ? `£${order.estimateDetails.calculatedCost}`
                                            : 'N/A'}
                                    </td>
                                    <td>
                                        {order.invoiceDetails
                                            ? `${order.invoiceDetails.recipientName}, ${order.invoiceDetails.recipientEmail}`
                                            : 'No invoice details'}
                                    </td>
                                    <td>{order.timeSlotId || 'N/A'}</td>
                                    <td>
                                        {order.statusChangeHistory && order.statusChangeHistory.length > 0
                                            ? order.statusChangeHistory.join(', ')
                                            : 'No status history'}
                                    </td>
                                    <td>
                                        {order.invoiceDetails?.invoiceDate
                                            ? new Date(order.invoiceDetails.invoiceDate).toLocaleDateString()
                                            : 'N/A'}
                                    </td>
                                    <td>
                                        {order.invoiceDetails?.totalAmount
                                            ? `$${order.invoiceDetails.totalAmount}`
                                            : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </ScrollArea>
            )}
        </div>
    );
};

export default ManageYourOrders;
