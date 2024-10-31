import React, { useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext'; // Import OrderProvider for shared state
import InvoiceRecipient from './components/InvoiceRecipient';
import WelcomePage from './components/WelcomePage';
import JobDetails from './components/JobDetails';
import TimePlanner from './components/TimePlanner';
import OrderSummary from './components/OrderSummary'; // Import OrderSummary
import './App.css';

function App() {
    const [showForm, setShowForm] = useState(false);

    const handleBookNow = () => {
        setShowForm(true);
    };

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <OrderProvider> {/* Wrap the app in OrderProvider */}
                <Router>
                    <Routes>
                        <Route
                            path="/"
                            element={<WelcomePage onBookNow={handleBookNow} />}
                        />
                        <Route
                            path="/timeplanner"
                            element={<TimePlanner />}
                        />
                        <Route
                            path="/jobdetails"
                            element={<JobDetails />}
                        />
                        <Route
                            path="/invoice"
                            element={<InvoiceRecipient />}
                        />
                        <Route
                            path="/ordersummary"
                            element={<OrderSummary />} // Add OrderSummary route
                        />
                    </Routes>
                </Router>
            </OrderProvider>
        </MantineProvider>
    );
}

export default App;
