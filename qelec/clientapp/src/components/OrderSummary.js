import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import Navbar from './Navbar';
import emailjs from 'emailjs-com';
import './SharedStyles.css';
import './OrderSummary.css';

const OrderSummary = () => {
    const navigate = useNavigate();
    const { orderData } = useContext(OrderContext);
    const { timeSlot, jobDetails, invoiceDetails } = orderData;

    const formattedDate = timeSlot?.date ? new Date(timeSlot.date).toLocaleDateString() : 'N/A';

    const [orderId, setOrderId] = useState(null);
    const [status, setStatus] = useState("Scheduled");

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const editTimeSlot = () => navigate('/timeplanner');
    const editJobDetails = () => navigate('/jobdetails');
    const editInvoiceDetails = () => navigate('/invoice');

    const saveOrder = async () => {
        const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
        console.log("User ID from localStorage:", userId, "Type:", typeof userId);
        console.log("TimeSlot from context:", timeSlot); // Log the full timeSlot object for debugging

        // Przekazanie tylko `timeSlotId` zamiast pełnego obiektu
        const timeSlotId = timeSlot?.startSlot?.timeSlotId || 0;
        console.log("Extracted TimeSlot ID:", timeSlotId, "Type:", typeof timeSlotId); // Confirm it’s a number

        const orderPayload = {
            userId,
            timeSlotId,
            jobDetails: {
                postcode: jobDetails?.postcode || '',
                city: jobDetails?.city || '',
                address: jobDetails?.address || '',
                clientName: jobDetails?.clientName || '',
                siteAccessInfo: jobDetails?.siteAccessInfo || '',
                mobile: jobDetails?.mobile || '',
                clientEmail: jobDetails?.clientEmail || '',
                serviceType: jobDetails?.serviceType || '',
                serviceDetails: jobDetails?.serviceDetails || '',
                propertySizeOrSpecification: jobDetails?.propertySizeOrSpecification || ''
            },
            invoiceDetails: {
                recipientName: invoiceDetails?.recipientName || '',
                companyName: invoiceDetails?.companyName || '',
                recipientAddress: invoiceDetails?.recipientAddress || '',
                recipientPostcode: invoiceDetails?.recipientPostcode || '',
                recipientCity: invoiceDetails?.recipientCity || '',
                recipientEmail: invoiceDetails?.recipientEmail || '',
                recipientPhone: invoiceDetails?.recipientPhone || '',
                paymentStatus: invoiceDetails?.paymentStatus || 'Unpaid'
            },
            status
        };

        try {
            const token = localStorage.getItem('token');
            const headers = {
                "Content-Type": "application/json"
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
                method: "POST",
                headers,
                body: JSON.stringify(orderPayload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Failed to save order:", errorText);
                alert("Failed to save order.");
                return;
            }

            const savedOrder = await response.json();
            setOrderId(savedOrder.orderId);
            

            const invoiceUrl = await generateInvoicePdf(savedOrder.orderId);
            sendEmail(savedOrder.orderId, invoiceUrl);

            alert("Order saved successfully!");
        } catch (error) {
            console.error("Error saving order:", error);
            alert("An error occurred while saving the order.");
        }
    };

    const generateInvoicePdf = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                "Content-Type": "application/json"
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/invoice/generate/${orderId}`, {
                method: "GET",
                headers
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Failed to generate invoice:", errorText);
                alert("Failed to generate invoice.");
                return null;
            }

            const data = await response.json();
            return data.fileUrl;
        } catch (error) {
            console.error("Error generating invoice:", error);
            alert("An error occurred while generating the invoice.");
            return null;
        }
    };

    const sendEmail = (orderId, invoiceUrl) => {
        if (jobDetails?.clientEmail) {
            const templateParams = {
                to_email: jobDetails.clientEmail,
                time_slot: `${formattedDate}, ${timeSlot ? timeSlot.time : 'N/A'}`,
                job_address: jobDetails.address,
                job_name: jobDetails.clientName,
                invoice_recipient: invoiceDetails.recipientName,
                invoice_company: invoiceDetails.companyName,
                order_id: orderId,
                invoice_attachment: invoiceUrl
            };

            emailjs.send('service_7n0t7bg', 'template_axl4qnw', templateParams, 'XvVzICuTNwzlzA_5x')
                .then((response) => {
                    console.log('SUCCESS!', response.status, response.text);
                    alert('Email sent successfully to ' + jobDetails.clientEmail);
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
            <Navbar backPath="/invoice" nextPath="/" />

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
                <button onClick={editTimeSlot} className="edit-button">Edit</button>
            </div>

            <div className="summary-section">
                <h3>Job Details</h3>
                <p>Post Code: {jobDetails?.postcode || 'N/A'}</p>
                <p>Address: {jobDetails?.address || 'N/A'}</p>
                <p>Client Name: {jobDetails?.clientName || 'N/A'}</p>
                <p>Site Access Info: {jobDetails?.siteAccessInfo || 'N/A'}</p>
                <p>Mobile: {jobDetails?.mobile || 'N/A'}</p>
                <p>Client Email: {jobDetails?.clientEmail || 'N/A'}</p>
                <p>Property size: {jobDetails?.propertySizeOrSpecification || 'N/A'}</p>
                <p>Service Details: {jobDetails?.serviceDetails || 'N/A'}</p>
                <p>Service Type: {jobDetails?.serviceType || 'N/A'}</p>
                <button onClick={editJobDetails} className="edit-button">Edit</button>
            </div>

            <div className="summary-section">
                <h3>Invoice Details</h3>
                <p>Recipient Name: {invoiceDetails?.recipientName || 'N/A'}</p>
                <p>Company Name: {invoiceDetails?.companyName || 'N/A'}</p>
                <p>Recipient Address: {invoiceDetails?.recipientAddress || 'N/A'}</p>
                <p>Recipient Postcode: {invoiceDetails?.recipientPostcode || 'N/A'}</p>
                <p>Recipient City: {invoiceDetails?.recipientCity || 'N/A'}</p>
                <p>Recipient Email: {invoiceDetails?.recipientEmail || 'N/A'}</p>
                <p>Recipient Phone: {invoiceDetails?.recipientPhone || 'N/A'}</p>
                <p>Payment Status: {invoiceDetails?.paymentStatus || 'N/A'}</p>
                <button onClick={editInvoiceDetails} className="edit-button">Edit</button>
            </div>

            <div className="summary-section">
                <label>Status:</label>
                <select value={status} onChange={handleStatusChange}>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Rescheduled">Rescheduled</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            <button onClick={saveOrder} className="submit-button">
                Save Order and Send Email
            </button>
        </div>
    );
};

export default OrderSummary;
