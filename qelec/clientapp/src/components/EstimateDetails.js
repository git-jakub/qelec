import React, { useEffect, useRef, useState, useContext } from 'react';
import { getMultiplierForTimeSlot } from './CostCalculator';
import { OrderContext } from '../context/OrderContext'; // Import context
import './EstimateDetails.css';

const HOURLY_RATE = 50;
const PAID_ON_STREET_EXTRA_COST_PER_HOUR = 5;
const CONGESTION_CHARGE_COST = 15;

const EstimateDetails = ({
    input: propInput,
    setInput: propSetInput,
    generatedTime: propGeneratedTime,
    setGeneratedTime: propSetGeneratedTime,
    editable: propEditable,
    setEditable: propSetEditable,
    paidOnStreet: propPaidOnStreet,
    congestionCharge: propCongestionCharge,
    postcode: propPostcode,
    postcodeTierCost: propPostcodeTierCost,
    timeslotCosts = [],
}) => {
    const { orderData, setOrderData } = useContext(OrderContext); // Access OrderContext
    const estimateDetails = orderData.estimateDetails || {};
    const jobAddress = orderData.jobAddress || {};

    // Fallback to context values if props are not provided
    const [input, setInput] = useState(propInput || estimateDetails.jobDescription || '');
    const [generatedTime, setGeneratedTime] = useState(
        propGeneratedTime || estimateDetails.generatedTime || 1
    );
    const [editable, setEditable] = useState(propEditable ?? true);
    const paidOnStreet = propPaidOnStreet || jobAddress.paidOnStreet || false;
    const congestionCharge = propCongestionCharge || jobAddress.congestionCharge || false;
    const postcode = propPostcode || jobAddress.postcode || '';
    const postcodeTierCost = propPostcodeTierCost || estimateDetails.costBreakdown?.commutingCost || 0;

    const [totalCost, setTotalCost] = useState(0);
    const [tierDetails, setTierDetails] = useState({ multiplier: 1, name: 'Default' });
    const textareaRef = useRef(null); // Declare ref for textarea

    const updateContext = (updatedValues) => {
        setOrderData((prevData) => {
            const newEstimateDetails = {
                ...prevData.estimateDetails,
                ...updatedValues,
                costBreakdown: {
                    ...prevData.estimateDetails?.costBreakdown,
                    ...updatedValues?.costBreakdown,
                },
            };

            // Avoid unnecessary context updates
            if (JSON.stringify(prevData.estimateDetails) === JSON.stringify(newEstimateDetails)) {
                return prevData;
            }

            console.log('[EstimateDetails] Updating context with:', newEstimateDetails);
            return {
                ...prevData,
                estimateDetails: newEstimateDetails,
            };
        });
    };

    const handleTimeChange = (e) => {
        const newTime = Math.max(1, parseFloat(e.target.value));
        setGeneratedTime((prev) => (prev !== newTime ? newTime : prev));
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height dynamically
        }
    };

    useEffect(() => {
        adjustTextareaHeight(); // Adjust height when input changes
    }, [input]);

    useEffect(() => {
        const firstSlot = timeslotCosts[0]?.startSlot;
        const startTime = firstSlot?.startDate
            ? new Date(firstSlot.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '00:00';

        const details = getMultiplierForTimeSlot(startTime) || { multiplier: 1, name: 'Default' };

        if (JSON.stringify(tierDetails) !== JSON.stringify(details)) {
            setTierDetails(details);
        }

        const laborCost = generatedTime * HOURLY_RATE * details.multiplier;
        const parkingCost = paidOnStreet ? generatedTime * PAID_ON_STREET_EXTRA_COST_PER_HOUR : 0;
        const congestionChargeCost = congestionCharge ? CONGESTION_CHARGE_COST : 0;
        const commutingCost = postcodeTierCost || 0;

        const singleDayCost = laborCost + parkingCost + congestionChargeCost + commutingCost;

        if (totalCost !== singleDayCost) {
            setTotalCost(singleDayCost);
        }

        updateContext({
            generatedTime,
            costBreakdown: {
                laborCost,
                parkingCost,
                totalCongestionCharge: congestionChargeCost,
                commutingCost,
            },
        });
    }, [generatedTime, paidOnStreet, congestionCharge, postcodeTierCost, timeslotCosts]);

    return (
        <div className="estimate-details">
            <h2>Estimate Details</h2>
            <div>
                <label htmlFor="jobDescription">Job Description:</label>
                <textarea
                    id="jobDescription"
                    ref={textareaRef} // Attach the reference
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={!editable}
                    className={editable ? 'editable' : ''}
                    rows="1" // Minimum rows to start
                    style={{ resize: 'none', overflow: 'hidden' }} // Disable manual resizing
                />
            </div>

            <div>
                <label htmlFor="generatedTime">Generated Time (hours):</label>
                <input
                    type="number"
                    id="generatedTime"
                    value={generatedTime}
                    onChange={handleTimeChange}
                    disabled={!editable}
                    className={editable ? 'editable' : ''}
                    min="1"
                />
            </div>

            <p>
                <strong>Total Cost:</strong> £{totalCost.toFixed(2)}
            </p>

            <div className="cost-breakdown">
                <p className="cost-breakdown-title">Cost Breakdown:</p>
                <p>{generatedTime} x Labour Hour: £{(generatedTime * HOURLY_RATE).toFixed(2)}</p>
                <p>Multiplier: x{tierDetails?.multiplier || 1} (Tier: {tierDetails?.name || 'Default'})</p>
                {paidOnStreet && (
                    <p>{generatedTime} x Paid on Street Parking: £{(generatedTime * PAID_ON_STREET_EXTRA_COST_PER_HOUR).toFixed(2)}</p>
                )}
                {congestionCharge && (
                    <p>1 x Congestion Charge: £{CONGESTION_CHARGE_COST.toFixed(2)}</p>
                )}
                {postcodeTierCost > 0 && (
                    <p>Commuting to {postcode || 'N/A'}: £{postcodeTierCost.toFixed(2)}</p>
                )}
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={editable}
                        onChange={(e) => setEditable(e.target.checked)}
                    />
                    Would you like to adjust details?
                </label>
            </div>
        </div>
    );
};

export default EstimateDetails;
