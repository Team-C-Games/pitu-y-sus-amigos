namespace Laberinto.Api.Realtime;

public interface IGameBridge
{
    Task<BridgeResult> GetStateAsync(CancellationToken cancellationToken = default);

    Task<BridgeResult> DispatchAsync(
        RealtimeCommand command,
        CancellationToken cancellationToken = default);
}
