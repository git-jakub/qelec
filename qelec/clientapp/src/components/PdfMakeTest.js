import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Properly assign the fonts to pdfMake
pdfMake.vfs = pdfFonts.pdfMake?.vfs;

const PdfMakeTest = () => {
    const generatePdf = () => {
        const docDefinition = {
            content: [
                { text: "Hello, PDFMake!", style: "header" },
                "This is a simple test document generated with PDFMake.",
                { text: "Thank you for testing!", style: "footer" },
            ],
            styles: {
                header: { fontSize: 22, bold: true },
                footer: { fontSize: 14, italics: true },
            },
        };

        pdfMake.createPdf(docDefinition).download("TestDocument.pdf");
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>PDFMake Test</h1>
            <p>Click the button below to generate a sample PDF document.</p>
            <button onClick={generatePdf} style={{ padding: "10px 20px", fontSize: "16px" }}>
                Generate PDF
            </button>
        </div>
    );
};

export default PdfMakeTest;
