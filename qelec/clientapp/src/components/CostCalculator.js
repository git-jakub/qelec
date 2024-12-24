import { useEffect } from 'react';
import { categorizePostcodes } from './PostcodeCategorizer';

const HOURLY_RATE = 50;
const PAID_ON_STREET_EXTRA_COST_PER_HOUR = 5;
const CONGESTION_CHARGE_COST = 15;

// Time slot tiers with ranges and multipliers
const TIME_SLOT_TIERS = [
    { name: 'Tier 1', start: '07:00', end: '18:00', multiplier: 1 },
    { name: 'Tier 2', start: '18:00', end: '20:00', multiplier: 1.5 },
    { name: 'Tier 3', start: '03:00', end: '07:00', multiplier: 2 },
];

// Helper function to get the multiplier for a given time slot
export const getMultiplierForTimeSlot = (startTime) => {
    console.log(`[getMultiplierForTimeSlot] Received startTime: ${startTime}`);

    if (!startTime) {
        console.error(`[getMultiplierForTimeSlot] Invalid startTime: ${startTime}`);
        return { name: 'Default', multiplier: 1 };
    }

    const [hours, minutes] = startTime.split(':').map(Number);
    const start = new Date();
    start.setHours(hours, minutes, 0, 0);

    console.log(`[getMultiplierForTimeSlot] Parsed start time: ${start}`);

    for (const tier of TIME_SLOT_TIERS) {
        const [tierStartHours, tierStartMinutes] = tier.start.split(':').map(Number);
        const [tierEndHours, tierEndMinutes] = tier.end.split(':').map(Number);

        const tierStart = new Date();
        tierStart.setHours(tierStartHours, tierStartMinutes, 0, 0);

        const tierEnd = new Date();
        tierEnd.setHours(tierEndHours, tierEndMinutes, 0, 0);

        // Handle overnight tiers (e.g., 20:00 - 07:00)
        if (tierEnd.getTime() < tierStart.getTime()) {
            const endOfDay = new Date(tierStart);
            endOfDay.setHours(23, 59, 59, 999);

            const startOfDay = new Date(tierEnd);
            startOfDay.setDate(tierEnd.getDate() - 1);

            if ((start >= tierStart && start <= endOfDay) || (start >= startOfDay && start < tierEnd)) {
                console.log(`[getMultiplierForTimeSlot] Matched Tier: ${tier.name}, Multiplier: ${tier.multiplier}`);
                return tier;
            }
        } else {
            if (start >= tierStart && start < tierEnd) {
                console.log(`[getMultiplierForTimeSlot] Matched Tier: ${tier.name}, Multiplier: ${tier.multiplier}`);
                return tier;
            }
        }
    }

    console.log(`[getMultiplierForTimeSlot] No matching tier found. Returning default multiplier.`);
    return { name: 'Default', multiplier: 1 }; // Default multiplier
};


const CostCalculator = ({
    generatedTime,
    postcode,
    paidOnStreet,
    congestionCharge,
    selectedTimeSlot,
    setCalculatedCost,
    setPostcodeTierCost,
    setMultiplierDetails,
}) => {
    useEffect(() => {
        const calculateCost = async () => {
            console.log(`[CostCalculator] Starting cost calculation with inputs:`, {
                generatedTime,
                postcode,
                paidOnStreet,
                congestionCharge,
                selectedTimeSlot,
            });

            let postcodeTierCost = 0;

            // Fetch postcode tiers
            try {
                const postcodeTiers = await categorizePostcodes('SW16 1SS', [postcode]);
                console.log(`[CostCalculator] Fetched Postcode Tiers:`, postcodeTiers);

                // Match postcode tier
                if (postcodeTiers.Tier1?.includes(postcode)) {
                    postcodeTierCost = 15;
                } else if (postcodeTiers.Tier2?.includes(postcode)) {
                    postcodeTierCost = 25;
                } else if (postcodeTiers.Tier3?.includes(postcode)) {
                    postcodeTierCost = 50;
                } else if (postcodeTiers.Tier4?.includes(postcode)) {
                    postcodeTierCost = 100;
                } else if (postcodeTiers.Tier5?.includes(postcode)) {
                    postcodeTierCost = 200;
                }
            } catch (error) {
                console.error(`[CostCalculator] Error fetching postcode tiers:`, error.message);
            }

            // Parking cost
            let additionalCost = postcodeTierCost;
            if (paidOnStreet) {
                additionalCost += generatedTime * PAID_ON_STREET_EXTRA_COST_PER_HOUR;
            }

            // Congestion charge
            if (congestionCharge) {
                additionalCost += CONGESTION_CHARGE_COST;
            }

            // Time slot multiplier
            const startTime = selectedTimeSlot?.startSlot?.startDate.split('T')[1].slice(0, 5);
            console.log(`[CostCalculator] Calculating multiplier for startTime: ${startTime}`);
            const tierDetails = startTime ? getMultiplierForTimeSlot(startTime) : { multiplier: 1 };
            const timeMultiplier = tierDetails.multiplier;

            // Update multiplier details for cost breakdown
            setMultiplierDetails(tierDetails);
            console.log(`[CostCalculator] Multiplier details set:`, tierDetails);

            // Total cost calculation
            const baseCost = generatedTime * HOURLY_RATE + additionalCost;
            const totalCost = baseCost * timeMultiplier;

            console.log(`[CostCalculator] BaseCost: ${baseCost}, TotalCost: ${totalCost}`);

            // Update the calculated cost and postcodeTierCost
            setCalculatedCost(totalCost);
            setPostcodeTierCost(postcodeTierCost);
        };

        calculateCost();
    }, [
        generatedTime,
        postcode,
        paidOnStreet,
        congestionCharge,
        selectedTimeSlot,
        setCalculatedCost,
        setPostcodeTierCost,
        setMultiplierDetails,
    ]);

    return null;
};

export default CostCalculator;
