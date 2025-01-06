import React, { useState, useContext, useEffect, useRef } from 'react';
import { generateEstimate } from '../services/estimateService';
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
    const { setOrderData } = useContext(OrderContext); // Access context
    const [input, setInput] = useState('');
    const [generatedTime, setGeneratedTime] = useState(1);
    const [calculatedCost, setCalculatedCost] = useState(50); // Initial cost
    const [editable, setEditable] = useState(true);

    const [postcode, setPostcode] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [paidOnStreet, setPaidOnStreet] = useState(false);
    const [visitorPermit, setVisitorPermit] = useState(false);
    const [congestionCharge, setCongestionCharge] = useState(false);
    const [multiplierDetails, setMultiplierDetails] = useState(null); // Track multiplier details
    const [postcodeTierCost, setPostcodeTierCost] = useState(0); // Dynamic commuting cost

    // Track mounted state to handle cleanup
    const isMounted = useRef(true);

    useEffect(() => {
        // Set mounted state to true
        isMounted.current = true;

        // Cleanup function when component unmounts
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleGenerateEstimate = async () => {
        try {
            const result = await generateEstimate(input);
            if (!isMounted.current) return; // Prevent state updates if unmounted

            const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;

            const timeInHours = Math.max(1, parseFloat(parsedResult.time.replace('h', '')));
            setGeneratedTime(timeInHours);

            // Update calculated cost
            const laborCost = timeInHours * HOURLY_RATE;
            setCalculatedCost(laborCost);
        } catch (error) {
            console.error('Error generating estimate:', error);
            alert('Error generating estimate. Please try again.');
        }
    };

    const navigateToTimePlanner = () => {
        // Calculate breakdown of costs
        const laborCost = generatedTime * HOURLY_RATE;
        const parkingCost = paidOnStreet ? generatedTime * PAID_ON_STREET_EXTRA_COST_PER_HOUR : 0;
        const totalCongestionCharge = congestionCharge ? CONGESTION_CHARGE_COST : 0;
        const commutingCost = postcodeTierCost;

        // Save all the current data into context
        setOrderData((prevData) => ({
            ...prevData,
            estimateDetails: {
                jobDescription: input,
                generatedTime,
                calculatedCost,
                costBreakdown: {
                    laborCost,
                    parkingCost,
                    totalCongestionCharge,
                    commutingCost,
                    postcode, // Include postcode for display
                },
            },
            jobAddress: {
                postcode,
                street,
                city,
                paidOnStreet,
                visitorPermit,
                congestionCharge,
            },
        }));

        // Navigate to the next page
        navigate('/timeplanner');
    };

    return (
        <div className="estimate-generator-page">
            <Navbar backPath="/" nextPath="/timeplanner" />

            <div className="estimate-generator__container">


                {/* Estimate Generator Section */}
                <div className="estimate-generator__left">
                    <div className="estimate-generator">
                        <h1 className="estimate-title">Estimate Generator</h1>
                        <p className="estimate-instruction">Describe the job, and we will estimate the time
                            required:</p>

                        <textarea
                            className="estimate-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter job details..."
                        />

                        <button className="generate-button" onClick={handleGenerateEstimate}>
                            Generate Estimate
                        </button>
                    </div>


                    {/* Job Address Section */}
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
                </div>

                <div className="estimate-generator__right">
                    <EstimateDetails
                        input={input}
                        setInput={setInput}
                        generatedTime={generatedTime}
                        setGeneratedTime={setGeneratedTime}
                        calculatedCost={calculatedCost}
                        editable={editable}
                        setEditable={setEditable}
                        paidOnStreet={paidOnStreet}
                        congestionCharge={congestionCharge}
                        postcode={postcode}
                        postcodeTierCost={postcodeTierCost || 0} // Default to 0
                    />

                    <div className="submit-section">
                        <button className="proceed-button" onClick={navigateToTimePlanner}>
                            Submit
                        </button>
                    </div>
                </div>
                {/* Estimate Details Section */}


                {/* Submit Button */}


                {/* Cost Calculator */}
                <CostCalculator
                    generatedTime={generatedTime}
                    postcode={postcode}
                    paidOnStreet={paidOnStreet}
                    congestionCharge={congestionCharge}
                    setCalculatedCost={setCalculatedCost}
                    setMultiplierDetails={setMultiplierDetails}
                    setPostcodeTierCost={setPostcodeTierCost}
                    calculatePostcodeCost={true} // Enable postcode calculation
                />
            </div>
        </div>
    );
}

export default EstimateGenerator;