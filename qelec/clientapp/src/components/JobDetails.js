import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import './JobDetails.css';

const JobDetails = () => {
    const navigate = useNavigate();
    const { setOrderData } = useContext(OrderContext);

    const [formData, setFormData] = useState({
        postcode: '',
        city: '', // Added City field
        address: '',
        name: '',
        siteAccessInfo: '',
        mobile: '',
        email: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setOrderData((prevData) => ({ ...prevData, jobDetails: formData }));
        navigate('/invoice');
    };

    const handleBack = () => {
        navigate('/timeplanner');
    };

    const handleNext = () => {
        setOrderData((prevData) => ({ ...prevData, jobDetails: formData }));
        navigate('/invoice');
    };

    return (
        <div className="job-details-form">
            <div className="navbar">
                <button className="back-button" onClick={handleBack}>Back</button>
                <h2>Fill in Your Details</h2>
                <button className="next-button" onClick={handleNext}>Next</button>
            </div>

            <form onSubmit={handleSubmit}>
                <label htmlFor="postcode">Post Code:</label>
                <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    placeholder="Enter your post code"
                    value={formData.postcode}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="city">City:</label> {/* New City field */}
                <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="address">Address:</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
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
                    required
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

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default JobDetails;
