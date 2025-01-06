import React from "react";

const TestEmail = () => {
    const sendEmail = () => {
        // Wprowadź dane logowania Gmaila i odbiorcę
        const emailData = {
            Host: "smtp.gmail.com",
            Username: "qelectriclimited@gmail.com", // Twoje konto Gmail
            Password: "viso rgvu otdw nxue",       // App Password
            To: "aejacob@yahoo.co.uk",           // Adres odbiorcy
            From: "qelectriclimited@gmail.com",    // Nadawca
            Subject: "Test Email from React using Gmail",
            Body: "This is a test email sent directly from React using Gmail SMTP."
        };

        window.Email.send(emailData)
            .then((message) => {
                console.log("Email sent successfully:", message);
            })
            .catch((error) => {
                console.error("Error sending email:", error);
            });
    };

    return (
        <div>
            <h1>Test Email Sender</h1>
            <button onClick={sendEmail}>Send Test Email</button>
        </div>
    );
};

export default TestEmail;
