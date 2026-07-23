namespace Laberinto.Api.Realtime;

public interface IGameBridge
{
    Task<BridgeResult> GetStateAsync(CancellationToken cancellationToken = default);

    Task<BridgeResult> GetStateAsync(string connectionId, CancellationToken cancellationToken = default)
    {
        return GetStateAsync(cancellationToken);
    }

    Task<BridgeResult> DispatchAsync(
        RealtimeCommand command,
        CancellationToken cancellationToken = default);

    Task<BridgeResult> DispatchAsync(
        string connectionId,
        RealtimeCommand command,
        CancellationToken cancellationToken = default)
    {
        return DispatchAsync(command, cancellationToken);
    }

    Task ConnectionOpenedAsync(string connectionId, CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }

    Task ConnectionClosedAsync(string connectionId, CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }
}
