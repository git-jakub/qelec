import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext'; // Import context
import Navbar from './Navbar';
import JobAddress from './Address/JobAddress';
import CostCalculator from './CostCalculator';
import EstimateDetails from './EstimateDetails'; // Import EstimateDetails
import './SharedStyles.css';
import './EstimateGenerator.css';

const HOURLY_RATE = 50;
const PAID_ON_STREET_EXTRA_COST_PER_HOUR = 5;
const CONGESTION_CHARGE_COST = 15;

function EstimateGenerator() {
    const navigate = useNavigate();
    const { orderData, setOrderData } = useContext(OrderContext); // Access context
    const contextEstimateDetails = orderData.estimateDetails || {}; // Extract data from context

    // Local states with fallback to context values
    const [generatedTime, setGeneratedTime] = useState(contextEstimateDetails.generatedTime || 1);
    const [calculatedCost, setCalculatedCost] = useState(contextEstimateDetails.calculatedCost || 50);

    const [postcode, setPostcode] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [paidOnStreet, setPaidOnStreet] = useState(false);
    const [visitorPermit, setVisitorPermit] = useState(false);
    const [congestionCharge, setCongestionCharge] = useState(false);
    const [multiplierDetails, setMultiplierDetails] = useState(null);
    const [postcodeTierCost, setPostcodeTierCost] = useState(0);

    const navigateToTimePlanner = () => {
        const laborCost = generatedTime * HOURLY_RATE;
        const parkingCost = paidOnStreet ? generatedTime * PAID_ON_STREET_EXTRA_COST_PER_HOUR : 0;
        const totalCongestionCharge = congestionCharge ? CONGESTION_CHARGE_COST : 0;

        setOrderData((prevData) => ({
            ...prevData,
            estimateDetails: {
                ...prevData.estimateDetails,
                costBreakdown: {
                    laborCost,
                    parkingCost,
                    totalCongestionCharge,
                    commutingCost: postcodeTierCost || 0,
                },
            },
        }));

        navigate('/timeplanner');
    };

    return (
        <div className="estimate-generator-page">
            <Navbar backPath="/" nextPath="/timeplanner" />


            <div className="estimate-generator__container">
                <div className="estimate-generator__left">
                    <EstimateDetails
                        input={contextEstimateDetails.jobDescription}
                        setInput={(updatedInput) => {
                            setOrderData((prev) => ({
                                ...prev,
                                estimateDetails: {
                                    ...prev.estimateDetails,
                                    jobDescription: updatedInput,
                                },
                            }));
                        }}
                        generatedTime={generatedTime}
                        setGeneratedTime={setGeneratedTime}
                        calculatedCost={calculatedCost}
                        paidOnStreet={paidOnStreet}
                        congestionCharge={congestionCharge}
                        postcode={postcode}
                        postcodeTierCost={postcodeTierCost || 0}
                    />
                </div>
                <div className="estimate-generator__right">
                    <JobAddress
                        postcode={postcode}
                        setPostcode={setPostcode}
                        street={street}
                        setStreet={setStreet}
                        city={city}
                        setCity={setCity}
                        paidOnStreet={paidOnStreet}
                        setPaidOnStreet={setPaidOnStreet}
                        visitorPermit={visitorPermit}
                        setVisitorPermit={setVisitorPermit}
                        congestionCharge={congestionCharge}
                        setCongestionCharge={setCongestionCharge}
                    />

                    <div className="submit-section">
                        <button className="proceed-button" onClick={navigateToTimePlanner}>
                            Submit
                        </button>
                    </div>

                    <CostCalculator
                        generatedTime={generatedTime}
                        postcode={postcode}
                        paidOnStreet={paidOnStreet}
                        congestionCharge={congestionCharge}
                        setCalculatedCost={setCalculatedCost}
                        setMultiplierDetails={setMultiplierDetails}
                        setPostcodeTierCost={setPostcodeTierCost}
                        calculatePostcodeCost
                    />
                </div>
                </div>
            </div>




    );
}

export default EstimateGenerator;
