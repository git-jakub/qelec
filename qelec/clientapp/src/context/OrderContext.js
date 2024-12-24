import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderData, setOrderData] = useState({
        timeSlot: {
            date: '',
            time: '',
        },

        jobDetails: {
            clientName: '',
            siteAccessInfo: '',
            mobile: '',
            clientEmail: '',
        },

        jobAddress: {
            postcode: '',          // Postcode of the job location
            street: '',            // Street name
            city: '',              // City
            paidOnStreet: false,   // Whether parking is paid on the street
            visitorPermit: false,  // Whether a visitor permit is available
            congestionCharge: false, // Whether the congestion charge applies
        },

        invoiceDetails: {
            recipientName: '',
            companyName: '',
            recipientAddress: '',
            recipientPostcode: '',
            recipientCity: '',
            recipientEmail: '',
            recipientPhone: '',
            paymentStatus: 'Unpaid', // Default payment status
        },

        estimateDetails: {
            jobDescription: '', // Default empty string
            calculatedCost: 0,  // Default to 0
            generatedTime: 1,   // Default to 1 hour
            costBreakdown: {
                commutingCost: 0,       // Default to 0
                multiplierDetails: null, // Grouped multiplier details under costBreakdown
                paidOnStreet: false,    // Whether parking is paid on the street
                visitorPermit: false,   // Whether a visitor permit is available
                congestionCharge: false
            },
        },
    });

    // Logging updates to orderData
    const handleSetOrderData = (newData) => {
        console.log('Updating Order Data:', newData);
        setOrderData(newData);
    };

    return (
        <OrderContext.Provider value={{ orderData, setOrderData: handleSetOrderData }}>
            {children}
        </OrderContext.Provider>
    );
};
