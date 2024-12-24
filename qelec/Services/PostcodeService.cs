using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace qelec.Services
{
    public class PostcodeService
    {
        private readonly HttpClient _httpClient;

        public PostcodeService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Metoda do wyszukiwania adresów na podstawie kodu pocztowego
        public async Task<List<string>> GetAddressesByPostcodeAsync(string postcode)
        {
            if (string.IsNullOrWhiteSpace(postcode))
            {
                throw new ArgumentException("Postcode cannot be null or empty.", nameof(postcode));
            }

            var url = $"https://api.postcodes.io/postcodes/{postcode}";
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException($"Failed to fetch data from Postcodes.io. Status code: {response.StatusCode}");
            }

            var postcodeResponse = await response.Content.ReadFromJsonAsync<PostcodeResponse>();

            if (postcodeResponse?.Result == null)
            {
                return new List<string>();
            }

            return postcodeResponse.Result.Addresses ?? new List<string>();
        }
    }

    // Klasy pomocnicze do deserializacji odpowiedzi z Postcodes.io
    public class PostcodeResponse
    {
        public PostcodeResult Result { get; set; }
    }

    public class PostcodeResult
    {
        public List<string> Addresses { get; set; }
    }
}
