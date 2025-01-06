export const sendOrderEmail = async (emailParams) => {
    console.log("Starting sendOrderEmail function with params:", emailParams);

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/Email/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailParams),
        });

        console.log("Fetch response received:", response);

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error sending email:', errorDetails.message);
            return { success: false, error: errorDetails.message };
        }

        const result = await response.json();
        console.log('Email sent successfully:', result.message);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};
