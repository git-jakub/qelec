import React, { useState, useEffect, useContext } from 'react';
import { DatePicker } from '@mantine/dates';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import Navbar from './Navbar'; // Import the shared Navbar component
import './SharedStyles.css';
import './TimePlanner.css';

const TimePlanner = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [filteredTimeSlots, setFilteredTimeSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [error, setError] = useState(null);

    const { setOrderData, orderData } = useContext(OrderContext);
    const navigate = useNavigate();

    const estimatedTimeInHours = orderData.estimatedTime ? parseInt(orderData.estimatedTime) : 1;

    useEffect(() => {
        if (selectedDate) {
            fetchAvailableTimeSlots(selectedDate);
        }
    }, [selectedDate]);

    useEffect(() => {
        const slotsWithEnoughTime = findAvailableContinuousSlots(availableTimeSlots, estimatedTimeInHours);
        setFilteredTimeSlots(slotsWithEnoughTime);
    }, [availableTimeSlots, estimatedTimeInHours]);

    const fetchAvailableTimeSlots = async (date) => {
        setLoadingSlots(true);
        setError(null);

        try {
            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            const formattedDate = utcDate.toISOString().slice(0, 10);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/TimeSlots/timeslots?date=${formattedDate}`);

            if (!response.ok) {
                throw new Error(`Error loading slots: ${response.statusText}`);
            }

            const data = await response.json();
            setAvailableTimeSlots(data.availableSlots);
        } catch (error) {
            console.error("Error fetching time slots:", error);
            setError("Failed to load available timeslots. Please try again later.");
        } finally {
            setLoadingSlots(false);
        }
    };

    const findAvailableContinuousSlots = (slots, requiredHours) => {
        const continuousSlots = [];

        for (let i = 0; i <= slots.length - requiredHours; i++) {
            const potentialSlotStart = new Date(slots[i].startDate);
            const potentialSlotEnd = new Date(potentialSlotStart);
            potentialSlotEnd.setHours(potentialSlotEnd.getHours() + requiredHours);

            let isContinuous = true;
            for (let j = 0; j < requiredHours; j++) {
                const currentSlotStart = new Date(slots[i + j].startDate);
                const expectedSlotStart = new Date(potentialSlotStart);
                expectedSlotStart.setHours(expectedSlotStart.getHours() + j);

                if (currentSlotStart.getTime() !== expectedSlotStart.getTime()) {
                    isContinuous = false;
                    break;
                }
            }

            if (isContinuous) {
                continuousSlots.push({
                    time: `${potentialSlotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${potentialSlotEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                    startSlot: slots[i],
                    endSlot: slots[i + requiredHours - 1],
                    isAvailable: true
                });
            }
        }

        return continuousSlots;
    };

    const markTimeSlotsUnavailable = async (startDate, endDate) => {
        try {
            const start = startDate instanceof Date ? startDate : new Date(startDate);
            const end = endDate instanceof Date ? endDate : new Date(endDate);

            const response = await fetch(`${process.env.REACT_APP_API_URL}/TimeSlots/mark-unavailable`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    startDate: start.toISOString(),
                    endDate: end.toISOString()
                })
            });

            if (response.ok) {
                console.log("Time slots marked as unavailable successfully.");
            } else {
                console.error("Failed to mark time slots as unavailable.");
            }
        } catch (error) {
            console.error("Error marking time slots as unavailable:", error);
        }
    };

    const handleNext = async () => {
        if (selectedTimeSlot) {
            setOrderData((prevData) => ({
                ...prevData,
                timeSlot: {
                    date: selectedDate,
                    time: selectedTimeSlot.time,
                    startSlot: selectedTimeSlot.startSlot,
                    endSlot: selectedTimeSlot.endSlot
                }
            }));

            await markTimeSlotsUnavailable(selectedTimeSlot.startSlot.startDate, selectedTimeSlot.endSlot.endDate);
            navigate('/invoice');
        } else {
            alert('Please select a time slot before proceeding.');
        }
    };

    return (
        <div className="time-planner-form">
            <Navbar backPath="/jobdetails" nextPath="/invoice" /> 
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
                            {filteredTimeSlots.length > 0 ? (
                                filteredTimeSlots.map((slot, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedTimeSlot(slot)}
                                        className={`time-slot-button ${selectedTimeSlot === slot ? 'selected' : ''}`}
                                    >
                                        {slot.time}
                                    </button>
                                ))
                            ) : (
                                <p>No available timeslots with enough duration. Please select another date.</p>
                            )}
                            <button
                                onClick={handleNext}
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
