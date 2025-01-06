import React from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51QeIj4GRsg7epUqsznMKvNw7Ic9vShKIb1WSAEIMf89YQyxJHzcp3pZG4Y6I9Ye8bQ9npLoFYeuCf70AuHlxxYso00v5Y92zJW");



const CheckoutButton = ({ amount, description, id }) => {
    const handleCheckout = async () => {
        if (!id) {
            console.error('Order ID is missing!');
            alert('Order ID is not available. Please try again.');
            return;
        }

        const stripe = await stripePromise;

        const response = await fetch(`${process.env.REACT_APP_API_URL}/Stripe/create-checkout-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount,
                description,
                successUrl: `${window.location.origin}/success`,
                cancelUrl: `${window.location.origin}/cancel`,
            }),
        });

        const { sessionId } = await response.json();

        const result = await stripe.redirectToCheckout({ sessionId });
        if (result.error) {
            console.error(result.error.message);
        }
    };

    return (
        <button onClick={handleCheckout} disabled={!id}>
            Pay £{amount.toFixed(2)}
        </button>
    );
};

export default CheckoutButton;

