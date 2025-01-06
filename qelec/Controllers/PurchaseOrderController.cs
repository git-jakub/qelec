using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using qelec.Models.DTOs;
using System;
using System.IO;
using System.Threading.Tasks;

namespace qelec.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PurchaseOrderController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public PurchaseOrderController(IWebHostEnvironment env)
        {
            _env = env;
        }

        // POST: api/purchaseorder/save - Saves a purchase order PDF and returns the URL
        [HttpPost("save")]
        public async Task<IActionResult> SavePurchaseOrder([FromBody] PurchaseOrderDto orderData)
        {
            if (orderData == null)
            {
                return BadRequest("Invalid data.");
            }

            // Generate the PDF content
            var pdfBytes = GeneratePurchaseOrderPdf(orderData);
            if (pdfBytes == null || pdfBytes.Length == 0)
            {
                return StatusCode(500, "Failed to generate PDF.");
            }

            // Define file path for saving the PDF
            var fileName = $"PurchaseOrder_{orderData.OrderId}.pdf";
            var folderPath = Path.Combine(_env.WebRootPath, "purchaseorder");
            var filePath = Path.Combine(folderPath, fileName);

            try
            {
                // Ensure the directory exists
                Directory.CreateDirectory(folderPath);

                // Save the PDF file
                await System.IO.File.WriteAllBytesAsync(filePath, pdfBytes);
                Console.WriteLine($"Purchase Order saved at: {filePath}"); // Log file path for confirmation
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving PDF file: {ex.Message}");
                return StatusCode(500, "Failed to save the PDF file.");
            }

            // Return the URL to access the PDF
            var fileUrl = $"{Request.Scheme}://{Request.Host}/purchaseorder/{fileName}";
            return Ok(new { fileUrl });
        }

        // Example PDF generation logic (replace with your actual implementation)
        private byte[] GeneratePurchaseOrderPdf(PurchaseOrderDto orderData)
        {
            try
            {
                // Replace this with actual PDF generation logic using a library like iTextSharp or PdfSharp
                var placeholderContent = $"Purchase Order\nOrder ID: {orderData.OrderId}\nTotal Cost: {orderData.TotalCost}";
                var bytes = System.Text.Encoding.UTF8.GetBytes(placeholderContent);
                return bytes;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error generating PDF: {ex.Message}");
                return null;
            }
        }

        // Additional endpoints for retrieval or management can be added here
    }
}
