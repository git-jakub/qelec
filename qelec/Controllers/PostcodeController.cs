using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace qelec.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostcodeController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public PostcodeController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Endpoint: Pobierz współrzędne dla pojedynczego kodu pocztowego
        [HttpGet("coordinates/{postcode}")]
        public async Task<IActionResult> GetCoordinates(string postcode)
        {
            if (string.IsNullOrWhiteSpace(postcode))
                return BadRequest(new { message = "Postcode cannot be empty." });

            try
            {
                var url = $"https://api.postcodes.io/postcodes/{postcode}";
                var response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                    return NotFound(new { message = "Postcode not found." });

                var content = await response.Content.ReadAsStringAsync();
                var data = JsonConvert.DeserializeObject<dynamic>(content);

                if (data?.result == null)
                    return NotFound(new { message = "No data found for the provided postcode." });

                return Ok(new
                {
                    Latitude = (double?)data.result.latitude ?? 0,
                    Longitude = (double?)data.result.longitude ?? 0
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing the request.", error = ex.Message });
            }
        }

        // Endpoint: Pobierz współrzędne dla wielu kodów pocztowych
        [HttpPost("coordinates")]
        public async Task<IActionResult> GetCoordinatesForMultiple([FromBody] string[] postcodes)
        {
            if (postcodes == null || postcodes.Length == 0)
                return BadRequest(new { message = "Postcodes list cannot be empty." });

            try
            {
                var url = "https://api.postcodes.io/postcodes";
                var response = await _httpClient.PostAsJsonAsync(url, new { postcodes });

                if (!response.IsSuccessStatusCode)
                    return BadRequest(new { message = "Error fetching postcodes." });

                var content = await response.Content.ReadAsStringAsync();
                var data = JsonConvert.DeserializeObject<dynamic>(content);

                if (data?.result == null)
                    return NotFound(new { message = "No data found for the provided postcodes." });

                var coordinates = new List<object>();
                foreach (var item in data.result)
                {
                    if (item.result != null)
                    {
                        coordinates.Add(new
                        {
                            Postcode = (string)item.query,
                            Latitude = (double?)item.result.latitude ?? 0,
                            Longitude = (double?)item.result.longitude ?? 0
                        });
                    }
                }

                return Ok(coordinates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing the request.", error = ex.Message });
            }
        }
    }
}
