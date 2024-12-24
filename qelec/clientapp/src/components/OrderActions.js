import React, { useState } from 'react';
import { sendOrderEmail } from '../services/emailService'; // Email service
import { generateInvoicePdf } from '../services/pdfService'; // PDF service
import './OrderActions.css'; // Optional: Add specific styles for this component

const OrderActions = ({ orderData, onOrderSaved }) => {
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const handleSaveOrder = async () => {
        setLoading(true); // Show loading spinner
        try {
            // Step 1: Save order to backend
            const orderResponse = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to save order. Please try again.');
            }

            const savedOrder = await orderResponse.json();
            setOrderId(savedOrder.id);

            // Step 2: Generate PDF invoice
            const pdfResponse = await generateInvoicePdf(savedOrder.id);
            if (!pdfResponse || pdfResponse.status !== 'success') {
                throw new Error('Failed to generate PDF invoice.');
            }

            // Step 3: Send email with the invoice
            const emailResponse = await sendOrderEmail(savedOrder.id);
            if (!emailResponse || emailResponse.status !== 'success') {
                throw new Error('Failed to send order confirmation email.');
            }

            // Notify parent component
            onOrderSaved(savedOrder.id);
            alert('Order saved and email sent successfully!');
        } catch (error) {
            console.error(error);
            alert(`An error occurred: ${error.message}`);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    return (
        <div className="order-actions">
            {orderId && (
                <p>
                    Order saved successfully! Reference ID: <strong>{orderId}</strong>
                </p>
            )}
            <button onClick={handleSaveOrder} className="save-button" disabled={loading}>
                {loading ? 'Saving...' : 'Save Order and Send Email'}
            </button>
        </div>
    );
};

export default OrderActions;
