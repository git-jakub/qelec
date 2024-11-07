using Microsoft.AspNetCore.Mvc;
using qelec.Models;
using qelec.Models.DTOs;
using qelec.Services;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace qelec.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly InvoiceService _invoiceService;

        public InvoiceController(AppDbContext context, InvoiceService invoiceService)
        {
            _context = context;
            _invoiceService = invoiceService;
        }

        // POST: api/invoice - Adds new InvoiceDetails
        [HttpPost]
        public async Task<IActionResult> SubmitInvoice([FromBody] InvoiceDetailsDto invoiceData)
        {
            if (invoiceData == null)
            {
                return BadRequest("Invalid data.");
            }

            var invoiceDetails = new InvoiceDetails
            {
                RecipientName = invoiceData.RecipientName,
                CompanyName = invoiceData.CompanyName,
                RecipientAddress = invoiceData.RecipientAddress,
                RecipientPostcode = invoiceData.RecipientPostcode,
                RecipientCity = invoiceData.RecipientCity,
                RecipientEmail = invoiceData.RecipientEmail,
                RecipientPhone = invoiceData.RecipientPhone,
                InvoiceDate = invoiceData.InvoiceDate,
                PaymentStatus = invoiceData.PaymentStatus,
                TotalAmount = invoiceData.TotalAmount
            };

            _context.InvoiceDetails.Add(invoiceDetails);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInvoiceById), new { id = invoiceDetails.InvoiceDetailsId }, invoiceDetails);
        }

        // GET: api/invoice/{id} - Gets specific InvoiceDetails by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceDetailsDto>> GetInvoiceById(int id)
        {
            var invoiceDetails = await _context.InvoiceDetails.FindAsync(id);

            if (invoiceDetails == null)
            {
                return NotFound();
            }

            var invoiceDetailsDto = new InvoiceDetailsDto
            {
                RecipientName = invoiceDetails.RecipientName,
                CompanyName = invoiceDetails.CompanyName,
                RecipientAddress = invoiceDetails.RecipientAddress,
                RecipientPostcode = invoiceDetails.RecipientPostcode,
                RecipientCity = invoiceDetails.RecipientCity,
                RecipientEmail = invoiceDetails.RecipientEmail,
                RecipientPhone = invoiceDetails.RecipientPhone,
                InvoiceDate = invoiceDetails.InvoiceDate,
                PaymentStatus = invoiceDetails.PaymentStatus,
                TotalAmount = invoiceDetails.TotalAmount
            };

            return Ok(invoiceDetailsDto);
        }

        // Endpoint to generate invoice PDF
        [HttpGet("generate/{orderId}")]
        public async Task<IActionResult> GenerateInvoicePdf(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.JobDetails)
                .Include(o => o.InvoiceDetails)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null || order.InvoiceDetails == null)
            {
                return NotFound("Order or Invoice Details not found.");
            }

            var pdfBytes = _invoiceService.GenerateInvoicePdf(order);
            return File(pdfBytes, "application/pdf", $"Invoice_{orderId}.pdf");
        }

        // PUT and DELETE endpoints as defined in your previous controller code.
    }
}
