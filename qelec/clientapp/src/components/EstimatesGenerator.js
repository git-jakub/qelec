import React, { useState } from 'react';
import { generateEstimate } from '../services/estimateService';
import Navbar from './Navbar';
import './SharedStyles.css';
import './EstimateGenerator.css';

function EstimateGenerator() {
    const [input, setInput] = useState('');
    const [estimate, setEstimate] = useState('');

    const handleGenerateEstimate = async () => {
        try {
            const result = await generateEstimate(input);
            setEstimate(result);
        } catch (error) {
            alert('Error generating estimate.');
        }
    };

    return (
        <div className="estimate-generator-page">
            <Navbar backPath="/" nextPath="/jobdetails" />

            <div className="estimate-generator">
                <h1 className="estimate-title">Estimate Generator</h1>
                <p className="estimate-instruction">Let us know how we can help:</p>

                <textarea
                    className="estimate-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter data for estimate..."
                />

                <button className="generate-button" onClick={handleGenerateEstimate}>
                    Generate Estimate
                </button>

                {estimate && (
                    <div className="estimate-output">
                        <h2>Estimate:</h2>
                        <p>{estimate}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EstimateGenerator;
