import { categorizePostcodes } from '../components/PostcodeCategorizer'; // Adjust the path as needed

const testCategorizePostcodes = async () => {
    console.log("Testing categorizePostcodes...");

    const targetPostcodes = ['SW1A 1AA', 'NW10 2AJ', 'SW16 1SS'];
    const basePostcode = 'SW16 1SS';

    try {
        const tiers = await categorizePostcodes(basePostcode, targetPostcodes);
        console.log("Categorized Postcodes Tiers:", tiers);
    } catch (error) {
        console.error("Error during test:", error.message);
    }
};

// Run the test
testCategorizePostcodes();
