import axios from 'axios';

/**
 * Pobierz współrzędne dla kodu pocztowego.
 * @param {string} postcode - Kod pocztowy.
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getCoordinatesForPostcode = async (postcode) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Postcode/coordinates/${postcode}`);
        if (!response.data || !response.data.latitude || !response.data.longitude) {
            throw new Error(`Postcode not found: ${postcode}`);
        }
        return {
            latitude: response.data.latitude,
            longitude: response.data.longitude,
        };
    } catch (error) {
        console.error(`Error fetching coordinates for postcode "${postcode}":`, error.message);
        throw error;
    }
};

/**
 * Pobierz współrzędne dla wielu kodów pocztowych.
 * @param {string[]} postcodes - Lista kodów pocztowych.
 * @returns {Promise<Object[]>} - Lista obiektów z kodami pocztowymi i współrzędnymi.
 */
export const getCoordinatesForMultiplePostcodes = async (postcodes) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/Postcode/coordinates`, postcodes);
        if (!response.data || !Array.isArray(response.data)) {
            throw new Error('Invalid response from server.');
        }
        return response.data.map((item) => ({
            postcode: item.postcode,
            latitude: item.latitude,
            longitude: item.longitude,
        }));
    } catch (error) {
        console.error('Error fetching multiple postcodes:', error.message);
        throw error;
    }
};
