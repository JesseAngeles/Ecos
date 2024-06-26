using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

public class FlowItem
{
    [JsonPropertyName("0")]
    public bool key { get; set; }

    [JsonPropertyName("1")]
    public string? value { get; set; }  // Permitir null
}

public class NpcApiResponse
{
    [JsonPropertyName("_id")]
    public string? id { get; set; }  // Permitir null

    [JsonPropertyName("name")]
    public string? name { get; set; }  // Permitir null

    [JsonPropertyName("mood")]
    public int mood { get; set; }  // Asumimos que siempre tendrá un valor

    [JsonPropertyName("flow")]
    public List<FlowItem>? flow { get; set; }  // Permitir null

    [JsonPropertyName("__v")]
    public int version { get; set; }
}
