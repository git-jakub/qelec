import React, { useState, useEffect } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import "./GenerateInvoice.css";
import Navbar from "../components/Navbar";

if (pdfFonts && pdfFonts.pdfMake) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else {
    console.error("pdfFonts is not loaded correctly.");
}

const GenerateInvoice = ({ orderId }) => {
    const [invoiceData, setInvoiceData] = useState({
        companyDetails: {
            name: "QELECTRIC LTD",
            street: "5 Levett House",
            postcode: "SW16 1SS",
            city: "London",
            phone: "0740 537 6887",
            email: "jakub@qelectric.net",
        },
        clientDetails: {
            name: "",
            street: "",
            postcode: "",
            city: "",
            email: "",
            phone: "",
        },
        invoiceDetails: {
            invoiceNumber: "",
            date: new Date().toISOString().split("T")[0], // Default to today
            dueDate: new Date().toISOString().split("T")[0],
            terms: "Due on receipt",
            po: "",
        },
        reference: "Remedial Works",
        jobAddress: "",
        items: [],
        total: 0,
        paymentDetails: {
            bankName: "QELECTRIC LTD",
            accountName: "Jakub Solarczyk",
            sortCode: "20-45-45",
            accountNumber: "63753735",
        },
    });

    const [currentInvoiceNumber, setCurrentInvoiceNumber] = useState(2503); // Start invoice numbering from 2503

    useEffect(() => {
        if (orderId) {
            fetch(`${process.env.REACT_APP_API_URL}/orders/${orderId}`)
                .then((response) => response.json())
                .then((data) => {
                    setInvoiceData((prevData) => ({
                        ...prevData,
                        invoiceDetails: {
                            invoiceNumber: data.invoiceNumber || currentInvoiceNumber, // Use auto-incremented number if not provided
                            date: data.date || prevData.invoiceDetails.date,
                            dueDate: data.dueDate || prevData.invoiceDetails.dueDate,
                            terms: data.terms || prevData.invoiceDetails.terms,
                            po: data.po || prevData.invoiceDetails.po || "", // Include PO field if present
                        },
                        clientDetails: {
                            name: data.clientName || "",
                            address: data.clientAddress || "",
                            email: data.clientEmail || "",
                            phone: data.clientPhone || "",
                        },
                        jobAddress: data.jobAddress || "",
                        items: data.items || [],
                        total: data.total || 0,
                    }));
                })
                .then(() => {
                    // Increment the invoice number after successfully fetching data
                    setCurrentInvoiceNumber((prev) => prev + 1);
                })
                .catch((error) => console.error("Error fetching order data:", error));
        }
    }, [orderId, currentInvoiceNumber]); // Add currentInvoiceNumber as a dependency

    const handleNestedInputChange = (fieldPath, value) => {
        const fields = fieldPath.split(".");
        setInvoiceData((prevData) => {
            const updatedData = { ...prevData };
            let current = updatedData;
            fields.slice(0, -1).forEach((key) => {
                if (!current[key]) current[key] = {};
                current = current[key];
            });
            current[fields[fields.length - 1]] = value;
            return updatedData;
        });
    };

    const addItem = () => {
        setInvoiceData((prevData) => ({
            ...prevData,
            items: [...prevData.items, { description: "", qty: 1, rate: 0, date: "" }],
        }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...invoiceData.items];
        updatedItems[index][field] = value;
        setInvoiceData((prevData) => ({
            ...prevData,
            items: updatedItems,
        }));
    };

    const calculateTotal = () => {
        const total = invoiceData.items.reduce((acc, item) => acc + item.qty * item.rate, 0);
        setInvoiceData((prevData) => ({ ...prevData, total }));
    };


    const generatePDF = () => {
        const {
            companyDetails,
            clientDetails,
            invoiceDetails,
            reference,
            jobAddress,
            items,
            total,
            paymentDetails,
        } = invoiceData;

        const docDefinition = {
            content: [
                // SECTION 1: COMPANY DETAILS
                {
                    columns: [
                        {
                            stack: [
                                { text: companyDetails.name, style: "header" },
                                { text: companyDetails.street, style: "smallText" },
                                { text: companyDetails.postcode, style: "smallText" },
                                { text: companyDetails.city, style: "smallText" },
                                { text: companyDetails.phone, style: "smallText" },
                                { text: companyDetails.email, style: "smallText" },
                            ],
                            margin: [0, 0, 0, 0],
                            alignment: "left",
                        },
                    ],
                },
                { text: " " },

                // SECTION 2 & SECTION 3: INVOICE TO & INVOICE DETAILS
                {
                    columns: [
                        {
                            width: "50%", // Left column for "INVOICE TO"
                            stack: [
                                { text: "INVOICE TO", style: "sectionHeader", margin: [0, 10, 0, 5] },
                                { text: clientDetails.name, style: "smallText", margin: [0, 2, 0, 2] },
                                { text: clientDetails.street, style: "smallText", margin: [0, 2, 0, 2] },
                                { text: clientDetails.postcode, style: "smallText", margin: [0, 2, 0, 2] },
                                { text: clientDetails.city, style: "smallText", margin: [0, 2, 0, 2] },
                                { text: clientDetails.email, style: "smallText", margin: [0, 2, 0, 2] },
                                { text: clientDetails.phone, style: "smallText", margin: [0, 2, 0, 10] },
                            ],
                            margin: [0, 0, 0, 0], // Space between columns
                        },
                        {
                            width: "50%", // Right column for "INVOICE DETAILS"
                            stack: [
                                {
                                    table: {
                                        widths: ["auto", "auto"],
                                        body: [
                                            [{ text: "Invoice No.", style: "tableHeader" }, invoiceDetails.invoiceNumber],
                                            [{ text: "Date", style: "tableHeader" }, invoiceDetails.date],
                                            [{ text: "Due Date", style: "tableHeader" }, invoiceDetails.dueDate],
                                            [{ text: "Terms", style: "tableHeader" }, invoiceDetails.terms],
                                            [{ text: "PO", style: "tableHeader" }, invoiceDetails.po],
                                        ],
                                    },
                                    layout: "noBorders",
                                    margin: [100, 0, 0, 0], // Adjust margin for table placement
                                    alignment: "right",
                                },
                            ],
                        },
                    ],
                    margin: [0, 0, 0, 20], // Adjust top and bottom margins for the whole row
                },



                // SECTION 4: REFERENCE
                {
                    columns: [
                        {
                            stack: [
                                { text: "REFERENCE", style: "sectionHeader" },
                                { text: reference, style: "smallText" },
                            ],
                            margin: [0, 0, 0, 10],
                        },
                        {
                            stack: [
                                { text: "SITE LOCATION", style: "sectionHeader" },
                                { text: jobAddress, style: "smallText" },
                            ],
                            margin: [0, 0, 0, 10],
                        },
                    ],
                },
                { text: " " },

                //// SECTION 5: JOB ADDRESS
                //{
                //    stack: [
                //        { text: "JOB ADDRESS", style: "sectionHeader", margin: [0, 10, 0, 5] },
                //        { text: jobAddress, style: "smallText", margin: [0, 0, 0, 10] },
                //    ],
                //},
                //{ text: " " },

                // SECTION 6: DETAILS TABLE
                {
                    table: {
                        widths: ["*", "auto", "auto", "auto", "auto"],
                        body: [
                            ["Description", "Qty", "Rate (£)", "Amount (£)", "Date"],
                            ...items.map((item) => [
                                item.description,
                                item.qty,
                                item.rate,
                                item.qty * item.rate,
                                item.date || "",
                            ]),
                        ],
                    },
                    layout: "lightHorizontalLines",
                    margin: [0, 10, 0, 10],
                },
                { text: " " },

                // SECTION 7 & SECTION 8: PAYMENT DETAILS & TOTAL COST
                {
                    columns: [
                        // Payment Details on the left
                        {
                            stack: [
                                { text: "Please pay via BACS transfer to:", style: "smallText", margin: [0, 10, 0, 5] },
                                { text: `Bank Name: ${paymentDetails.bankName}`, style: "smallText" },
                                { text: `Account Name: ${paymentDetails.accountName}`, style: "smallText" },
                                { text: `Sort Code: ${paymentDetails.sortCode}`, style: "smallText" },
                                { text: `Account Number: ${paymentDetails.accountNumber}`, style: "smallText" },
                            ],
                            width: "70%", // Adjust width as needed
                            margin: [0, 0, 0, 0],
                        },
                        // Total Cost on the right
                        {
                            stack: [
                                {
                                    text: `TOTAL: £${total}`,
                                    style: "total",
                                    alignment: "right",
                                    margin: [0, 10, 0, 5],
                                },
                            ],
                            width: "30%", // Adjust width as needed
                            alignment: "right",
                        },
                    ],
                    margin: [0, 10, 0, 10], // Adjust margins for the whole row
                },

            ],
            styles: {
                header: { fontSize: 18, bold: true },
                sectionHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
                smallText: { fontSize: 12 },
                tableHeader: { fontSize: 12, bold: true },
                total: { fontSize: 14, bold: true, alignment: "right" },
            },
        };



        // Generate and download the PDF
        pdfMake.createPdf(docDefinition).download(`Invoice_${invoiceDetails.invoiceNumber}.pdf`);
        setCurrentInvoiceNumber((prev) => prev + 1); // Increment invoice number

    };


    return (
        <div className="generate-invoice">
            <Navbar backPath="/" />
            <h2>Generate Invoice</h2>
            <div className="invoice-section">
                <h3>Company Details</h3>
                {Object.keys(invoiceData.companyDetails).map((key) => (
                    <input
                        key={key}
                        type="text"
                        placeholder={key}
                        value={invoiceData.companyDetails[key]}
                        onChange={(e) => handleNestedInputChange(`companyDetails.${key}`, e.target.value)}
                    />
                ))}
            </div>
            <div className="invoice-section">
                <h3>Client Details</h3>
                {Object.keys(invoiceData.clientDetails).map((key) => (
                    <input
                        key={key}
                        type="text"
                        placeholder={key}
                        value={invoiceData.clientDetails[key]}
                        onChange={(e) => handleNestedInputChange(`clientDetails.${key}`, e.target.value)}
                    />
                ))}
            </div>
            <div className="invoice-section">
                <h3>Invoice Details</h3>
                {Object.keys(invoiceData.invoiceDetails).map((key) => (
                    <input
                        key={key}
                        type="text"
                        placeholder={key}
                        value={invoiceData.invoiceDetails[key]}
                        onChange={(e) => handleNestedInputChange(`invoiceDetails.${key}`, e.target.value)}
                    />
                ))}
            </div>
            <div className="invoice-section">
                <h3>Reference</h3>
                <textarea
                    value={invoiceData.reference}
                    onChange={(e) => handleNestedInputChange("reference", e.target.value)}
                />
            </div>
            <div className="invoice-section">
                <h3>Job Address</h3>
                <textarea
                    value={invoiceData.jobAddress}
                    onChange={(e) => handleNestedInputChange("jobAddress", e.target.value)}
                />
            </div>
            <div className="invoice-section">
                <h3>Items</h3>
                {invoiceData.items.map((item, index) => (
                    <div key={index} className="item-row">
                        <input
                            type="text"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Qty"
                            value={item.qty}
                            onChange={(e) => handleItemChange(index, "qty", parseInt(e.target.value) || 0)}
                        />
                        <input
                            type="number"
                            placeholder="Rate"
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, "rate", parseFloat(e.target.value) || 0)}
                        />
                        <input
                            type="text"
                            placeholder="Date"
                            value={item.date}
                            onChange={(e) => handleItemChange(index, "date", e.target.value)}
                        />
                    </div>
                ))}
                <button onClick={addItem}>Add Item</button>
            </div>
            <div className="invoice-section">
                <h3>Payment Details</h3>
                {Object.keys(invoiceData.paymentDetails).map((key) => (
                    <input
                        key={key}
                        type="text"
                        placeholder={key}
                        value={invoiceData.paymentDetails[key]}
                        onChange={(e) => handleNestedInputChange(`paymentDetails.${key}`, e.target.value)}
                    />
                ))}
            </div>
            <div className="invoice-section">
                <h3>Total</h3>
                <input
                    type="text"
                    value={invoiceData.total}
                    readOnly
                />
            </div>
            <button onClick={calculateTotal}>Recalculate Total</button>
            <button onClick={generatePDF}>Generate PDF</button>
        </div>
    );
};

export default GenerateInvoice;