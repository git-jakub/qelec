import React, { useState } from 'react';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import Navbar from '../../components/Navbar';
import './TimeSetter.css';

const TimeSetter = () => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleCreateTimeSlotsForRange = async () => {
        // Validate that the required fields are filled
        if (!dateRange[0] || !dateRange[1] || !startTime || !endTime) {
            alert("Please specify a valid date range and time range.");
            return;
        }

        // Format dates and times for the API payload
        const formattedStartDate = new Date(
            `${dateRange[0].toISOString().split('T')[0]}T${startTime}:00.000Z`
        ).toISOString();

        const formattedEndDate = new Date(
            `${dateRange[1].toISOString().split('T')[0]}T${endTime}:00.000Z`
        ).toISOString();

        // Retrieve JWT token from local storage
        const token = localStorage.getItem("jwtToken"); // Assumes token is stored here after login
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/TimeSlots/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    isAvailable: true
                })
            });

            // Check the response status
            if (response.ok) {
                setSuccessMessage("Time slots created successfully.");
                setError('');
            } else {
                const errorText = await response.text(); // Get error message from response
                console.error("Server error:", errorText);
                setError("Failed to create time slots: " + errorText);
                setSuccessMessage('');
            }
        } catch (error) {
            console.error("Fetch error:", error); // Log the full error for debugging
            setError("An error occurred while creating time slots.");
            setSuccessMessage('');
        }
    };

    return (
        <div className="time-setter-container">
            <Navbar backPath="/" nextPath="/jobdetails" />
            <h2>Time Setter Page</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            {/* Date Range Picker */}
            <DatePickerInput
                type="range"
                value={dateRange}
                onChange={setDateRange}
                placeholder="Select date range"
                clearable
            />

            <div className="time-inputs">
                {/* Start Time Input */}
                <TimeInput
                    value={startTime}
                    onChange={(event) => setStartTime(event.currentTarget.value)}
                    placeholder="Start Time (HH:00)"
                    format="HH:mm" // Ensures time input in hour intervals
                />
                {/* End Time Input */}
                <TimeInput
                    value={endTime}
                    onChange={(event) => setEndTime(event.currentTarget.value)}
                    placeholder="End Time (HH:00)"
                    format="HH:mm" // Ensures time input in hour intervals
                />
            </div>

            {/* Create Time Slots Button */}
            <button onClick={handleCreateTimeSlotsForRange}>Add Time Slots for Range</button>
        </div>
    );
};

export default TimeSetter;
