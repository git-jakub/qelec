import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderData, setOrderData] = useState({
        timeSlot: { date: '', time: '' }, // Initialize as an object with date and time properties

        jobDetails: {
            postcode: '',
            city: '',
            address: '',
            clientName: '',
            siteAccessInfo: '',
            mobile: '',
            clientEmail: '',
            serviceType: '',
            serviceDetails: '',
            propertySizeOrSpecification: '',
        },

        invoiceDetails: {
            recipientName: '',
            companyName: '',
            recipientAddress: '',
            recipientPostcode: '',
            recipientCity: '',
            recipientEmail: '',
            recipientPhone: '',
            paymentStatus: 'Unpaid', // Set default payment status
        }
    });

    return (
        <OrderContext.Provider value={{ orderData, setOrderData }}>
            {children}
        </OrderContext.Provider>
    );
};
