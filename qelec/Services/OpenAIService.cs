using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;

public class OpenAIService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public OpenAIService(IConfiguration configuration)
    {
        _apiKey = configuration["OpenAI:ApiKey"];
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri("https://api.openai.com/")
        };
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
    }

    public async Task<string> GenerateChatCompletion(string input)
    {
        var requestBody = new
        {
            model = "gpt-4-turbo", // Upewnij się, że używasz dostępnego modelu
            messages = new[]
            {
                new { role = "user", content = input }
            },
            max_tokens = 50
        };

        var jsonContent = JsonConvert.SerializeObject(requestBody);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("v1/chat/completions", content);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new Exception($"Error: {response.StatusCode}. Content: {errorContent}");
        }

        var responseContent = await response.Content.ReadAsStringAsync();
        dynamic result = JsonConvert.DeserializeObject(responseContent);

        // Wyodrębnij treść odpowiedzi z modelu
        return result.choices[0].message.content.ToString();
    }
}
