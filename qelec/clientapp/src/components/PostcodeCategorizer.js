import { getCoordinatesForPostcode, getCoordinatesForMultiplePostcodes } from './postcodeService';
import { haversineDistance } from './DistanceCalculator';

export const categorizePostcodes = async (basePostcode, targetPostcodes) => {
    try {
        console.group("Categorization Process");
        console.log("Base Postcode:", basePostcode);
        console.log("Target Postcodes:", targetPostcodes);

        // Fetch base coordinates
        const baseCoords = await getCoordinatesForPostcode(basePostcode);
        console.log("Base Coordinates:", baseCoords);

        // Validate base coordinates
        if (!isValidCoordinates(baseCoords)) {
            console.error("Invalid base coordinates. Categorization aborted.");
            console.groupEnd();
            return createEmptyTiers();
        }

        // Normalize base coordinates format
        const normalizedBaseCoords = {
            lat: baseCoords.latitude,
            lon: baseCoords.longitude,
        };

        // Fetch target coordinates
        const targetCoordinates = await getCoordinatesForMultiplePostcodes(targetPostcodes);
        console.log("Target Coordinates:", targetCoordinates);

        // Validate target coordinates
        if (!targetCoordinates || targetCoordinates.length === 0) {
            console.error("No valid target coordinates found. Categorization aborted.");
            console.groupEnd();
            return createEmptyTiers();
        }

        // Initialize tiers
        const tiers = createEmptyTiers();

        // Categorize each postcode
        targetCoordinates.forEach(({ postcode, latitude, longitude }) => {
            if (!isValidCoordinates({ latitude, longitude })) {
                console.warn(`Invalid target coordinates for postcode: ${postcode}`, { latitude, longitude });
                return;
            }

            // Normalize target coordinates format
            const normalizedTargetCoords = {
                lat: latitude,
                lon: longitude,
            };

            const distance = haversineDistance(normalizedBaseCoords, normalizedTargetCoords);
            console.log(`Distance for ${postcode}: ${distance.toFixed(2)} miles`);

            // Assign postcodes to tiers
            assignToTier(tiers, postcode, distance);
        });

        console.log("Final Categorized Tiers:", tiers);
        console.groupEnd();
        return tiers;

    } catch (error) {
        console.error("Error during categorization process:", error.message);
        console.groupEnd();
        return createEmptyTiers();
    }
};

// Helper function to create empty tiers
const createEmptyTiers = () => ({
    Tier1: [],
    Tier2: [],
    Tier3: [],
    Tier4: [],
    Tier5: [],
});

// Helper function to validate coordinates
const isValidCoordinates = (coords) =>
    coords && typeof coords.latitude === 'number' && typeof coords.longitude === 'number';

// Helper function to assign a postcode to a tier
const assignToTier = (tiers, postcode, distance) => {
    if (distance <= 3) {
        tiers.Tier1.push(postcode);
        console.log(`${postcode} categorized as Tier 1`);
    } else if (distance <= 5) {
        tiers.Tier2.push(postcode);
        console.log(`${postcode} categorized as Tier 2`);
    } else if (distance <= 10) {
        tiers.Tier3.push(postcode);
        console.log(`${postcode} categorized as Tier 3`);
    } else if (distance <= 20) {
        tiers.Tier4.push(postcode);
        console.log(`${postcode} categorized as Tier 4`);
    } else if (distance <= 50) {
        tiers.Tier5.push(postcode);
        console.log(`${postcode} categorized as Tier 5`);
    } else {
        console.log(`Postcode ${postcode} is outside all tiers`);
    }
};
