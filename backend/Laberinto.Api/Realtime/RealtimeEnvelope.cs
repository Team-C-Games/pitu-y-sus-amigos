using System.Text.Json;
using System.Text.Json.Serialization;

namespace Laberinto.Api.Realtime;

public class RealtimeEnvelope
{
    public RealtimeEnvelope(
        string type,
        JsonElement payload,
        DateTimeOffset occurredAt,
        RealtimeAudience audience)
    {
        Type = type;
        Payload = payload;
        OccurredAt = occurredAt;
        Audience = audience;
    }

    public string Type { get; }

    public JsonElement Payload { get; }

    public DateTimeOffset OccurredAt { get; }

    [JsonIgnore]
    public RealtimeAudience Audience { get; }
}
