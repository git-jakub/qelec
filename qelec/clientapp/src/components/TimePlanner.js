import React, { useState, useEffect, useContext, useMemo } from 'react';
import { DatePicker } from '@mantine/dates';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import Navbar from './Navbar';
import EstimateDetails from './EstimateDetails';
import './SharedStyles.css';
import './TimePlanner.css';

// Function to find continuous slots
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

// Function to mark time slots as unavailable
const markTimeSlotsUnavailable = async (startDate, endDate) => {
    try {
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
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [filteredTimeSlots, setFilteredTimeSlots] = useState([]);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
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
        if (selectedDate) {
            fetchAvailableTimeSlots(selectedDate);
        }
    }, [selectedDate]);

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

        if (!selectedDate) {
            return;
        }

        setOrderData((prevData) => ({
            ...prevData,
            timeSlot: updatedSelectedTimeSlots
                .filter((ts) => ts)
                .map((ts) => ({
                    date: selectedDate.toISOString().split('T')[0],
                    time: ts.time,
                    startSlot: ts.startSlot,
                    endSlot: ts.endSlot,
                })),
        }));
    };

    const handleNext = async () => {
        if (selectedTimeSlots.length === timeSlots.length) {
            const firstSlot = selectedTimeSlots[0].startSlot.startDate;
            const lastSlot = selectedTimeSlots[selectedTimeSlots.length - 1].endSlot.endDate;

            await markTimeSlotsUnavailable(new Date(firstSlot), new Date(lastSlot));

            navigate('/jobdetails');
        } else {
            alert('Please select all required time slots before proceeding.');
        }
    };

    return (
        <div className="time-planner-form">
            <Navbar backPath="/jobdetails" nextPath="/invoice" />
            <div className="main-content">
                <h2>Select time slots for your work:</h2>
                <DatePicker value={selectedDate} onChange={setSelectedDate} placeholder="Choose a suitable date" />
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
                                        className={`time-slot-button ${selectedTimeSlots[index] === slot ? 'selected' : ''
                                            }`}
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
