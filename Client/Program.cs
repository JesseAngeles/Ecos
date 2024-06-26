using System;
using System.Threading.Tasks;

public class Program
{
    public static async Task Main(string[] args)
    {
        try
        {
            string npcId = "667b29b610fad7c2bf687ba3";
            var npc = await npcService.SendMessage(npcId, "Como te llamas?");

            if (npc != null)
            {
                int last = npc.flow.Count;
                Console.WriteLine($"Mensaje:{npc.flow[last - 1].value}"); 
                
            }
            else
            {
                Console.WriteLine("No se recibió ninguna respuesta.");
            }
            /*var newNpc = new NpcApiResponse
            {
                name = "Nuevo NPC",
                mood = 1,
                flow = new List<FlowItem> { new FlowItem { Key = true, Value = "Flujo de prueba" } }
            };

            var createdNpc = await npcService.CreateNpc(newNpc);
            if (createdNpc != null)
            {
                Console.WriteLine($"NPC creado: ID={createdNpc.id}, Name={createdNpc.name}");
            }
            else
            {
                Console.WriteLine("No se pudo crear el NPC.");
            }


            var allNpcs = await npcService.GetAllNpc();
            if (allNpcs != null)
            {
                // Trabaja con la lista de NPCs aquí
                Console.WriteLine("Todos los NPCs obtenidos.");
            }
            else
            {
                Console.WriteLine("No se pudieron obtener los NPCs.");
            }

            var npcId = "667b29b610fad7c2bf687ba3"; // Reemplaza con un ID válido
            var npcById = await npcService.GetByIdNpc(npcId);
            if (npcById != null)
            {
                // Trabaja con el NPC específico aquí
                Console.WriteLine($"NPC obtenido por ID: {npcById.name}");
            }
            else
            {
                Console.WriteLine("No se pudo obtener el NPC por ID.");
            }*/


        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }
    }
}
