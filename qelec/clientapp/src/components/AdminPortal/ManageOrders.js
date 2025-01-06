import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, TextInput, Select, ScrollArea } from '@mantine/core';
import Navbar from '../../components/Navbar';
import { jwtDecode } from 'jwt-decode';

const isTokenValid = (token) => {
    try {
        const decoded = jwtDecode(token);
        return decoded.exp > Math.floor(Date.now() / 1000); // Check if the token is expired
    } catch (error) {
        console.error('Invalid token:', error);
        return false;
    }
};

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');

        if (!token || !isTokenValid(token)) {
            console.error('Token is missing or expired. Redirecting to login.');
            setError('Your session has expired. Please log in again.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/all-orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch orders: ${response.status}`);
            }

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to fetch orders.');
        }
    };

    const handleEdit = (order) => {
        setSelectedOrder(order);
        setIsEditModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/${selectedOrder.orderId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedOrder),
            });

            if (!response.ok) {
                throw new Error(`Failed to update: ${response.status}`);
            }

            alert('Order updated successfully');
            fetchOrders(); // Refresh the orders
            setIsEditModalOpen(false); // Close the modal
        } catch (error) {
            console.error('Error updating order:', error);
            setError('Failed to update order.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Navbar backPath="/" />
            <h2>Manage Orders</h2>
            {error && <p className="error">{error}</p>}
            <ScrollArea style={{ height: '80vh', width: '100%' }}>
                <Table withBorder withColumnBorders verticalSpacing="md" horizontalSpacing="md">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Status</th>
                            <th>Created Date</th>
                            <th>Updated Date</th>
                            <th>Client Name</th>
                            <th>Client Email</th>
                            <th>Job Description</th>
                            <th>Estimated Cost</th>
                            <th>Invoice Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.orderId}>
                                <td>{order.orderId}</td>
                                <td>{order.status}</td>
                                <td>{new Date(order.createdDate).toLocaleDateString()}</td>
                                <td>{order.updatedDate ? new Date(order.updatedDate).toLocaleDateString() : 'N/A'}</td>
                                <td>{order.jobDetails?.clientName || 'N/A'}</td>
                                <td>{order.jobDetails?.clientEmail || 'N/A'}</td>
                                <td>{order.estimateDetails?.jobDescription || 'No job description'}</td>
                                <td>
                                    {order.estimateDetails?.calculatedCost
                                        ? `£${order.estimateDetails.calculatedCost}`
                                        : 'N/A'}
                                </td>
                                <td>
                                    {order.invoiceDetails?.totalAmount
                                        ? `$${order.invoiceDetails.totalAmount}`
                                        : 'N/A'}
                                </td>
                                <td>
                                    <Button size="xs" onClick={() => handleEdit(order)}>Edit</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </ScrollArea>

            {/* Modal for Editing */}
            <Modal
                opened={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={`Edit Order ${selectedOrder?.orderId}`}
            >
                {selectedOrder && (
                    <div>
                        <Select
                            label="Status"
                            value={selectedOrder.status}
                            onChange={(value) => setSelectedOrder({ ...selectedOrder, status: value })}
                            data={[
                                { value: 'Scheduled', label: 'Scheduled' },
                                { value: 'Completed', label: 'Completed' },
                                { value: 'Cancelled', label: 'Cancelled' },
                            ]}
                        />
                        <TextInput
                            label="Client Name"
                            value={selectedOrder.jobDetails?.clientName || ''}
                            onChange={(e) =>
                                setSelectedOrder({
                                    ...selectedOrder,
                                    jobDetails: { ...selectedOrder.jobDetails, clientName: e.target.value },
                                })
                            }
                        />
                        <TextInput
                            label="Total Amount"
                            type="number"
                            value={selectedOrder.invoiceDetails?.totalAmount || ''}
                            onChange={(e) =>
                                setSelectedOrder({
                                    ...selectedOrder,
                                    invoiceDetails: { ...selectedOrder.invoiceDetails, totalAmount: e.target.value },
                                })
                            }
                        />
                        <Button fullWidth mt="md" onClick={handleSave}>Save Changes</Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManageOrders;
