import axios from 'axios';

export async function generateEstimate(inputData) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/Estimates/generate`, inputData, {
            headers: {
                'Content-Type': 'application/json' // Ustawienie Content-Type na application/json
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error in providng the estimate:', error);
        throw error;
    }
}
