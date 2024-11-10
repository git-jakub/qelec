using Microsoft.AspNetCore.Mvc;
using qelec.Services;
using System.Threading.Tasks;

namespace qelec.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstimatesController : ControllerBase
    {
        private readonly OpenAIService _openAIService;

        public EstimatesController(OpenAIService openAIService)
        {
            _openAIService = openAIService;
        }

        // Endpoint do generowania wyceny
        [HttpPost("generate")]
        public async Task<IActionResult> GenerateEstimate([FromBody] string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return BadRequest("Input cannot be empty.");
            }

            try
            {
                // Używamy poprawnej nazwy metody z OpenAIService
                var estimate = await _openAIService.GenerateChatCompletion(input);
                return Ok(estimate);
            }
            catch (Exception ex)
            {
                // Zwraca błąd 500, jeśli wystąpił problem po stronie serwera
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
