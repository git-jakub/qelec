import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import Navbar from './Navbar'; // Import Navbar component
import './SharedStyles.css';
import './JobDetails.css';

const JobDetails = () => {
    const navigate = useNavigate();
    const { setOrderData, resetOrderData } = useContext(OrderContext);

    useEffect(() => {
        if (resetOrderData) {
            resetOrderData();
        }
    }, [resetOrderData]);

    const [formData, setFormData] = useState({
        clientName: '',
        siteAccessInfo: '',
        mobile: '',
        clientEmail: '',
        yourReference: '', // Field for "Your Reference"
        additionalInfo: '', // New field for additional property information
        files: [], // Optional files upload
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            files: Array.from(e.target.files),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Data being saved to context:', formData); // Debugging saved data

        // Update the context while preserving existing data
        setOrderData((prevData) => ({
            ...prevData,
            jobDetails: formData,
        }));

        navigate('/invoice'); // Navigate to the next page
    };

    return (
        <div className="job-details-form">
            <Navbar backPath="/" nextPath="/invoice" />
            
         
            {/* Sekcja z polami tekstowymi */}
            
            <div className="job-details-section">
                <h2>Job Details</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="clientName">Name:</label>
                    <input
                        type="text"
                        id="clientName"
                        name="clientName"
                        placeholder="Enter your name"
                        value={formData.clientName}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="siteAccessInfo">Site Access Information:</label>
                    <input
                        type="text"
                        id="siteAccessInfo"
                        name="siteAccessInfo"
                        placeholder="Enter site access information"
                        value={formData.siteAccessInfo}
                        onChange={handleChange}
                    />

                    <label htmlFor="mobile">Mobile Number:</label>
                    <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        placeholder="Enter your mobile number"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="clientEmail">Email:</label>
                    <input
                        type="email"
                        id="clientEmail"
                        name="clientEmail"
                        placeholder="Enter your email"
                        value={formData.clientEmail}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="yourReference">Your Reference:</label>
                    <input
                        type="text"
                        id="yourReference"
                        name="yourReference"
                        placeholder="Enter your reference (optional)"
                        value={formData.yourReference}
                        onChange={handleChange}
                    />

                    <label htmlFor="additionalInfo">Additional Information:</label>
                    <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        placeholder="Enter property size, type, and specific requirements"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        rows="4"
                    />

                    <label htmlFor="files">Upload Files (optional):</label>
                    <input
                        type="file"
                        id="files"
                        name="files"
                        multiple
                        onChange={handleFileChange}
                    />

                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );

};

export default JobDetails;
