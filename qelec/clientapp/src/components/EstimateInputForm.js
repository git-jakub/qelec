import React, { useState, useContext } from 'react';
import { generateEstimate } from '../services/estimateService';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext'; // Import kontekstu
import './EstimateInputForm.css';

const HOURLY_RATE = 50;

const EstimateInputForm = () => {
    const { setOrderData } = useContext(OrderContext); // Użycie kontekstu
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [error, setError] = useState(null);

    const handleGenerateEstimate = async () => {
        try {
            const result = await generateEstimate(input);
            const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;

            const timeInHours = Math.max(1, parseFloat(parsedResult.time.replace('h', '')));
            const calculatedCost = timeInHours * HOURLY_RATE;

            // Logowanie wygenerowanych danych
            console.log('Generated Estimate Data:', {
                jobDescription: input,
                generatedTime: timeInHours,
                calculatedCost,
            });

            // Zapisz dane w kontekście
            setOrderData((prevData) => {
                const updatedData = {
                    ...prevData,
                    estimateDetails: {
                        jobDescription: input,
                        generatedTime: timeInHours,
                        calculatedCost,
                    },
                };

                // Logowanie danych zapisywanych do kontekstu
                console.log('Data saved to context:', updatedData);
                return updatedData;
            });

            // Nawigacja do strony /estimates
            navigate('/estimates');
        } catch (err) {
            console.error('Error generating estimate:', err);
            setError('Failed to generate estimate. Please try again.');
        }
    };

    return (
        <div className="estimate-generator">
            <h2 className="estimate-title">Estimate Generator</h2>
            <textarea
                className="estimate-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter job details..."
            />
            {error && <p className="error-message">{error}</p>}
            <button className="generate-button" onClick={handleGenerateEstimate}>
                Generate Estimate
            </button>
        </div>
    );
};

export default EstimateInputForm;
