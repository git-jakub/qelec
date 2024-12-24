import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, TextInput, Select } from '@mantine/core';
import Navbar from '../../components/Navbar';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status}`);
            }

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
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

    const rows = orders.map((order) => (
        <tr key={order.orderId}>
            <td>{order.orderId}</td>
            <td>{order.status}</td>
            <td>{new Date(order.createdDate).toLocaleDateString()}</td>
            <td>{order.jobDetails?.clientName || 'N/A'}</td>
            <td>{order.jobDetails?.serviceType || 'N/A'}</td>
            <td>{order.invoiceDetails?.recipientName || 'N/A'}</td>
            <td>{order.invoiceDetails?.totalAmount || 'N/A'}</td>
            <td>
                <Button size="xs" onClick={() => handleEdit(order)}>Edit</Button>
            </td>
        </tr>
    ));

    return (
        <div style={{ padding: '20px' }}>
            <h2>Manage Orders</h2>
            <Navbar backPath="/" nextPath="/jobdetails" />
            {error && <p className="error">{error}</p>}
            <Table withBorder withColumnBorders>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Status</th>
                        <th>Created Date</th>
                        <th>Client Name</th>
                        <th>Service Type</th>
                        <th>Recipient Name</th>
                        <th>Total Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.length > 0 ? rows : (
                        <tr>
                            <td colSpan={8} style={{ textAlign: 'center' }}>No orders available</td>
                        </tr>
                    )}
                </tbody>
            </Table>

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
                            label="Recipient Name"
                            value={selectedOrder.invoiceDetails?.recipientName || ''}
                            onChange={(e) =>
                                setSelectedOrder({
                                    ...selectedOrder,
                                    invoiceDetails: { ...selectedOrder.invoiceDetails, recipientName: e.target.value },
                                })
                            }
                        />
                        <TextInput
                            label="Total Amount"
                            type="number"
                            value={selectedOrder.invoiceDetails?.totalAmount || 0}
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
