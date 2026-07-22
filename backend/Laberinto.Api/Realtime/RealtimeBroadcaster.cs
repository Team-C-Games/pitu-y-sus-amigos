using Microsoft.AspNetCore.SignalR;
using Laberinto.Api.Hubs;

namespace Laberinto.Api.Realtime;

public class RealtimeBroadcaster
{
    public const string ActiveGameGroup = "active-game";
    public const string ClientEventName = "game-event";

    private readonly IHubContext<GameHub> _hubContext;

    public RealtimeBroadcaster(IHubContext<GameHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public Task SendToCallerAsync(
        string connectionId,
        RealtimeEnvelope envelope,
        CancellationToken cancellationToken = default)
    {
        return _hubContext.Clients.Client(connectionId)
            .SendAsync(ClientEventName, envelope, cancellationToken);
    }

    public Task BroadcastToGameAsync(
        RealtimeEnvelope envelope,
        CancellationToken cancellationToken = default)
    {
        return _hubContext.Clients.Group(ActiveGameGroup)
            .SendAsync(ClientEventName, envelope, cancellationToken);
    }
}
