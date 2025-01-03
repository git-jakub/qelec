﻿import React, { useState, useEffect, useContext, useMemo } from 'react';
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
    const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
    const [availableDays, setAvailableDays] = useState([]);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [filteredTimeSlots, setFilteredTimeSlots] = useState([]);
    const [filteredSlotsByTime, setFilteredSlotsByTime] = useState([]); // Nowy stan dla filtrowanych slotów
    const [timeFilter, setTimeFilter] = useState('ALL'); // Domyślnie pokazuj wszystkie sloty
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

    const generateDays = (startIndex, totalDays = 14) => {
        const today = new Date();
        return Array.from({ length: totalDays }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() + startIndex + i);
            return {
                label: date.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: '2-digit' }),
                date,
            };
        });
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

            // Początkowo pokaż wszystkie sloty
            setFilteredSlotsByTime(allSlots[0]);
        } else {
            setFilteredTimeSlots([]);
            setFilteredSlotsByTime([]);
        }
    }, [availableTimeSlots, timeSlots]);

    // Filtruj przedziały czasowe na podstawie wybranego filtra
    useEffect(() => {
        if (filteredTimeSlots[0]?.length > 0) {
            const filtered = filteredTimeSlots[0].filter((slot) => {
                const startHour = new Date(slot.startSlot.startDate).getHours();

                if (timeFilter === 'AM') return startHour >= 6 && startHour < 12;
                if (timeFilter === 'PM') return startHour >= 12 && startHour < 18;
                if (timeFilter === 'OUT_OF_HOURS') return startHour >= 18 || startHour < 6;

                return true; // Jeśli brak filtra, pokaż wszystkie sloty
            });

            setFilteredSlotsByTime(filtered);
            setCurrentSlotIndex(0); // Resetuj slider po zmianie filtra
        }
    }, [timeFilter, filteredTimeSlots]);

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

                {/* Day Slider */}
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
                            className={`day-button ${currentDayIndex + index === currentDayIndex ? 'active' : ''}`}
                            onClick={() => setCurrentDayIndex(currentDayIndex + index)}
                        >
                            <span className="day-label">{day.label.split(',')[0]}</span> {/* Friday */}
                            <span className="date-label">{day.label.split(',')[1]}</span> {/* January 3rd */}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentDayIndex((prev) => prev + 1)}
                        disabled={currentDayIndex + 7 >= availableDays.length}
                    >
                        &gt;
                    </button>
                </div>


                {/* TimeSlot Filter */}
                <div className="time-slot-filter">
                    <button
                        onClick={() => setTimeFilter('ALL')}
                        className={`filter-button ${timeFilter === 'ALL' ? 'active' : ''}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setTimeFilter('AM')}
                        className={`filter-button ${timeFilter === 'AM' ? 'active' : ''}`}
                    >
                        AM
                    </button>
                    <button
                        onClick={() => setTimeFilter('PM')}
                        className={`filter-button ${timeFilter === 'PM' ? 'active' : ''}`}
                    >
                        PM
                    </button>
                    <button
                        onClick={() => setTimeFilter('OUT_OF_HOURS')}
                        className={`filter-button ${timeFilter === 'OUT_OF_HOURS' ? 'active' : ''}`}
                    >
                        Out of Hours
                    </button>
                </div>


                {/* TimeSlot Slider */}
                <div className="time-slot-slider">
                    <button
                        onClick={() => setCurrentSlotIndex((prev) => Math.max(prev - 1, 0))}
                        disabled={currentSlotIndex === 0}
                    >
                        &lt;
                    </button>
                    {filteredSlotsByTime.slice(currentSlotIndex, currentSlotIndex + 5).map((slot, index) => (
                        <button
                            key={index}
                            onClick={() => handleTimeSlotClick(slot, 0)}
                            className={`time-slot-button ${selectedTimeSlots[0] === slot ? 'selected' : ''}`}
                        >
                            {slot.time}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentSlotIndex((prev) => prev + 1)}
                        disabled={currentSlotIndex + 5 >= filteredSlotsByTime.length}
                    >
                        &gt;
                    </button>
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

