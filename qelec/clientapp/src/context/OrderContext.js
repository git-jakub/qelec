import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderData, setOrderData] = useState({
        timeSlot: { date: '', time: '' }, // Initialize as an object with date and time properties
        jobDetails: {},
        invoiceDetails: {}
    });

    return (
        <OrderContext.Provider value={{ orderData, setOrderData }}>
            {children}
        </OrderContext.Provider>
    );
};
