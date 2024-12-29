import emailjs from 'emailjs-com';

export const sendOrderEmail = async (emailParams) => {
    try {
        const response = await emailjs.send(
            'service_7n0t7bg', // EmailJS service ID
            'template_axl4qnw', // EmailJS template ID
            emailParams,
            'XvVzICuTNwzlzA_5x' //  EmailJS user ID
        );
        console.log('Email sent successfully:', response.status, response.text);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};
