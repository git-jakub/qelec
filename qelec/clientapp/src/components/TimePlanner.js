import React, { useState, useEffect, useContext } from 'react';
import { DatePicker } from '@mantine/dates';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import './TimePlanner.css';

const TimePlanner = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [error, setError] = useState(null);

    const { setOrderData } = useContext(OrderContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedDate) {
            fetchAvailableTimeSlots(selectedDate);
        }
    }, [selectedDate]);

    const fetchAvailableTimeSlots = async (date) => {
        setLoadingSlots(true);
        setError(null);

        try {
            // Convert selected date to UTC and format as ISO (YYYY-MM-DD)
            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            const formattedDate = utcDate.toISOString().slice(0, 10);
            const response = await fetch(`https://localhost:7061/api/TimeSlots/timeslots?date=${formattedDate}`);


            if (!response.ok) {
                throw new Error(`Error loading slots: ${response.statusText}`);
            }

            const data = await response.json();
            setAvailableTimeSlots(data.availableSlots);
        } catch (error) {
            setError("Failed to load available timeslots. Please try again later.");
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedDate || !selectedTimeSlot) {
            alert("Please select both a date and a time slot.");
            return;
        }
        setOrderData((prevData) => ({ ...prevData, timeSlot: { date: selectedDate, time: selectedTimeSlot } }));
        navigate('/jobdetails');
    };

    const handleBack = () => {
        navigate('/');
    };

    const handleNext = () => {
        if (selectedTimeSlot) {
            setOrderData((prevData) => ({ ...prevData, timeSlot: { date: selectedDate, time: selectedTimeSlot } }));
            navigate('/jobdetails');
        } else {
            alert('Please select a time slot before proceeding.');
        }
    };

    return (
        <div className="time-planner-form">
            {/* Navbar */}
            <div className="navbar">
                <button className="back-button" onClick={handleBack}>Back</button>
                <h2>Time Planner</h2>
                <button className="next-button" onClick={handleNext}>Next</button>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="calendar-container">
                    <h2>Choose a convenient timeslot:</h2>
                    <DatePicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                        placeholder="Choose a suitable date"
                        required
                    />
                </div>

                <div className="time-slots-container">
                    {loadingSlots ? (
                        <p>Loading available timeslots...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <>
                            {availableTimeSlots.length > 0 ? (
                                availableTimeSlots.map((slot, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedTimeSlot(slot.time)}
                                        disabled={!slot.isAvailable}  // Use slot.isAvailable based on backend response
                                        className={`time-slot-button ${selectedTimeSlot === slot.time ? 'selected' : ''}`}
                                    >
                                        {slot.time} {slot.isAvailable ? '' : '(Unavailable)'}
                                    </button>
                                ))
                            ) : (
                                <p>No available timeslots for this date. Please select another date.</p>
                            )}
                            <button
                                onClick={handleSubmit}
                                className="submit-button"
                                disabled={!selectedTimeSlot}
                            >
                                Book a Timeslot
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimePlanner;
