using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

public class ApiClient
{
    private readonly HttpClient _httpClient;

    public ApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<NpcApiResponse?> GetApiResponse(string apiUrl)
    {
        var response = await _httpClient.GetStringAsync(apiUrl);

        try
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            return JsonSerializer.Deserialize<NpcApiResponse>(response, options);
        }
        catch (JsonException ex)
        {
            Console.WriteLine("Error deserializando JSON: " + ex.Message);
            return null;  // Maneja el posible valor de retorno nulo
        }
    }
}
