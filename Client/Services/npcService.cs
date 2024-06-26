using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public static class npcService
{
    private static readonly HttpClient httpClient = new HttpClient();

    // Generar un nuevo NPC
    public static async Task<NpcApiResponse?> CreateNpc(NpcApiResponse npc)
    {
        string apiUrl = "http://localhost:8085/npc/add";

        try
        {
            var json = JsonSerializer.Serialize(npc);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync(apiUrl, content);

            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<NpcApiResponse>(responseContent);
        }
        catch (Exception e)
        {
            Console.WriteLine("Error creating NPC: " + e.Message);
            return null;
        }
    }

    // Obtener todos los Npcs
    public static async Task<NpcApiResponse> GetAllNpc()
    {
        string apiUrl = "http://localhost:8085/npc/667b29b610fad7c2bf687ba3"; // Reemplaza con tu URL real

        try
        {
            var response = await httpClient.GetStringAsync(apiUrl);
            return JsonSerializer.Deserialize<NpcApiResponse>(response);
        }
        catch (Exception e)
        {
            Console.Write("Error fetching all NPCs: " + e.Message);
            return null;
        }
    }

    // Obtener un Npc por su id
    public static async Task<NpcApiResponse?> GetByIdNpc(string id)
    {
        string apiUrl = "http://localhost:8085/npc/" + id;

        try
        {
            var response = await httpClient.GetStringAsync(apiUrl);
            return JsonSerializer.Deserialize<NpcApiResponse>(response);
        }
        catch (Exception e)
        {
            Console.WriteLine("Error fetching NPC: " + e.Message);
            return null;
        }
    }

    // Enviar Mensaje
    public static async Task<NpcApiResponse> SendMessage(string id, string message)
    {
        string apiUrl = $"http://localhost:8085/npc/{id}";

        try
        {
            var messageObject = new messageApiResponse
            {
                message = message
            };

            var json = JsonSerializer.Serialize(messageObject);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.PostAsync(apiUrl, content);

                response.EnsureSuccessStatusCode();

                var responseContent = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<NpcApiResponse>(responseContent);
            }
        }
        catch (Exception e)
        {
            Console.WriteLine("Error sending message to NPC: " + e.Message);
            return null;
        }
    }

}