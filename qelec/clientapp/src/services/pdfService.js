export const generateInvoicePdf = async (orderId) => {
    try {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${process.env.REACT_APP_API_URL}/invoice/generate/${orderId}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to generate invoice:', errorText);
            alert('Failed to generate invoice.');
            return null;
        }

        const data = await response.json();
        return data.fileUrl;
    } catch (error) {
        console.error('Error generating invoice:', error);
        alert('An error occurred while generating the invoice.');
        return null;
    }
};
