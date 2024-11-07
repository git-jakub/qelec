import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';  // Import OrderContext for shared state
import './SharedStyles.css';
import './InvoiceRecipient.css';

const InvoiceRecipient = () => {
    const navigate = useNavigate();
    const { setOrderData } = useContext(OrderContext);

    const [formData, setFormData] = useState({
        recipientName: '',
        companyName: '',
        recipientAddress: '',
        recipientPostcode: '',
        recipientCity: '',
        recipientEmail: '',
        recipientPhone: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setOrderData((prevData) => ({ ...prevData, invoiceDetails: formData })); // Save data in context
        navigate('/ordersummary'); // Navigate to OrderSummary
    };

    const handleBack = () => {
        navigate('/jobdetails'); // Navigate to JobDetails
    };

    return (
        <div className="invoice-form">
            <div className="navbar">
                <button className="back-button" onClick={handleBack}>Back</button>
                <h2>Invoice Recipient</h2>
                <button className="next-button" onClick={handleSubmit}>Next</button>
            </div>

            <form onSubmit={handleSubmit}>
                <label htmlFor="recipientName">Recipient Name:</label>
                <input
                    type="text"
                    id="recipientName"
                    name="recipientName"
                    placeholder="Enter recipient name"
                    value={formData.recipientName}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="companyName">Company Name:</label>
                <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="recipientAddress">Recipient Address:</label>
                <input
                    type="text"
                    id="recipientAddress"
                    name="recipientAddress"
                    placeholder="Enter recipient address"
                    value={formData.recipientAddress}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="recipientPostcode">Postcode:</label>
                <input
                    type="text"
                    id="recipientPostcode"
                    name="recipientPostcode"
                    placeholder="Enter postcode"
                    value={formData.recipientPostcode}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="recipientCity">City:</label>
                <input
                    type="text"
                    id="recipientCity"
                    name="recipientCity"
                    placeholder="Enter city"
                    value={formData.recipientCity}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="recipientEmail">Recipient Email:</label>
                <input
                    type="email"
                    id="recipientEmail"
                    name="recipientEmail"
                    placeholder="Enter recipient email"
                    value={formData.recipientEmail}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="recipientPhone">Phone Number:</label>
                <input
                    type="tel"
                    id="recipientPhone"
                    name="recipientPhone"
                    placeholder="Enter phone number"
                    value={formData.recipientPhone}
                    onChange={handleChange}
                    required
                />

                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default InvoiceRecipient;
