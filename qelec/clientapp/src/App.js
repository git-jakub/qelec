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
import ManageOrders from './components/AdminPortal/ManageOrders';
import ManageYourOrders from './components/CustomerPortal/ManageYourOrders';
import EstimatesGenerator from './components/EstimatesGenerator';
import GenerateInvoice from './services/GenerateInvoice'; // Updated Import
import PdfMakeTest from './components/PdfMakeTest'; // Added a test page for PDFMake
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
                        <Route path="/estimates" element={<EstimatesGenerator />} />

                        {/* Protected Admin Routes */}
                        <Route
                            path="/adminportal"
                            element={
                                <PrivateRouteAdmin>
                                    <AdminPortal />
                                </PrivateRouteAdmin>
                            }
                        >
                            <Route path="timesetter" element={<TimeSetter />} />
                            <Route path="manage-orders" element={<ManageOrders />} />
                            <Route path="generate-invoice" element={<GenerateInvoice />} /> {/* GenerateInvoice Route */}
                        </Route>

                        {/* Protected Customer Routes */}
                        <Route
                            path="/customerportal"
                            element={
                                <PrivateRouteCustomer>
                                    <CustomerPortal />
                                </PrivateRouteCustomer>
                            }
                        />
                        <Route
                            path="/customerportal/manageyourorders"
                            element={
                                <PrivateRouteCustomer>
                                    <ManageYourOrders />
                                </PrivateRouteCustomer>
                            }
                        />

                        {/* PDFMake Test Page */}
                        <Route path="/pdfmake-test" element={<PdfMakeTest />} />
                    </Routes>
                </Router>
            </OrderProvider>
        </MantineProvider>
    );
}

export default App;
