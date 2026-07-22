using System.Text.Json;

namespace Laberinto.Api.Realtime;

public class RealtimeCommand
{
    public string Name { get; set; } = string.Empty;

    public JsonElement Payload { get; set; }
}
