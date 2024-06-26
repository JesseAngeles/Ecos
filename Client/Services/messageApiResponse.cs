using System.Text.Json.Serialization;

public class messageApiResponse
{
    [JsonPropertyName("message")]
    public string message { get; set; }
}
