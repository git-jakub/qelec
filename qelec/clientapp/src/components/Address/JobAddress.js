import React, { useEffect, useRef, useContext } from 'react';
import { OrderContext } from '../../context/OrderContext';
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
    const { setOrderData } = useContext(OrderContext); // Access context

    const updateContext = (updatedValues) => {
        setOrderData((prevData) => ({
            ...prevData,
            jobAddress: {
                ...prevData.jobAddress,
                ...updatedValues,
            },
        }));
    };

    const calculationRef = useRef(null); // To track ongoing calculations or API requests

    const startPostcodeCalculations = (newPostcode) => {
        if (calculationRef.current) {
            clearTimeout(calculationRef.current); // Clear any ongoing calculations
        }
        calculationRef.current = setTimeout(() => {
            // Perform calculations or API requests here
            console.log('Calculating details for postcode:', newPostcode);
        }, 500); // Debounced delay
    };

    useEffect(() => {
        return () => {
            if (calculationRef.current) {
                clearTimeout(calculationRef.current); // Cleanup on unmount
            }
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
                        setPostcode(e.target.value);
                        startPostcodeCalculations(e.target.value);
                        updateContext({ postcode: e.target.value });
                    }}
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
                        setStreet(e.target.value);
                        updateContext({ street: e.target.value });
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
                        setCity(e.target.value);
                        updateContext({ city: e.target.value });
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
                            setPaidOnStreet(e.target.checked);
                            updateContext({ paidOnStreet: e.target.checked });
                        }}
                    />
                    Paid On Street (£5/hour)
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={visitorPermit}
                        onChange={(e) => {
                            setVisitorPermit(e.target.checked);
                            updateContext({ visitorPermit: e.target.checked });
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
                            setCongestionCharge(e.target.checked);
                            updateContext({ congestionCharge: e.target.checked });
                        }}
                    />
                    Congestion Charge Applies (£15)
                </label>
            </div>
        </div>
    );
};

export default JobAddress;
