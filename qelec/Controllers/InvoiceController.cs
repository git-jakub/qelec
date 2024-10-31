
    using Microsoft.AspNetCore.Mvc;
    using qelec.Models;
    
    namespace qelec.Controllers
    {
        [ApiController]
        [Route("api/[controller]")]
        public class InvoiceController : ControllerBase
        {
            [HttpPost]
            public IActionResult SubmitInvoice([FromBody] InvoiceDto invoiceData)
            {
                if (invoiceData == null)
                {
                    return BadRequest("Invalid data.");
                }

                // Przetwarzanie danych, np. zapisanie ich do bazy danych
                return Ok(new { message = "Invoice data successfully received!" });
            }
        }
    }

