using System.Text.Json;

namespace Laberinto.Api.Realtime;

public static class RealtimeErrorEnvelopeFactory
{
    public static RealtimeEnvelope CreateActionRejected(string message)
    {
        return Create("action-rejected", message);
    }

    public static RealtimeEnvelope CreateInternalError()
    {
        return Create("internal-error", "Unable to process the realtime request.");
    }

    private static RealtimeEnvelope Create(string type, string message)
    {
        var payload = JsonSerializer.SerializeToElement(new { message });
        return new RealtimeEnvelope(
            type,
            payload,
            DateTimeOffset.UtcNow,
            RealtimeAudience.Caller);
    }
}
