﻿import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import Navbar from './Navbar'; // Import the shared Navbar component
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
        postcode: '',
        city: '',
        address: '',
        clientName: '',
        siteAccessInfo: '',
        mobile: '',
        clientEmail: '',
        serviceType: '',
        serviceDetails: '',
        propertySizeOrSpecification: '',
        files: []
    });

   

    const [estimatedCost, setEstimatedCost] = useState(null);
    const [estimatedTime, setEstimatedTime] = useState(null);

    const serviceOptions = [
        { value: 'installation', label: 'Installation Work' },
        { value: 'callout', label: '24/7 Call Outs' },
        { value: 'inspection', label: 'Inspection & Testing' }
    ];

    const serviceDetailsOptions = {
        installation: [
            { value: 'wiring', label: 'Wiring' },
            { value: 'lighting', label: 'Lighting Installation' },
            { value: 'panel', label: 'Panel Upgrade' }
        ],
        callout: [
            { value: 'emergency', label: 'Emergency Repair' },
            { value: 'diagnostics', label: 'Diagnostics' },
            { value: 'maintenance', label: 'Scheduled Maintenance' }
        ],
        inspection: [
            { value: 'eicr', label: 'EICR Certificate' },
            { value: 'safety', label: 'Safety Inspection' },
            { value: 'testing', label: 'Electrical Testing' }
        ]
    };

    const propertySizeOrSpecificationOptions = {
        eicr: [
            { value: 'studio', label: 'Studio', cost: 100, time: '2h' },
            { value: '1_bedroom', label: '1 Bedroom', cost: 110, time: '2h' },
            { value: '2_bedroom', label: '2 Bedroom', cost: 120, time: '3h' },
            { value: '3_bedroom', label: '3 Bedroom', cost: 130, time: '3h' },
            { value: '4_bedroom', label: '4 Bedroom', cost: 140, time: '4h' }
        ],
        wiring: [
            { value: '1_outlet', label: '1 Outlet', cost: 75, time: '2h' },
            { value: '2_outlets', label: '2 Outlets', cost: 75, time: '2h' },
            { value: '3_outlets', label: '3 Outlets', cost: 75, time: '2h' }
        ],
        lighting: [
            { value: '1_outlet', label: '1 Outlet', cost: 75, time: '2h' },
            { value: '2_outlets', label: '2 Outlets', cost: 75, time: '2h' },
            { value: '3_outlets', label: '3 Outlets', cost: 75, time: '2h' }
        ],
        emergency: [
            { value: 'tripping_circuits', label: 'Tripping Circuits', cost: 75, time: '2h' },
            { value: 'water_leak', label: 'Water Leak', cost: 75, time: '2h' },
            { value: 'central_heating_fault', label: 'Central Heating Fault', cost: 75, time: '2h' },
            { value: 'underfloor_heating_fault', label: 'Underfloor Heating Fault', cost: 75, time: '2h' },
            { value: 'power_cut', label: 'Power Cut', cost: 75, time: '2h' }
        ]
    };
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleServiceTypeChange = (e) => {
        setFormData({
            ...formData,
            serviceType: e.target.value,
            serviceDetails: '',
            propertySizeOrSpecification: ''
        });
        setEstimatedCost(null);
        setEstimatedTime(null);
    };

    const handleServiceDetailsChange = (e) => {
        setFormData({
            ...formData,
            serviceDetails: e.target.value,
            propertySizeOrSpecification: ''
        });
        setEstimatedCost(null);
        setEstimatedTime(null);
    };

    const handleSpecificationChange = (e) => {
        const selectedSpecification = e.target.value;
        setFormData({ ...formData, propertySizeOrSpecification: selectedSpecification });

        const selectedOption = propertySizeOrSpecificationOptions[formData.serviceDetails]?.find(
            (spec) => spec.value === selectedSpecification
        );
        if (selectedOption) {
            setEstimatedCost(selectedOption.cost);
            setEstimatedTime(selectedOption.time);
        }
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            files: Array.from(e.target.files)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setOrderData((prevData) => ({
            ...prevData,
            jobDetails: {
                ...formData,
                estimatedCost,
                estimatedTime
            }
        }));

        navigate('/timeplanner'); // Przeniesienie do strony timeplanner
        
    };

    return (
        <div className="job-details-form">
            <Navbar backPath="/" nextPath="/timeplanner" /> 
            <form onSubmit={handleSubmit}>
                <label htmlFor="serviceType">Select Service Type:</label>
                <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleServiceTypeChange}
                    required
                >
                    <option value="" disabled>Select a service</option>
                    {serviceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {formData.serviceType && (
                    <>
                        <label htmlFor="serviceDetails">Specify Service Details:</label>
                        <select
                            id="serviceDetails"
                            name="serviceDetails"
                            value={formData.serviceDetails}
                            onChange={handleServiceDetailsChange}
                            required
                        >
                            <option value="" disabled>Select service details</option>
                            {serviceDetailsOptions[formData.serviceType].map((detail) => (
                                <option key={detail.value} value={detail.value}>
                                    {detail.label}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {formData.serviceDetails && propertySizeOrSpecificationOptions[formData.serviceDetails] && (
                    <>
                        <label htmlFor="propertySizeOrSpecification">Specify Property Size/Specification:</label>
                        <select
                            id="propertySizeOrSpecification"
                            name="propertySizeOrSpecification"
                            value={formData.propertySizeOrSpecification}
                            onChange={handleSpecificationChange}
                            required
                        >
                            <option value="" disabled>Select size/specification</option>
                            {propertySizeOrSpecificationOptions[formData.serviceDetails].map((spec) => (
                                <option key={spec.value} value={spec.value}>
                                    {spec.label}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {estimatedCost !== null && estimatedTime !== null && (
                    <p className="estimated-info">Estimated Cost: £{estimatedCost} | Estimated Time: {estimatedTime}</p>
                )}

                <label htmlFor="files">Upload Files (e.g., distribution board photos or certificates):</label>
                <input
                    type="file"
                    id="files"
                    name="files"
                    multiple
                    onChange={handleFileChange}
                />

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

                <label htmlFor="city">City:</label>
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

                <label htmlFor="clientName">Client Name:</label>
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

                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default JobDetails;
