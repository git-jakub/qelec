import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        const token = new URLSearchParams(window.location.search).get("token");
        if (!token) {
            setMessage("Invalid token.");
            return;
        }

        try {
            console.log("Sending request to reset password...");
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: newPassword,
                }),
            });

            console.log("Response received:", response);

            if (response.ok) {
                setMessage("Password reset successful. You can now log in.");
            } else {
                const data = await response.json();
                setMessage(data.message || "Failed to reset password.");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("An error occurred. Please try again.");
        }
    };


    return (
        <div>
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    New Password:
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Confirm Password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
