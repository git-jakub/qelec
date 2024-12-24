import React, { useEffect, useState } from 'react';
import { getMultiplierForTimeSlot } from './CostCalculator';
import './EstimateDetails.css';

const HOURLY_RATE = 50;
const PAID_ON_STREET_EXTRA_COST_PER_HOUR = 5;
const CONGESTION_CHARGE_COST = 15;

const EstimateDetails = ({
    input,
    setInput,
    generatedTime,
    setGeneratedTime,
    editable,
    setEditable,
    paidOnStreet,
    congestionCharge,
    postcode,
    postcodeTierCost,
    timeslotCosts = [],
}) => {
    const [totalCost, setTotalCost] = useState(0);
    const [tierDetails, setTierDetails] = useState({ multiplier: 1, name: 'Default' }); // Initialize with default values

    const handleTimeChange = (e) => {
        const newTime = Math.max(1, parseFloat(e.target.value));
        setGeneratedTime(newTime);
    };

    useEffect(() => {
        const firstSlot = timeslotCosts[0]?.startSlot;
        const startTime = firstSlot?.startDate
            ? new Date(firstSlot.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '00:00';

        const details = getMultiplierForTimeSlot(startTime) || { multiplier: 1, name: 'Default' };

        setTierDetails((prev) =>
            JSON.stringify(prev) === JSON.stringify(details) ? prev : details
        );

        const laborCost = generatedTime * HOURLY_RATE * details.multiplier;
        const parkingCost = paidOnStreet ? generatedTime * PAID_ON_STREET_EXTRA_COST_PER_HOUR : 0;
        const congestionChargeCost = congestionCharge ? CONGESTION_CHARGE_COST : 0;
        const commutingCost = postcodeTierCost || 0;

        const singleDayCost = laborCost + parkingCost + congestionChargeCost + commutingCost;

        setTotalCost((prev) => (prev === singleDayCost ? prev : singleDayCost));
    }, [generatedTime, paidOnStreet, congestionCharge, postcodeTierCost, timeslotCosts]);

    return (
        <div className="estimate-details">
            <h2>Estimate Details</h2>
            <div>
                <label htmlFor="jobDescription">Job Description:</label>
                <input
                    type="text"
                    id="jobDescription"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={!editable}
                    className={editable ? 'editable' : ''}
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
