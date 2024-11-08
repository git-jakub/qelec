using System;
using System.IO;
using iTextSharp.text;
using iTextSharp.text.pdf;
using qelec.Models;

public class InvoiceService
{
    public byte[] GenerateInvoicePdf(Order order)
    {
        using (MemoryStream ms = new MemoryStream())
        {
            Document document = new Document(PageSize.A4, 50, 50, 25, 25);
            PdfWriter writer = PdfWriter.GetInstance(document, ms);
            document.Open();

            // Fonts
            var titleFont = FontFactory.GetFont("Arial", 16, Font.BOLD);
            var boldFont = FontFactory.GetFont("Arial", 12, Font.BOLD);
            var regularFont = FontFactory.GetFont("Arial", 12, Font.NORMAL);

            // Header Section (Company Information)
            document.Add(new Paragraph("QELECTRIC LTD", boldFont));
            document.Add(new Paragraph("5 Levett House", regularFont));
            document.Add(new Paragraph("London, SW16 1SS", regularFont));
            document.Add(new Paragraph("Phone: 0740 537 6887", regularFont));
            document.Add(new Paragraph("Email: jakub@qelectric.net", regularFont));
            document.Add(new Paragraph(" ")); // Blank line

            // Invoice Title
            document.Add(new Paragraph("INVOICE", titleFont));
            document.Add(new Paragraph(" ")); // Blank line

            // Recipient Information
            if (order.InvoiceDetails != null)
            {
                document.Add(new Paragraph("INVOICE TO", boldFont));
                document.Add(new Paragraph($"{order.InvoiceDetails.RecipientName}", regularFont));
                document.Add(new Paragraph($"{order.InvoiceDetails.CompanyName}", regularFont));
                document.Add(new Paragraph($"{order.InvoiceDetails.RecipientAddress}", regularFont));
                document.Add(new Paragraph($"{order.InvoiceDetails.RecipientCity} {order.InvoiceDetails.RecipientPostcode}", regularFont));
                document.Add(new Paragraph(" ")); // Blank line
            }

            // Invoice Details (Invoice Number, Date, Due Date, Terms)
            document.Add(new Paragraph($"Invoice No.: {order.OrderId}", regularFont));
            document.Add(new Paragraph($"Date: {DateTime.Now:dd/MM/yyyy}", regularFont));
            document.Add(new Paragraph($"Due Date: {DateTime.Now.AddDays(30):dd/MM/yyyy}", regularFont)); // Example due date
            document.Add(new Paragraph("Terms: Due on receipt", regularFont));
            document.Add(new Paragraph(" ")); // Blank line

            // Job Details Table
            if (order.JobDetails != null)
            {
                PdfPTable jobTable = new PdfPTable(4);
                jobTable.WidthPercentage = 100;
                jobTable.AddCell(new PdfPCell(new Phrase("DESCRIPTION", boldFont)));
                jobTable.AddCell(new PdfPCell(new Phrase("QTY", boldFont)));
                jobTable.AddCell(new PdfPCell(new Phrase("RATE", boldFont)));
                jobTable.AddCell(new PdfPCell(new Phrase("AMOUNT", boldFont)));

                // Example line item (replace with actual details)
                jobTable.AddCell(new PdfPCell(new Phrase($"{order.JobDetails.ServiceType} - {order.JobDetails.ServiceDetails}", regularFont)));
                jobTable.AddCell(new PdfPCell(new Phrase("1", regularFont)));
                jobTable.AddCell(new PdfPCell(new Phrase("575", regularFont))); // Example rate
                jobTable.AddCell(new PdfPCell(new Phrase("575", regularFont))); // Example amount
                document.Add(jobTable);
                document.Add(new Paragraph(" ")); // Blank line
            }

            // Total Amount and Payment Status
            if (order.InvoiceDetails != null)
            {
                document.Add(new Paragraph($"Total Amount: £{order.InvoiceDetails.TotalAmount}", boldFont));
                document.Add(new Paragraph($"Payment Status: {order.InvoiceDetails.PaymentStatus}", regularFont));
                document.Add(new Paragraph(" ")); // Blank line
            }

            // Footer Section (Payment Instructions)
            document.Add(new Paragraph("Please pay via BACS transfer to:", boldFont));
            document.Add(new Paragraph("QELECTRIC LTD", regularFont));
            document.Add(new Paragraph("Jakub Solarczyk", regularFont));
            document.Add(new Paragraph("Sort code: 00-00-45", regularFont));
            document.Add(new Paragraph("Account number: 54815435", regularFont));
            document.Add(new Paragraph(" ")); // Blank line

            document.Close();
            return ms.ToArray();
        }
    }
}
