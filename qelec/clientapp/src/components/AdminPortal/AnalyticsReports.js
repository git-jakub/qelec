import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import Navbar from '../../components/Navbar';
import './ManageUsers.css'

const AnalyticsReports = () => {
    const [data, setData] = useState({
        turnover: [],
        clients: [],
    });

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/all-orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch analytics data. Status: ${response.status}`);
            }

            const orders = await response.json();

            // Oblicz dane dla wykresów
            const turnover = calculateTurnover(orders);
            const clients = calculateClients(orders);

            setData({ turnover, clients });
        } catch (error) {
            console.error('Error fetching analytics data:', error);
        }
    };

    const calculateTurnover = (orders) => {
        // Grupowanie zamówień według miesiąca i sumowanie `calculatedCost`
        const turnoverMap = orders.reduce((acc, order) => {
            if (order.estimateDetails?.calculatedCost) {
                const month = new Date(order.createdDate).toLocaleString('default', { month: 'long', year: 'numeric' });
                acc[month] = (acc[month] || 0) + order.estimateDetails.calculatedCost;
            }
            return acc;
        }, {});

        return Object.entries(turnoverMap).map(([month, amount]) => ({ month, amount }));
    };

    const calculateClients = (orders) => {
        // Grupowanie klientów według miesiąca (unikalnych według emaila)
        const clientsMap = orders.reduce((acc, order) => {
            const month = new Date(order.createdDate).toLocaleString('default', { month: 'long', year: 'numeric' });
            const email = order.jobDetails?.clientEmail;

            if (email) {
                if (!acc[month]) {
                    acc[month] = new Set();
                }
                acc[month].add(email);
            }
            return acc;
        }, {});

        return Object.entries(clientsMap).map(([month, emails]) => ({
            month,
            count: emails.size, // Liczba unikalnych klientów w danym miesiącu
        }));
    };

    return (
        <div className="manage_container">
            <Navbar backPath="/" />
            <h2>Analytics Reports</h2>

            {/* Wykres słupkowy - Turnover */}
            <div className="chart-container">
                <h3>Turnover</h3>
                <BarChart width={600} height={300} data={data.turnover}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="white" color="white" />
                    <YAxis stroke="white" color="white" />
                    <Tooltip stroke="white" color="white"/>
                    <Legend stroke="white" color="white"/>
                    <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
            </div>

            {/* Wykres słupkowy - Liczba klientów */}
            <div className="chart-container">
                <h3>Number of Clients</h3>
                <BarChart width={600} height={300} data={data.clients}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="white" color="white" />
                    <YAxis stroke="white" color="white" />
                    <Tooltip stroke="white" color="white"/>
                    <Legend stroke="white" color="white"/>
                    <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
            </div>
        </div>
    );
};

export default AnalyticsReports;
