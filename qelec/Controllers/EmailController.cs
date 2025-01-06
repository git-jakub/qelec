using Microsoft.AspNetCore.Mvc;
using qelec.Services;
using System.ComponentModel.DataAnnotations;

namespace qelec.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly EmailService _emailService;

        public EmailController(EmailService emailService)
        {
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                Console.WriteLine($"ToEmail: {request.ToEmail}, ToName: {request.ToName}, Subject: {request.Subject}, Body: {request.Body}");
                var success = await _emailService.SendEmailAsync(request.ToEmail, request.ToName, request.Subject, request.Body);

                if (success)
                {
                    return Ok(new { message = "Email sent successfully." });
                }
                else
                {
                    return StatusCode(500, new { message = "Failed to send email." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in EmailController: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while sending the email." });
            }
        }

        // DTO dla żądania e-mail
        public class EmailRequest
        {
            [Required(ErrorMessage = "Recipient email address is required.")]
            [EmailAddress(ErrorMessage = "Invalid email address.")]
            public string ToEmail { get; set; }

            [Required(ErrorMessage = "Recipient name is required.")]
            public string ToName { get; set; }

            [Required(ErrorMessage = "Subject is required.")]
            public string Subject { get; set; }

            [Required(ErrorMessage = "Body is required.")]
            public string Body { get; set; }
        }
    }
}
