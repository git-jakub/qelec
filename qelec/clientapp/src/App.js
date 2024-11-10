import React, { useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import InvoiceRecipient from './components/InvoiceRecipient';
import WelcomePage from './components/WelcomePage';
import JobDetails from './components/JobDetails';
import TimePlanner from './components/TimePlanner';
import OrderSummary from './components/OrderSummary';
import AdminPortal from './components/AdminPortal/AdminPortal';
import CustomerPortal from './components/CustomerPortal/CustomerPortal';
import PrivateRouteAdmin from './components/Auth/PrivateRouteAdmin';
import PrivateRouteCustomer from './components/Auth/PrivateRouteCustomer';
import Login from './components/Auth/Login';
import TimeSetter from './components/AdminPortal/TimeSetter';
import ManageYourOrders from './components/CustomerPortal/ManageYourOrders';
import EstimatesGenerator from './components/EstimatesGenerator'; // Import EstimateGenerator
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
                        <Route path="/" element={<WelcomePage onBookNow={handleBookNow} />} />
                        <Route path="/timeplanner" element={<TimePlanner />} />
                        <Route path="/jobdetails" element={<JobDetails />} />
                        <Route path="/invoice" element={<InvoiceRecipient />} />
                        <Route path="/ordersummary" element={<OrderSummary />} />
                        <Route path="/login" element={<Login />} />

                        {/* New Route for EstimateGenerator */}
                        <Route path="/estimates" element={<EstimatesGenerator />} />

                        {/* Protected Route for AdminPortal */}
                        <Route
                            path="/adminportal"
                            element={
                                <PrivateRouteAdmin>
                                    <AdminPortal />
                                </PrivateRouteAdmin>
                            }
                        />

                        {/* Route for TimeSetter inside AdminPortal */}
                        <Route
                            path="/adminportal/timesetter"
                            element={
                                <PrivateRouteAdmin>
                                    <TimeSetter />
                                </PrivateRouteAdmin>
                            }
                        />

                        {/* Protected Route for CustomerPortal */}
                        <Route
                            path="/customerportal"
                            element={
                                <PrivateRouteCustomer>
                                    <CustomerPortal />
                                </PrivateRouteCustomer>
                            }
                        />

                        {/* Protected Route for ManageYourOrders */}
                        <Route
                            path="/manage-your-orders"
                            element={
                                <PrivateRouteCustomer>
                                    <ManageYourOrders />
                                </PrivateRouteCustomer>
                            }
                        />
                    </Routes>
                </Router>
            </OrderProvider>
        </MantineProvider>
    );
}

export default App;
