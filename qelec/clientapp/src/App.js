import React, { useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import InvoiceRecipient from './components/InvoiceRecipient';
import WelcomePage from './components/WelcomePage';
import JobDetails from './components/JobDetails';
import TimePlanner from './components/TimePlanner';
import OrderSummary from './components/OrderSummary';
import AdminPortal from './components/AdminPortal/AdminPortal'; // Import AdminPortal component
import PrivateRouteAdmin from './components/Auth/PrivateRouteAdmin'; // Import PrivateRouteAdmin for protected route
import Login from './components/Auth/Login';
import './App.css';

function App() {
    const [showForm, setShowForm] = useState(false);

    const handleBookNow = () => {
        setShowForm(true);
    };

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <OrderProvider>
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<WelcomePage onBookNow={handleBookNow} />} />
                        <Route path="/timeplanner" element={<TimePlanner />} />
                        <Route path="/jobdetails" element={<JobDetails />} />
                        <Route path="/invoice" element={<InvoiceRecipient />} />
                        <Route path="/ordersummary" element={<OrderSummary />} />
                        <Route path="/login" element={<Login />} />

                        {/* Protected Route for AdminPortal */}
                        <Route
                            path="/adminportal"
                            element={
                                <PrivateRouteAdmin>
                                    <AdminPortal />
                                </PrivateRouteAdmin>
                            }
                        />
                    </Routes>
                </Router>
            </OrderProvider>
        </MantineProvider>
    );
}

export default App;
