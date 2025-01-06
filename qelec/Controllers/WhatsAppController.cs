using Microsoft.AspNetCore.Mvc;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace qelec.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WhatsAppController : ControllerBase
    {
        private readonly string _accountSid = "AC1ce46020b9ffe403b4806a5a564220a0"; // Replace with your Account SID
        private readonly string _authToken = "e46867dd9b86f1c313e9c8ff4173a1c4";                         // Replace with your Auth Token
        private readonly string _fromPhoneNumber = "whatsapp:+14155238886";         // Twilio Sandbox Number

        [HttpPost("send")]
        public IActionResult SendWhatsAppMessage([FromBody] WhatsAppMessageRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.ToPhoneNumber) || string.IsNullOrWhiteSpace(request.Body))
            {
                return BadRequest(new { Error = "ToPhoneNumber and Body are required." });
            }

            try
            {
                // Initialize Twilio client
                TwilioClient.Init(_accountSid, _authToken);

                // Create message options
                var messageOptions = new CreateMessageOptions(new PhoneNumber($"whatsapp:{request.ToPhoneNumber}"))
                {
                    From = new PhoneNumber(_fromPhoneNumber),
                    Body = request.Body
                };

                // Send the message
                var message = MessageResource.Create(messageOptions);

                // Return success response
                return Ok(new { MessageSid = message.Sid, MessageBody = message.Body });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Error = "Failed to send WhatsApp message.",
                    Details = ex.Message
                });
            }
        }
    }

    public class WhatsAppMessageRequest
    {
        public string ToPhoneNumber { get; set; } // Recipient's WhatsApp number
        public string Body { get; set; }          // Message content
    }
}
