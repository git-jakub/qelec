using Microsoft.AspNetCore.Mvc;
using qelec.Models;
using qelec.Models.DTOs;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace qelec.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InvoiceController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/invoice - Adds new InvoiceDetails
        [HttpPost]
        public async Task<IActionResult> SubmitInvoice([FromBody] InvoiceDetailsDto invoiceData)
        {
            if (invoiceData == null)
            {
                return BadRequest("Invalid data.");
            }

            // Map InvoiceDetailsDto to InvoiceDetails entity
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

            // Save to database
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

            // Map InvoiceDetails to InvoiceDetailsDto
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

        // PUT: api/invoice/{id} - Updates an existing InvoiceDetails
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoice(int id, [FromBody] InvoiceDetailsDto invoiceData)
        {
            if (invoiceData == null)
            {
                return BadRequest("Invalid data.");
            }

            var invoiceDetails = await _context.InvoiceDetails.FindAsync(id);
            if (invoiceDetails == null)
            {
                return NotFound();
            }

            // Update fields
            invoiceDetails.RecipientName = invoiceData.RecipientName;
            invoiceDetails.CompanyName = invoiceData.CompanyName;
            invoiceDetails.RecipientAddress = invoiceData.RecipientAddress;
            invoiceDetails.RecipientPostcode = invoiceData.RecipientPostcode;
            invoiceDetails.RecipientCity = invoiceData.RecipientCity;
            invoiceDetails.RecipientEmail = invoiceData.RecipientEmail;
            invoiceDetails.RecipientPhone = invoiceData.RecipientPhone;
            invoiceDetails.InvoiceDate = invoiceData.InvoiceDate;
            invoiceDetails.PaymentStatus = invoiceData.PaymentStatus;
            invoiceDetails.TotalAmount = invoiceData.TotalAmount;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/invoice/{id} - Deletes an InvoiceDetails
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var invoiceDetails = await _context.InvoiceDetails.FindAsync(id);
            if (invoiceDetails == null)
            {
                return NotFound();
            }

            _context.InvoiceDetails.Remove(invoiceDetails);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
