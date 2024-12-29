import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

if (pdfFonts?.pdfMake?.vfs) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else {
    console.error("pdfFonts is not loaded correctly. Ensure 'pdfmake' and 'vfs_fonts' are installed properly.");
}

export const generatePurchaseOrderPdf = (orderDetails) => {
    if (!orderDetails) {
        console.error("No order details provided for generating the PDF.");
        return;
    }

    const docDefinition = {
        content: [
            { text: "Purchase Order", style: "header" },
            { text: " " },
            {
                columns: [
                    {
                        width: "50%",
                        text: [
                            { text: "Supplier Details\n", style: "subHeader" },
                            "Company Name: QELECTRIC LTD\n",
                            "Address: [Company Address]\n",
                            "Contact Email: [Company Email]\n",
                            "Contact Phone: [Company Phone]\n",
                            "VAT Number: [VAT Number]\n",
                            "Company Registration Number: [CRN]\n",
                        ],
                    },
                    {
                        width: "50%",
                        text: [
                            { text: "Client Details\n", style: "subHeader" },
                            `Name: ${orderDetails.recipient_name || "N/A"}\n`,
                            `Address: ${orderDetails.client_address || "N/A"}\n`,
                            `Email: ${orderDetails.client_email || "N/A"}\n`,
                            `Phone: ${orderDetails.client_phone || "N/A"}\n`,
                        ],
                    },
                ],
            },
            { text: " " },
            {
                text: [
                    { text: "Purchase Order Information\n", style: "subHeader" },
                    `Purchase Order Number: ${orderDetails.order_id || "N/A"}\n`,
                    `Date of Issue: ${orderDetails.date || "N/A"}\n`,
                    `Reference: ${orderDetails.reference || "N/A"}\n`,
                ],
            },
            { text: " " },
            {
                text: "Description of Services\n",
                style: "subHeader",
            },
            {
                ul: [
                    `Service Details: ${orderDetails.job_description || "N/A"}`,
                    `Location of Services: ${orderDetails.service_location || "N/A"}`,
                ],
            },
            { text: " " },
            {
                text: [
                    { text: "Schedule of Work\n", style: "subHeader" },
                    `Date(s): ${orderDetails.work_start_date || "N/A"} to ${orderDetails.work_end_date || "N/A"}\n`,
                    `Time Slot: ${orderDetails.time_slot || "N/A"}\n`,
                ],
            },
            { text: " " },
            {
                text: "Cost Breakdown\n",
                style: "subHeader",
            },
            {
                table: {
                    widths: ["40%", "20%", "20%", "20%"],
                    body: [
                        [
                            { text: "Description", style: "tableHeader" },
                            { text: "Quantity", style: "tableHeader" },
                            { text: "Unit Cost (£)", style: "tableHeader" },
                            { text: "Total Cost (£)", style: "tableHeader" },
                        ],
                        ["Labour Costs", orderDetails.labour_hours || "N/A", orderDetails.labour_cost_per_hour || "N/A", orderDetails.labour_total || "N/A"],
                        ["Materials & Supplies", orderDetails.material_quantity || "N/A", orderDetails.material_unit_cost || "N/A", orderDetails.material_total || "N/A"],
                        ["Additional Charges", "", "", orderDetails.additional_charges || "N/A"],
                        [
                            { text: "Total (Excl. VAT)", colSpan: 3, alignment: "right" },
                            {},
                            {},
                            orderDetails.total_excl_vat || "N/A",
                        ],
                        [
                            { text: "VAT (if applicable)", colSpan: 3, alignment: "right" },
                            {},
                            {},
                            orderDetails.vat || "N/A",
                        ],
                        [
                            { text: "Grand Total", colSpan: 3, alignment: "right", bold: true },
                            {},
                            {},
                            orderDetails.grand_total || "N/A",
                        ],
                    ],
                },
                layout: "lightHorizontalLines",
            },
            { text: " " },
            {
                text: "Terms & Conditions\n",
                style: "subHeader",
            },
            {
                ul: [
                    "Payment is due within 30 days of receipt of the invoice.",
                    "Cancellation or rescheduling policy applies.",
                    "Warranty or guarantee on the services provided.",
                    "This agreement is governed by the laws of England and Wales.",
                ],
            },
            { text: " " },
            {
                columns: [
                    {
                        width: "50%",
                        text: [
                            { text: "Supplier Representative:\n", style: "subHeader" },
                            "Name: __________________________\n",
                            "Signature: _______________________\n",
                            "Date: ____________________________\n",
                        ],
                    },
                    {
                        width: "50%",
                        text: [
                            { text: "Customer:\n", style: "subHeader" },
                            "Name: __________________________\n",
                            "Signature: _______________________\n",
                            "Date: ____________________________\n",
                        ],
                    },
                ],
            },
        ],
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                alignment: "center",
            },
            subHeader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5],
            },
            tableHeader: {
                bold: true,
                fontSize: 12,
                alignment: "center",
            },
            footer: {
                fontSize: 10,
                italics: true,
                alignment: "center",
                margin: [0, 20, 0, 0],
            },
        },
    };

    try {
        pdfMake.createPdf(docDefinition).download(`PurchaseOrder_${orderDetails.order_id || "Unknown"}.pdf`);
        console.log("Purchase Order PDF generated successfully.");
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};
