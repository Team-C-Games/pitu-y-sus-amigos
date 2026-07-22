using Laberinto.Api.Realtime.Mocks;

namespace Laberinto.Api.Realtime;

public class MockGameBridge : IGameBridge
{
    public Task<BridgeResult> GetStateAsync(CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var state = MockGameScenarioFactory.CreateStatePayload();
        var envelope = new RealtimeEnvelope(
            "state",
            state,
            DateTimeOffset.UtcNow,
            RealtimeAudience.Caller);

        return Task.FromResult(new BridgeResult([envelope]));
    }

    public Task<BridgeResult> DispatchAsync(
        RealtimeCommand command,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var envelope = RealtimeErrorEnvelopeFactory.CreateActionRejected(
            "Unknown realtime command.");

        return Task.FromResult(new BridgeResult([envelope]));
    }
}
