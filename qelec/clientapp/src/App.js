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
import TestEmail from "./components/TestEmail";
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import ManageUsers from './components/AdminPortal/ManageUsers';
import GeneratePATCertificate from './services/GeneratePATCertificate';
import AnalyticsReports from './components/AdminPortal/AnalyticsReports';
import OrderSuccessful from './components/OrderSuccessful';
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
                        <Route path="/testemail" element={<TestEmail />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/order-successful" element={<OrderSuccessful />} />
                        {/* Protected Admin Routes */}
                        <Route
                            path="/adminportal"
                            element={
                                <PrivateRouteAdmin>
                                    <AdminPortal />
                                </PrivateRouteAdmin>
                            }
                        />
                        <Route
                            path="/adminportal/timesetter"
                            element={
                                <PrivateRouteAdmin>
                                    <TimeSetter />
                                </PrivateRouteAdmin>
                            }
                        />

                        <Route
                            path="/adminportal/manage-users"
                            element={
                                <PrivateRouteAdmin>
                                    <ManageUsers />
                                </PrivateRouteAdmin>
                            }
                        />


                        <Route
                            path="/adminportal/manage-orders"
                            element={
                                <PrivateRouteAdmin>
                                    <ManageOrders />
                                </PrivateRouteAdmin>
                            }
                        />
                        <Route
                            path="/adminportal/generate-invoice"
                            element={
                                <PrivateRouteAdmin>
                                    <GenerateInvoice />
                                </PrivateRouteAdmin>
                            }
                        />
                        <Route
                            path="/adminportal/generate-pat-certificate"
                            element={
                                <PrivateRouteAdmin>
                                    <GeneratePATCertificate />
                                </PrivateRouteAdmin>
                            }
                        />
                        <Route
                            path="/adminportal/analytics-reports"
                            element={
                                <PrivateRouteAdmin>
                                    <AnalyticsReports />
                                </PrivateRouteAdmin>
                            }
                        />
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
