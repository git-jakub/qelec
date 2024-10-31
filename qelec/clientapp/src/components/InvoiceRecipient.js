import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';  // Import OrderContext for shared state
import './InvoiceRecipient.css';

const InvoiceRecipient = () => {
    const navigate = useNavigate();
    const { setOrderData } = useContext(OrderContext);  // Access OrderContext to save data

    const [formData, setFormData] = useState({
        recipientName: '',
        companyName: '',
        address: '',
        postcode: '',
        city: '', // Added City field
        email: '',
        phone: ''
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

    const handleNext = () => {
        setOrderData((prevData) => ({ ...prevData, invoiceDetails: formData })); // Save data to context
        navigate('/ordersummary'); // Navigate to OrderSummary
    };

    return (
        <div className="invoice-form">
            <div className="navbar">
                <button className="back-button" onClick={handleBack}>Back</button>
                <h2>Invoice Recipient</h2>
                <button className="next-button" onClick={handleNext}>Next</button>
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

                <label htmlFor="address">Recipient Address:</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Enter recipient address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="postcode">Postcode:</label>
                <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    placeholder="Enter postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="city">City:</label> {/* New City field */}
                <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="email">Recipient Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter recipient email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="phone">Phone Number:</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default InvoiceRecipient;
