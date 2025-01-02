import React, { useState, useEffect, useContext } from 'react';
import { DatePicker } from '@mantine/dates';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import Navbar from './Navbar';
import EstimateDetails from './EstimateDetails';
import './SharedStyles.css';
import './TimePlanner.css';

const findAvailableContinuousSlots = (slots, requiredHours) => {
    console.log(`[findAvailableContinuousSlots] Looking for slots that fit ${requiredHours} hours.`);
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

const markTimeSlotUnavailable = async (startDate, endDate) => {
    try {
        console.log('Marking time slot as unavailable:', { startDate, endDate });

        const response = await fetch(`${process.env.REACT_APP_API_URL}/TimeSlots/mark-unavailable`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            }),
        });

        if (response.ok) {
            console.log('Time slots marked as unavailable successfully.');
        } else {
            console.error('Failed to mark time slots as unavailable.');
        }
    } catch (error) {
        console.error('Error marking time slots as unavailable:', error);
    }
};

const TimePlanner = () => {
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [amTimeSlots, setAmTimeSlots] = useState([]);
    const [pmTimeSlots, setPmTimeSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [error, setError] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const { setOrderData, orderData } = useContext(OrderContext);
    const navigate = useNavigate();

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
            console.log(`Available time slots for ${formattedDate}:`, data.availableSlots);
        } catch (error) {
            setError('Failed to load available time slots. Please try again later.');
        } finally {
            setLoadingSlots(false);
        }
    };

    const filterTimeSlots = (slots) => {
        const amSlots = slots.filter(slot => new Date(slot.startDate).getHours() < 12);
        const pmSlots = slots.filter(slot => new Date(slot.startDate).getHours() >= 12);

        const estimatedTimeInHours = orderData?.estimateDetails?.generatedTime || 1;

        setAmTimeSlots(findAvailableContinuousSlots(amSlots, estimatedTimeInHours));
        setPmTimeSlots(findAvailableContinuousSlots(pmSlots, estimatedTimeInHours));
    };

    const handleSlotClick = (slot) => {
        console.log('[TimePlanner] Clicked time slot:', slot);

        // ISO format for start time
        const startTimeISO = slot.startSlot.startDate;
        console.log('[TimePlanner] Passing startTimeISO to OrderContext:', startTimeISO);

        // Prepare timeslotCosts for EstimateDetails
        const timeslotData = [
            {
                startSlot: slot.startSlot,
                endSlot: slot.endSlot,
            },
        ];
        console.log('[TimePlanner] Generated timeslotCosts:', timeslotData);

        setSelectedSlot(slot); // Update selected slot

        // Update OrderContext
        setOrderData((prevData) => {
            const updatedData = {
                ...prevData,
                timeSlot: [
                    {
                        date: selectedDay.toISOString().split('T')[0],
                        time: slot.time,
                        startSlot: slot.startSlot,
                        endSlot: slot.endSlot,
                    },
                ],
                timeslotCosts: timeslotData, // Include timeslotCosts for EstimateDetails
                estimateDetails: {
                    ...prevData.estimateDetails,
                    multiplierStartTime: startTimeISO, // Pass ISO formatted start time
                },
            };

            console.log('[TimePlanner] Updated OrderContext data:', updatedData);
            return updatedData;
        });
    };





    const handleNext = () => {
        if (!selectedSlot) {
            alert('Please select a time slot.');
            return;
        }
        navigate('/jobdetails');
    };

    useEffect(() => {
        if (selectedDay) {
            fetchAvailableTimeSlots(selectedDay);
        }
    }, [selectedDay]);

    useEffect(() => {
        if (availableTimeSlots.length > 0) {
            filterTimeSlots(availableTimeSlots);
        }
    }, [availableTimeSlots, orderData?.estimateDetails?.generatedTime]);

    return (
        <div className="time-planner-form">
            <Navbar backPath="/jobdetails" nextPath="/invoice" />
            <div className="main-content">
                <h2>Select time slots for your work:</h2>

                <div className="slider-section">
                    <h3>Select Day:</h3>
                    <DatePicker value={selectedDay} onChange={setSelectedDay} placeholder="Choose a date" />
                </div>

                <div className="slider-section">
                    <h3>AM Time Slots:</h3>
                    {loadingSlots ? (
                        <p>Loading AM slots...</p>
                    ) : amTimeSlots.length > 0 ? (
                        amTimeSlots.map((slot, index) => (
                            <button
                                key={index}
                                onClick={() => handleSlotClick(slot)}
                                className={`time-slot-button ${selectedSlot === slot ? 'selected' : ''}`}
                            >
                                {slot.time}
                            </button>
                        ))
                    ) : (
                        <p>No AM time slots available.</p>
                    )}
                </div>

                <div className="slider-section">
                    <h3>PM Time Slots:</h3>
                    {loadingSlots ? (
                        <p>Loading PM slots...</p>
                    ) : pmTimeSlots.length > 0 ? (
                        pmTimeSlots.map((slot, index) => (
                            <button
                                key={index}
                                onClick={() => handleSlotClick(slot)}
                                className={`time-slot-button ${selectedSlot === slot ? 'selected' : ''}`}
                            >
                                {slot.time}
                            </button>
                        ))
                    ) : (
                        <p>No PM time slots available.</p>
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
                />

                <button
                    onClick={handleNext}
                    className="submit-button"
                    disabled={!selectedSlot}
                >
                    Book Time Slot
                </button>
            </div>
        </div>
    );
};

export default TimePlanner;
