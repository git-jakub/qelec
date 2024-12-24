﻿import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import Navbar from './Navbar';
import OrderStatus from './OrderStatus';
import { sendOrderEmail } from '../services/emailService';
import { generateInvoicePdf } from '../services/pdfService';
import './SharedStyles.css';
import './OrderSummary.css';

const OrderSummary = () => {
    const navigate = useNavigate();
    const { orderData } = useContext(OrderContext);
    const { timeSlot, jobDetails, invoiceDetails, jobAddress, estimateDetails } = orderData;

    // Obsługa timeSlot jako tablicy
    const formattedDate = timeSlot?.length > 0
        ? new Date(timeSlot[0]?.date).toLocaleDateString()
        : 'N/A';

    const formattedTime = timeSlot?.length > 0
        ? timeSlot.map((slot) => slot.time).join(', ')
        : 'N/A';

    const [orderId, setOrderId] = useState(null);
    const [status, setStatus] = useState('Scheduled');
    const [loading, setLoading] = useState(false);

    const editTimeSlot = () => navigate('/timeplanner');
    const editJobDetails = () => navigate('/jobdetails');
    const editInvoiceDetails = () => navigate('/invoice');
    const saveOrder = async () => {
        setLoading(true);
        try {
            const validatedOrderData = {
                ...orderData,
                timeSlotId: orderData.timeSlot?.[0]?.startSlot?.timeSlotId || null, // Pobranie ID wybranego przedziału czasowego
                status: orderData.status || 'Scheduled',
                jobDetails: {
                    clientName: orderData.jobDetails?.clientName || 'Not entered',
                    siteAccessInfo: orderData.jobDetails?.siteAccessInfo || 'Not entered',
                    mobile: orderData.jobDetails?.mobile || 'Not entered',
                    clientEmail: orderData.jobDetails?.clientEmail || 'Not entered',
                    yourReference: orderData.jobDetails?.yourReference || 'Not entered',
                    additionalInfo: orderData.jobDetails?.additionalInfo || 'Not entered',
                },
                jobAddress: {
                    postcode: orderData.jobAddress?.postcode || 'Not entered',
                    street: orderData.jobAddress?.street || 'Not entered',
                    city: orderData.jobAddress?.city || 'Not entered',
                    paidOnStreet: !!orderData.jobAddress?.paidOnStreet,
                    visitorPermit: !!orderData.jobAddress?.visitorPermit,
                    congestionCharge: !!orderData.jobAddress?.congestionCharge,
                },
                invoiceDetails: {
                    recipientName: orderData.invoiceDetails?.recipientName || 'Not entered',
                    recipientAddress: orderData.invoiceDetails?.recipientAddress || 'Not entered',
                    recipientPostcode: orderData.invoiceDetails?.recipientPostcode || 'Not entered',
                    recipientCity: orderData.invoiceDetails?.recipientCity || 'Not entered',
                    recipientEmail: orderData.invoiceDetails?.recipientEmail || 'Not entered',
                    recipientPhone: orderData.invoiceDetails?.recipientPhone || 'Not entered',
                    paymentStatus: orderData.invoiceDetails?.paymentStatus || 'Unpaid',
                    companyName: orderData.invoiceDetails?.companyName || 'Not entered',
                },
                estimateDetails: {
                    jobDescription: orderData.estimateDetails?.jobDescription || 'Not entered',
                    calculatedCost: parseFloat(orderData.estimateDetails?.calculatedCost || 0),
                    generatedTime: orderData.estimateDetails?.generatedTime || 1,
                    costBreakdown: {
                        commutingCost: parseFloat(orderData.estimateDetails?.costBreakdown?.commutingCost || 0),
                        paidOnStreet: !!orderData.estimateDetails?.costBreakdown?.paidOnStreet,
                        visitorPermit: !!orderData.estimateDetails?.costBreakdown?.visitorPermit,
                        congestionCharge: !!orderData.estimateDetails?.costBreakdown?.congestionCharge,
                    },
                    postcode: orderData.estimateDetails?.postcode || 'Not entered',
                    multiplierDetails: orderData.estimateDetails?.multiplierDetails || {
                        name: 'Default Multiplier',
                        start: new Date().toISOString(),
                        end: new Date().toISOString(),
                        multiplier: 1.0,
                    },
                },
            };
            console.log('Validated Order Data:', JSON.stringify(validatedOrderData, null, 2));

            const response = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validatedOrderData),
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                console.error('Failed to save order:', errorDetails);
                throw new Error('Failed to save order. Please try again.');
            }

            const savedOrder = await response.json();
            setOrderId(savedOrder.id);
            console.log('Order saved successfully:', savedOrder);

            // **Define emailParams after saving the order**
            const emailParams = {
                recipient_name: validatedOrderData.invoiceDetails.recipientName,
                recipient_email: validatedOrderData.invoiceDetails.recipientEmail,
                order_id: savedOrder.id,
                job_description: validatedOrderData.estimateDetails.jobDescription,
                total_cost: validatedOrderData.estimateDetails.calculatedCost,
                time_slot: timeSlot.map((slot) => slot.time).join(', '), // Assuming timeSlot is an array
                date: formattedDate, // Use the formatted date
            };

            // Send email
            const emailResponse = await sendOrderEmail(emailParams);
            if (!emailResponse.success) {
                console.error('Failed to send email:', emailResponse.error);
                alert('Order saved but email could not be sent. Please try again later.');
            } else {
                console.log('Email sent successfully!');
            }
        } catch (error) {
            console.error('Error during saveOrder:', error);
            alert(`An error occurred: ${error.message}`);
        } finally {
            setLoading(false);
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
                <p>Time: {formattedTime}</p>
                <button onClick={editTimeSlot} className="edit-button">Edit</button>
            </div>

            <div className="summary-section">
                <h3>Job Details</h3>
                <p>Name: {jobDetails?.clientName || 'N/A'}</p>
                <p>Site Access Info: {jobDetails?.siteAccessInfo || 'N/A'}</p>
                <p>Mobile: {jobDetails?.mobile || 'N/A'}</p>
                <p>Email: {jobDetails?.clientEmail || 'N/A'}</p>
                <p>Your Reference: {jobDetails?.yourReference || 'N/A'}</p>
                <p>Additional Information: {jobDetails?.additionalInfo || 'N/A'}</p>
                <button onClick={editJobDetails} className="edit-button">Edit</button>
            </div>

            <div className="summary-section">
                <h3>Job Address</h3>
                <p>Postcode: {jobAddress?.postcode || 'N/A'}</p>
                <p>Street: {jobAddress?.street || 'N/A'}</p>
                <p>City: {jobAddress?.city || 'N/A'}</p>
                <p>Paid On Street: {jobAddress?.paidOnStreet ? 'Yes' : 'No'}</p>
                <p>Visitor Permit: {jobAddress?.visitorPermit ? 'Yes' : 'No'}</p>
                <p>Congestion Charge: {jobAddress?.congestionCharge ? 'Yes' : 'No'}</p>
            </div>

            <div className="summary-section">
                <h3>Estimate Details</h3>
                <p>Job Description: {estimateDetails?.jobDescription || 'N/A'}</p>
                <p>Estimated Time: {estimateDetails?.generatedTime || 'N/A'} hours</p>
                <p>Total Cost: £{estimateDetails?.calculatedCost || 'N/A'}</p>
                <p>Labor Cost: £{estimateDetails?.costBreakdown?.laborCost || 'N/A'}</p>
                <p>Parking Cost: £{estimateDetails?.costBreakdown?.parkingCost || 'N/A'}</p>
                <p>Congestion Charge: £{estimateDetails?.costBreakdown?.totalCongestionCharge || 'N/A'}</p>
                <p>Commuting Cost: £{estimateDetails?.costBreakdown?.commutingCost || 'N/A'}</p>
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
                <OrderStatus status={status} setStatus={setStatus} />
            </div>

            <button onClick={saveOrder} className="submit-button" disabled={loading}>
                {loading ? 'Saving...' : 'Save Order and Send Email'}
            </button>
        </div>
    );
};

export default OrderSummary;
