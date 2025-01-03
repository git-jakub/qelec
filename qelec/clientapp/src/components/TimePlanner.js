import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import Navbar from './Navbar';
import EstimateDetails from './EstimateDetails';
import './SharedStyles.css';
import './TimePlanner.css';

// Function to find continuous slots
const findAvailableContinuousSlots = (slots, requiredHours) => {
    const continuousSlots = [];
    const now = new Date();
    now.setHours(now.getHours() + 8);

    for (let i = 0; i <= slots.length - requiredHours; i++) {
        const potentialSlotStart = new Date(slots[i].startDate);

        if (potentialSlotStart < now) {
            continue;
        }

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
                isAvailable: true,
            });
        }
    }

    return continuousSlots;
};

// Function to split work into manageable time slots
const splitExtendedWork = (totalHours) => {
    const slots = [];
    while (totalHours > 0) {
        const slotHours = Math.min(totalHours, 12);
        slots.push(slotHours);
        totalHours -= slotHours;
    }
    return slots;
};

const TimePlanner = () => {
    const [currentDayIndex, setCurrentDayIndex] = useState(0);
    const [availableDays, setAvailableDays] = useState([]);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [filteredTimeSlots, setFilteredTimeSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [error, setError] = useState(null);

    const { setOrderData, orderData } = useContext(OrderContext);
    const navigate = useNavigate();

    const estimatedTimeInHours = orderData?.estimateDetails?.generatedTime || 1;
    const isMultiDay = estimatedTimeInHours > 12;

    const timeSlots = useMemo(
        () => (isMultiDay ? splitExtendedWork(estimatedTimeInHours) : [estimatedTimeInHours]),
        [isMultiDay, estimatedTimeInHours]
    );

    // Function to generate days dynamically
    const generateDays = (startIndex, totalDays = 14) => {
        const today = new Date();
        const days = [];
        for (let i = startIndex; i < startIndex + totalDays; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push({
                label: date.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: '2-digit' }),
                date: date,
            });
        }
        return days;
    };

    useEffect(() => {
        setAvailableDays((prevDays) => [
            ...prevDays,
            ...generateDays(prevDays.length, 14),
        ]);
    }, [currentDayIndex]);

    const fetchAvailableTimeSlots = async (date) => {
        setLoadingSlots(true);
        setError(null);

        try {
            const formattedDate = date.toISOString().split('T')[0];
            const response = await fetch(`${process.env.REACT_APP_API_URL}/TimeSlots/timeslots?date=${formattedDate}`);

            if (!response.ok) {
                throw new Error(`Error loading slots: ${response.statusText}`);
            }

            const data = await response.json();
            setAvailableTimeSlots(data.availableSlots);
        } catch (error) {
            setError('Failed to load available time slots. Please try again later.');
        } finally {
            setLoadingSlots(false);
        }
    };

    useEffect(() => {
        if (availableDays[currentDayIndex]) {
            fetchAvailableTimeSlots(availableDays[currentDayIndex].date);
        }
    }, [currentDayIndex, availableDays]);

    useEffect(() => {
        if (availableTimeSlots.length > 0) {
            const allSlots = timeSlots.map((hours) =>
                findAvailableContinuousSlots(availableTimeSlots, hours)
            );
            setFilteredTimeSlots(allSlots);
        } else {
            setFilteredTimeSlots([]);
        }
    }, [availableTimeSlots, timeSlots]);

    const handleTimeSlotClick = (slot, index) => {
        const updatedSelectedTimeSlots = [...selectedTimeSlots];
        updatedSelectedTimeSlots[index] = slot;
        setSelectedTimeSlots(updatedSelectedTimeSlots);

        setOrderData((prevData) => ({
            ...prevData,
            timeSlot: updatedSelectedTimeSlots
                .filter((ts) => ts)
                .map((ts) => ({
                    date: availableDays[currentDayIndex].date.toISOString().split('T')[0],
                    time: ts.time,
                    startSlot: ts.startSlot,
                    endSlot: ts.endSlot,
                })),
        }));
    };

    const handleNext = () => {
        if (selectedTimeSlots.length === timeSlots.length) {
            navigate('/jobdetails');
        } else {
            alert('Please select all required time slots before proceeding.');
        }
    };

    return (
        <div className="time-planner-form">
            <Navbar />
            <div className="main-content">
                <h2>Select time slots for your work:</h2>
                <div className="day-slider">
                    <button
                        onClick={() => setCurrentDayIndex((prev) => Math.max(prev - 1, 0))}
                        disabled={currentDayIndex === 0}
                    >
                        &lt;
                    </button>
                    {availableDays.slice(currentDayIndex, currentDayIndex + 7).map((day, index) => (
                        <button
                            key={index}
                            className={`day-button ${index === 0 ? 'selected' : ''}`}
                            onClick={() => setCurrentDayIndex(currentDayIndex + index)}
                        >
                            {day.label}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentDayIndex((prev) => prev + 1)}
                        disabled={currentDayIndex + 7 >= availableDays.length}
                    >
                        &gt;
                    </button>
                </div>
                <div className="time-slots-container">
                    {loadingSlots ? (
                        <p>Loading available timeslots...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        timeSlots.map((hours, index) => (
                            <div key={index}>
                                <h4>Select slot for {hours} hours:</h4>
                                {filteredTimeSlots[index]?.map((slot, slotIndex) => (
                                    <button
                                        key={slotIndex}
                                        onClick={() => handleTimeSlotClick(slot, index)}
                                        className={`time-slot-button ${selectedTimeSlots[index] === slot ? 'selected' : ''}`}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        ))
                    )}
                </div>
                <EstimateDetails
                    input={orderData?.estimateDetails?.jobDescription || ''}
                    setInput={(value) =>
                        setOrderData((prev) => ({
                            ...prev,
                            estimateDetails: { ...prev.estimateDetails, jobDescription: value },
                        }))
                    }
                    generatedTime={orderData?.estimateDetails?.generatedTime || 1}
                    setGeneratedTime={(time) =>
                        setOrderData((prev) => ({
                            ...prev,
                            estimateDetails: { ...prev.estimateDetails, generatedTime: time },
                        }))
                    }
                    calculatedCost={orderData?.estimateDetails?.calculatedCost || 0}
                    editable={true}
                    setEditable={() => { }}
                    paidOnStreet={orderData?.jobAddress?.paidOnStreet || false}
                    congestionCharge={orderData?.jobAddress?.congestionCharge || false}
                    postcode={orderData?.jobAddress?.postcode || ''}
                    postcodeTierCost={orderData?.estimateDetails?.costBreakdown?.commutingCost || 0}
                    multiplierDetails={orderData?.estimateDetails?.multiplierDetails || null}
                    timeslotCosts={selectedTimeSlots.map((slot) => ({
                        startSlot: slot?.startSlot || {},
                        endSlot: slot?.endSlot || {},
                        time: slot?.time || '',
                    }))}
                />
                <button
                    onClick={handleNext}
                    className="submit-button"
                    disabled={selectedTimeSlots.length !== timeSlots.length}
                >
                    Book Time Slots
                </button>
            </div>
        </div>
    );
};

export default TimePlanner;