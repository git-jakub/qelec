import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import emailjs from 'emailjs-com';
import './OrderSummary.css';

const OrderSummary = () => {
    const navigate = useNavigate();
    const { orderData } = useContext(OrderContext);
    const { timeSlot, jobDetails, invoiceDetails } = orderData;

    // Format date
    const formattedDate = timeSlot?.date ? new Date(timeSlot.date).toLocaleDateString() : 'N/A';

    // State to store Order ID
    const [orderId, setOrderId] = useState(null);

    // Function to save order
    const saveOrder = async () => {
        const orderPayload = {
            timeSlotId: timeSlot?.id,
            jobDetails: JSON.stringify(jobDetails),
            invoiceDetails: JSON.stringify(invoiceDetails)
        };

        console.log("Order Payload:", orderPayload); // Debug payload

        try {
            const response = await fetch(`https://api.qelectric.net/api/orders`, {

                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderPayload)
            });

            console.log("Response Status:", response.status); // Debug response status

            if (response.ok) {
                const savedOrder = await response.json();
                setOrderId(savedOrder.orderId);
                sendEmail(savedOrder.orderId);
                alert("Order saved successfully!");
            } else {
                const errorText = await response.text();
                console.error("Failed to save order:", errorText); // Log error details
                alert("Failed to save order.");
            }
        } catch (error) {
            console.error("Error saving order:", error);
            alert("An error occurred while saving the order.");
        }
    };

    // Function to send email with Order ID
    const sendEmail = (orderId) => {
        if (jobDetails?.email) {
            const templateParams = {
                to_email: jobDetails.email,
                time_slot: `${formattedDate}, ${timeSlot ? timeSlot.time : 'N/A'}`,
                job_address: jobDetails.address,
                job_name: jobDetails.name,
                invoice_recipient: invoiceDetails.recipientName,
                invoice_company: invoiceDetails.companyName,
                order_id: orderId // Pass OrderId to email template
            };

            emailjs.send('service_7n0t7bg', 'template_axl4qnw', templateParams, 'XvVzICuTNwzlzA_5x')
                .then((response) => {
                    console.log('SUCCESS!', response.status, response.text);
                    alert('Email sent successfully to ' + jobDetails.email);
                }, (error) => {
                    console.error('FAILED...', error);
                    alert('Failed to send email.');
                });
        } else {
            alert('No email address found for the client!');
        }
    };

    return (
        <div className="order-summary">
            <div className="navbar">
                <button onClick={() => navigate('/invoice')} className="back-button">Back</button>
                <h2>Summary of your Order</h2>
                <button onClick={() => navigate('/')} className="skip-button">Next</button>
            </div>

            {orderId && (
                <div className="order-id-section">
                    <h3>Order Reference Number</h3>
                    <p>Your Order ID: {orderId}</p>
                </div>
            )}

            <div className="summary-section">
                <h3>Time Slot</h3>
                <p>Date: {formattedDate}</p>
                <p>Time: {timeSlot ? timeSlot.time : 'N/A'}</p>
            </div>

            <div className="summary-section">
                <h3>Job Details</h3>
                <p>Post Code: {jobDetails?.postcode || 'N/A'}</p>
                <p>Address: {jobDetails?.address || 'N/A'}</p>
                <p>Name: {jobDetails?.name || 'N/A'}</p>
                <p>Site Access Info: {jobDetails?.siteAccessInfo || 'N/A'}</p>
                <p>Mobile: {jobDetails?.mobile || 'N/A'}</p>
                <p>Email: {jobDetails?.email || 'N/A'}</p>
            </div>

            <div className="summary-section">
                <h3>Invoice Details</h3>
                <p>Recipient Name: {invoiceDetails?.recipientName || 'N/A'}</p>
                <p>Company Name: {invoiceDetails?.companyName || 'N/A'}</p>
                <p>Address: {invoiceDetails?.address || 'N/A'}</p>
                <p>Postcode: {invoiceDetails?.postcode || 'N/A'}</p>
                <p>Email: {invoiceDetails?.email || 'N/A'}</p>
                <p>Phone: {invoiceDetails?.phone || 'N/A'}</p>
            </div>

            <button onClick={saveOrder} className="submit-button">
                Save Order and Send Email
            </button>
        </div>
    );
};

export default OrderSummary;
