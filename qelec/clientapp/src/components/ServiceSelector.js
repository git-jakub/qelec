import React, { useEffect, useState } from 'react';

const ServiceSelector = ({
    serviceType,
    setServiceType,
    serviceDetails,
    setServiceDetails,
    propertySizeOrSpecification,
    setPropertySizeOrSpecification,
    onCostAndTimeChange // Callback do przesyłania kosztu i czasu do rodzica
}) => {
    const serviceOptions = [
        { value: 'installation', label: 'Installation Work' },
        { value: 'callout', label: '24/7 Call Outs' },
        { value: 'inspection', label: 'Inspection & Testing' }
    ];

    const serviceDetailsOptions = {
        installation: [
            { value: 'wiring', label: 'Wiring' },
            { value: 'lighting', label: 'Lighting Installation' },
            { value: 'panel', label: 'Panel Upgrade' }
        ],
        callout: [
            { value: 'emergency', label: 'Emergency Repair' },
            { value: 'diagnostics', label: 'Diagnostics' },
            { value: 'maintenance', label: 'Scheduled Maintenance' }
        ],
        inspection: [
            { value: 'eicr', label: 'EICR Certificate' },
            { value: 'safety', label: 'Safety Inspection' },
            { value: 'testing', label: 'Electrical Testing' }
        ]
    };

    const propertySizeOrSpecificationOptions = {
        eicr: [
            { value: 'studio', label: 'Studio', cost: 100, time: '2h' },
            { value: '1_bedroom', label: '1 Bedroom', cost: 110, time: '2h' },
            { value: '2_bedroom', label: '2 Bedroom', cost: 120, time: '3h' },
            { value: '3_bedroom', label: '3 Bedroom', cost: 130, time: '3h' },
            { value: '4_bedroom', label: '4 Bedroom', cost: 140, time: '4h' }
        ],
        wiring: [
            { value: '1_outlet', label: '1 Outlet', cost: 75, time: '2h' },
            { value: '2_outlets', label: '2 Outlets', cost: 75, time: '2h' },
            { value: '3_outlets', label: '3 Outlets', cost: 75, time: '2h' }
        ]
    };

    const [calculatedCost, setCalculatedCost] = useState(null);
    const [calculatedTime, setCalculatedTime] = useState(null);

    const handleServiceTypeChange = (e) => {
        const value = e.target.value;
        setServiceType(value);
        setServiceDetails('');
        setPropertySizeOrSpecification('');
        setCalculatedCost(null);
        setCalculatedTime(null);
    };

    const handleServiceDetailsChange = (e) => {
        const value = e.target.value;
        setServiceDetails(value);
        setPropertySizeOrSpecification('');
        setCalculatedCost(null);
        setCalculatedTime(null);
    };

    const handlePropertySizeChange = (e) => {
        const value = e.target.value;
        setPropertySizeOrSpecification(value);

        const selectedOption = propertySizeOrSpecificationOptions[serviceDetails]?.find(
            (spec) => spec.value === value
        );

        if (selectedOption) {
            setCalculatedCost(selectedOption.cost);
            setCalculatedTime(selectedOption.time);
        } else {
            setCalculatedCost(null);
            setCalculatedTime(null);
        }
    };

    useEffect(() => {
        if (onCostAndTimeChange) {
            onCostAndTimeChange(calculatedCost, calculatedTime);
        }
    }, [calculatedCost, calculatedTime, onCostAndTimeChange]);

    return (
        <div>
            <label htmlFor="serviceType">Select Service Type:</label>
            <select
                id="serviceType"
                value={serviceType}
                onChange={handleServiceTypeChange}
                required
            >
                <option value="" disabled>
                    Select a service type
                </option>
                {serviceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {serviceType && (
                <>
                    <label htmlFor="serviceDetails">Specify Service Details:</label>
                    <select
                        id="serviceDetails"
                        value={serviceDetails}
                        onChange={handleServiceDetailsChange}
                        required
                    >
                        <option value="" disabled>
                            Select service details
                        </option>
                        {serviceDetailsOptions[serviceType]?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </>
            )}

            {serviceDetails && propertySizeOrSpecificationOptions[serviceDetails] && (
                <>
                    <label htmlFor="propertySize">Specify Property Size/Specification:</label>
                    <select
                        id="propertySize"
                        value={propertySizeOrSpecification}
                        onChange={handlePropertySizeChange}
                        required
                    >
                        <option value="" disabled>
                            Select size/specification
                        </option>
                        {propertySizeOrSpecificationOptions[serviceDetails]?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </>
            )}

            {calculatedCost && calculatedTime && (
                <div className="calculated-output">
                    <p>
                        <strong>Cost:</strong> £{calculatedCost}
                    </p>
                    <p>
                        <strong>Time:</strong> {calculatedTime}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ServiceSelector;
