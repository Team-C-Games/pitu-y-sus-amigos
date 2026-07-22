using System.Text.Json;

namespace Laberinto.Api.Realtime;

public class UnavailableRealGameBridge : IGameBridge
{
    public Task<BridgeResult> GetStateAsync(CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        return Task.FromResult(CreateNotReadyResult());
    }

    public Task<BridgeResult> DispatchAsync(
        RealtimeCommand command,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        return Task.FromResult(CreateNotReadyResult());
    }

    private static BridgeResult CreateNotReadyResult()
    {
        using var document = JsonDocument.Parse(
            "{\"message\":\"Real game bridge is unavailable because Application contracts are missing.\"}");
        var envelope = new RealtimeEnvelope(
            "not-ready",
            document.RootElement.Clone(),
            DateTimeOffset.UtcNow,
            RealtimeAudience.Caller);

        return new BridgeResult([envelope]);
    }
}
