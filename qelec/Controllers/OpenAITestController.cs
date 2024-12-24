using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using qelec.Services;

namespace qelec.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OpenAITestController : ControllerBase
    {
        private readonly OpenAIService _openAIService;

        public OpenAITestController(OpenAIService openAIService)
        {
            _openAIService = openAIService;
        }

        [HttpPost("test")]
        public async Task<IActionResult> TestOpenAI([FromBody] string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return BadRequest("Input cannot be empty.");
            }

            try
            {
                var result = await _openAIService.GenerateChatCompletion(input);
                return Ok(new { message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = "Failed to communicate with OpenAI.",
                    details = ex.Message
                });
            }
        }
    }
}
