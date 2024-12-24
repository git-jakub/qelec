import React from 'react';

const OrderStatus = ({ status, setStatus }) => {
    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    return (
        <div className="order-status">
            <label htmlFor="order-status-select">Status:</label>
            <select id="order-status-select" value={status} onChange={handleStatusChange}>
                <option value="Scheduled">Scheduled</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Completed">Completed</option>
            </select>
        </div>
    );
};

export default OrderStatus;
