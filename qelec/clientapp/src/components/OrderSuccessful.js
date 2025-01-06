import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CheckoutButton from "../components/CheckoutButton";

const OrderSuccessful = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderDetails } = location.state || {};

    if (!orderDetails) {
        return (
            <div>
                <h1>Order Successful</h1>
                <p>No order details found. Please check your order history.</p>
                <button onClick={() => navigate("/")}>Go Back</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Order Successful!</h1>
            <p>Thank you for your order. Here are the details:</p>
            <h3>Order Details:</h3>
            <ul>
                <li><strong>Order ID:</strong> {orderDetails.id}</li>
                <li><strong>Client Name:</strong> {orderDetails.clientName}</li>
                <li><strong>Job Description:</strong> {orderDetails.jobDescription}</li>
                <li><strong>Total Cost:</strong> £{orderDetails.totalCost}</li>
                <li><strong>Date:</strong> {orderDetails.date}</li>
                <li><strong>Time:</strong> {orderDetails.time}</li>
            </ul>
            <button onClick={() => navigate("/")}>Back to Home</button>

            <CheckoutButton
                amount={orderDetails.totalCost}
                description={`Payment for Order #${orderDetails.id}`}
                id={orderDetails.id} // Pass the Order ID explicitly here
            />

        </div>
    );
};

export default OrderSuccessful;
