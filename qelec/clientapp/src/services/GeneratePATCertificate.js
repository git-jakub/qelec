import React, { useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import "./GenerateInvoice.css";
import Navbar from "../components/Navbar"; // Use existing styles or modify as needed

// Initialize pdfMake fonts
if (pdfFonts && pdfFonts.pdfMake) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else {
    console.error("pdfFonts is not loaded correctly.");
}

const GeneratePATCertificate = () => {
    const [patData, setPatData] = useState({
        companyDetails: {
            name: "QELECTRIC LTD",
            street: "5 Levett House",
            postcode: "SW16 1SS",
            city: "London",
            phone: "0740 537 6887",
            email: "jakub@qelectric.net",
        },
        reportNumber: "",
        date: new Date().toISOString().split("T")[0],
        customerDetails: "",
        appliances: [
            {
                id: "",
                description: "",
                location: "",
                class: "",
                visualInspection: "",
                earthTest: "",
                insulationTest: "",
                functionalCheck: "",
                nextTestDate: "",
                passOrFail: "",
                comments: "",
            },
        ],
    });

    const addAppliance = () => {
        setPatData((prevData) => ({
            ...prevData,
            appliances: [
                ...prevData.appliances,
                {
                    id: "",
                    description: "",
                    location: "",
                    class: "",
                    visualInspection: "",
                    earthTest: "",
                    insulationTest: "",
                    functionalCheck: "",
                    nextTestDate: "",
                    passOrFail: "",
                    comments: "",
                },
            ],
        }));
    };

    const handleApplianceChange = (index, field, value) => {
        const updatedAppliances = [...patData.appliances];
        updatedAppliances[index][field] = value;
        setPatData((prevData) => ({ ...prevData, appliances: updatedAppliances }));
    };

    const validateValue = (value, fallback = "N/A") =>
        value !== undefined && value !== null && value !== "" ? value : fallback;

    const generatePDF = () => {
        const { companyDetails, reportNumber, date, customerDetails, appliances } = patData;

        const validateValue = (value, fallback = "N/A") =>
            value !== undefined && value !== null && value !== "" ? value : fallback;

        // Ensure appliances array is not empty
        const applianceRows =
            appliances.length > 0
                ? appliances.map((appliance, index) => [
                    { text: index + 1, style: "tableCell" },
                    { text: validateValue(appliance.description), style: "tableCell" },
                    { text: validateValue(appliance.location), style: "tableCell" },
                    { text: validateValue(appliance.class), style: "tableCell" },
                    { text: validateValue(appliance.visualInspection), style: "tableCell" },
                    { text: validateValue(appliance.earthTest), style: "tableCell" },
                    { text: validateValue(appliance.insulationTest), style: "tableCell" },
                    { text: validateValue(appliance.functionalCheck), style: "tableCell" },
                    { text: validateValue(appliance.nextTestDate), style: "tableCell" },
                    { text: validateValue(appliance.passOrFail), style: "tableCell" },
                    { text: validateValue(appliance.comments), style: "tableCell" },
                ])
                : [[{ text: "No appliances available", colSpan: 11, alignment: "center", style: "tableCell" }]];

        const docDefinition = {
            pageSize: "A4",
            pageOrientation: "landscape", // Change to landscape
            pageMargins: [40, 60, 40, 40],
            content: [
                // Company Details Section
                {
                    columns: [
                        {
                            stack: [
                                { text: companyDetails.name, style: "smallText" },
                                { text: companyDetails.street, style: "smallText" },
                                { text: `${companyDetails.postcode}, ${companyDetails.city}`, style: "smallText" },
                                { text: `Phone: ${companyDetails.phone}`, style: "smallText" },
                                { text: `Email: ${companyDetails.email}`, style: "smallText" },
                            ],
                            margin: [0, 0, 0, 20],
                        },
                    ],
                },
                // Report Details Section
                { text: "PORTABLE APPLIANCE TEST CERTIFICATE", style: "header", margin: [0, 10, 0, 20] },
                {
                    table: {
                        widths: ["auto", "*"],
                        body: [
                            ["Report No:", validateValue(reportNumber)],
                            ["Date:", validateValue(date)],
                            ["Customer Details:", validateValue(customerDetails)],
                        ],
                    },
                    layout: "noBorders",
                    margin: [0, 10, 0, 20],
                },
                // Appliance Details Table
                {
                    table: {
                        headerRows: 1,
                        widths: [
                            "auto", "*", "*", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "*",
                        ],
                        body: [
                            [
                                { text: "Appliance No", style: "tableHeader" },
                                { text: "Item Description", style: "tableHeader" },
                                { text: "Location", style: "tableHeader" },
                                { text: "Class", style: "tableHeader" },
                                { text: "Visual Inspection", style: "tableHeader" },
                                { text: "Earth Test", style: "tableHeader" },
                                { text: "Insulation Test", style: "tableHeader" },
                                { text: "Functional Check", style: "tableHeader" },
                                { text: "Next Test Date", style: "tableHeader" },
                                { text: "Pass / Fail", style: "tableHeader" },
                                { text: "Comments", style: "tableHeader" },
                            ],
                            ...applianceRows,
                        ],
                    },
                    layout: "lightHorizontalLines",
                },
            ],
            styles: {
                title: { fontSize: 16, bold: true, alignment: "center" },
                header: { fontSize: 14, bold: true, alignment: "center", margin: [0, 0, 0, 20] },
                smallText: { fontSize: 10, margin: [0, 2, 0, 2] },
                tableHeader: { fontSize: 10, bold: true, alignment: "center" },
                tableCell: { fontSize: 10, margin: [0, 2, 0, 2] },
            },
        };

        pdfMake.createPdf(docDefinition).download(`PAT_Report_${validateValue(reportNumber, "Unknown")}.pdf`);
    };



    return (
        <div className="generate-invoice">
            <Navbar backPath="/"/>
            <h2>Generate PAT Certificate</h2>
            <div className="invoice-section">
                <h3>Report Details</h3>
                <input
                    type="text"
                    placeholder="Report Number"
                    value={patData.reportNumber}
                    onChange={(e) => setPatData({ ...patData, reportNumber: e.target.value })}
                />
                <input
                    type="date"
                    value={patData.date}
                    onChange={(e) => setPatData({ ...patData, date: e.target.value })}
                />
                <textarea
                    placeholder="Customer Details"
                    value={patData.customerDetails}
                    onChange={(e) => setPatData({ ...patData, customerDetails: e.target.value })}
                />
            </div>
            <div className="invoice-section">
                <h3>Appliances</h3>
                {patData.appliances.map((appliance, index) => (
                    <div key={index} className="item-row">
                        {["id", "description", "location", "class", "visualInspection", "earthTest", "insulationTest", "functionalCheck", "nextTestDate", "passOrFail", "comments"].map((field, i) => (
                            <input
                                key={i}
                                type={field === "nextTestDate" ? "date" : "text"}
                                placeholder={field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                value={appliance[field]}
                                onChange={(e) => handleApplianceChange(index, field, e.target.value)}
                            />
                        ))}
                    </div>
                ))}
                <button onClick={addAppliance}>Add Appliance</button>
            </div>
            <button onClick={generatePDF}>Generate PDF</button>
        </div>
    );
};

export default GeneratePATCertificate;
