import React, { useEffect, useRef } from 'react';
import './JobAddress.css';

const JobAddress = ({
    postcode,
    setPostcode,
    street,
    setStreet,
    city,
    setCity,
    paidOnStreet,
    setPaidOnStreet,
    visitorPermit,
    setVisitorPermit,
    congestionCharge,
    setCongestionCharge,
}) => {
    const calculationRef = useRef(null); // To track ongoing calculations or API requests

    // Function to start postcode calculations
    const startPostcodeCalculations = (newPostcode) => {
        if (calculationRef.current) {
            console.log('Cancelling ongoing calculation');
            clearTimeout(calculationRef.current); // Clear any ongoing calculations
        }

        calculationRef.current = setTimeout(() => {
            console.log('Calculating details for postcode:', newPostcode);
            // Perform your API requests or calculations here
            // Example: fetchPostcodeDetails(newPostcode);
        }, 500); // Debounced delay
    };

    // Stop calculations on blur
    const stopPostcodeCalculations = () => {
        if (calculationRef.current) {
            console.log('Stopped postcode calculations.');
            clearTimeout(calculationRef.current);
            calculationRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            stopPostcodeCalculations(); // Cleanup on component unmount
        };
    }, []);

    return (
        <div className="job-address-container">
            <h2>Job Address</h2>

            {/* Postcode Input */}
            <div className="job-address-form-group">
                <label htmlFor="postcode">Postcode:</label>
                <input
                    type="text"
                    id="postcode"
                    value={postcode}
                    onChange={(e) => {
                        console.log('Postcode Updated:', e.target.value);
                        setPostcode(e.target.value);
                        startPostcodeCalculations(e.target.value); // Start calculations
                    }}
                    onBlur={stopPostcodeCalculations} // Stop calculations on blur
                />
            </div>

            {/* Street Input */}
            <div className="job-address-form-group">
                <label htmlFor="street">Street:</label>
                <input
                    type="text"
                    id="street"
                    value={street}
                    onChange={(e) => {
                        console.log('Street Updated:', e.target.value);
                        setStreet(e.target.value);
                    }}
                />
            </div>

            {/* City Input */}
            <div className="job-address-form-group">
                <label htmlFor="city">City:</label>
                <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => {
                        console.log('City Updated:', e.target.value);
                        setCity(e.target.value);
                    }}
                />
            </div>

            {/* Parking Arrangements */}
            <div className="job-address-checkbox-group">
                <label>
                    <input
                        type="checkbox"
                        checked={paidOnStreet}
                        onChange={(e) => {
                            console.log('Paid On Street Updated:', e.target.checked);
                            setPaidOnStreet(e.target.checked);
                        }}
                    />
                    Paid On Street (£5/hour)
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={visitorPermit}
                        onChange={(e) => {
                            console.log('Visitor Permit Updated:', e.target.checked);
                            setVisitorPermit(e.target.checked);
                        }}
                    />
                    Visitor Permit (Free)
                </label>
            </div>

            {/* Congestion Charge */}
            <div className="job-address-checkbox-group">
                <label>
                    <input
                        type="checkbox"
                        checked={congestionCharge}
                        onChange={(e) => {
                            console.log('Congestion Charge Updated:', e.target.checked);
                            setCongestionCharge(e.target.checked);
                        }}
                    />
                    Congestion Charge Applies (£15)
                </label>
            </div>
        </div>
    );
};

export default JobAddress;
