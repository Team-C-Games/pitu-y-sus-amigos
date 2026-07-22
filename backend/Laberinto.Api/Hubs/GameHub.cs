using Microsoft.AspNetCore.SignalR;
using Laberinto.Api.Realtime;
using Microsoft.Extensions.Logging;

namespace Laberinto.Api.Hubs;

public class GameHub : Hub
{
    private readonly IGameBridge _gameBridge;
    private readonly ConnectionRegistry _connectionRegistry;
    private readonly RealtimeBroadcaster _broadcaster;
    private readonly RealtimeCommandValidator _commandValidator;
    private readonly ILogger<GameHub> _logger;

    public GameHub(
        IGameBridge gameBridge,
        ConnectionRegistry connectionRegistry,
        RealtimeBroadcaster broadcaster,
        RealtimeCommandValidator commandValidator,
        ILogger<GameHub> logger)
    {
        _gameBridge = gameBridge;
        _connectionRegistry = connectionRegistry;
        _broadcaster = broadcaster;
        _commandValidator = commandValidator;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        try
        {
            // Temporary single-session membership; Application will own group assignment after lobby integration.
            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                RealtimeBroadcaster.ActiveGameGroup,
                Context.ConnectionAborted);
            _connectionRegistry.Register(Context.ConnectionId);

            await base.OnConnectedAsync();
        }
        catch (OperationCanceledException) when (Context.ConnectionAborted.IsCancellationRequested)
        {
            _connectionRegistry.Remove(Context.ConnectionId);
            throw;
        }
        catch (Exception exception)
        {
            _connectionRegistry.Remove(Context.ConnectionId);
            _logger.LogError(
                exception,
                "Unable to initialize realtime connection {ConnectionId}.",
                Context.ConnectionId);
            throw;
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _connectionRegistry.Remove(Context.ConnectionId);

        try
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, RealtimeBroadcaster.ActiveGameGroup);
        }
        catch (OperationCanceledException) when (Context.ConnectionAborted.IsCancellationRequested)
        {
        }
        catch (Exception cleanupException)
        {
            _logger.LogWarning(
                cleanupException,
                "Unable to remove realtime connection {ConnectionId} from the active group.",
                Context.ConnectionId);
        }
        finally
        {
            await base.OnDisconnectedAsync(exception);
        }
    }

    public async Task GetState()
    {
        try
        {
            var result = await _gameBridge.GetStateAsync(Context.ConnectionAborted);
            await SendEnvelopesAsync(result.Envelopes);
        }
        catch (OperationCanceledException) when (Context.ConnectionAborted.IsCancellationRequested)
        {
        }
        catch (Exception exception)
        {
            await HandleUnexpectedErrorAsync(exception);
        }
    }

    public async Task Dispatch(RealtimeCommand? command)
    {
        try
        {
            if (!_commandValidator.TryValidate(command, out var message))
            {
                await SendEnvelopesAsync([RealtimeErrorEnvelopeFactory.CreateActionRejected(message)]);
                return;
            }

            var result = await _gameBridge.DispatchAsync(command, Context.ConnectionAborted);
            await SendEnvelopesAsync(result.Envelopes);
        }
        catch (OperationCanceledException) when (Context.ConnectionAborted.IsCancellationRequested)
        {
        }
        catch (Exception exception)
        {
            await HandleUnexpectedErrorAsync(exception);
        }
    }

    private async Task SendEnvelopesAsync(IEnumerable<RealtimeEnvelope> envelopes)
    {
        foreach (var envelope in envelopes)
        {
            switch (envelope.Audience)
            {
                case RealtimeAudience.Caller:
                    await _broadcaster.SendToCallerAsync(
                        Context.ConnectionId,
                        envelope,
                        Context.ConnectionAborted);
                    break;

                case RealtimeAudience.GameGroup:
                    await _broadcaster.BroadcastToGameAsync(
                        envelope,
                        Context.ConnectionAborted);
                    break;

                default:
                    throw new InvalidOperationException(
                        $"Unsupported realtime audience: {envelope.Audience}.");
            }
        }
    }

    private async Task HandleUnexpectedErrorAsync(Exception exception)
    {
        _logger.LogError(
            exception,
            "Unable to process a realtime request for connection {ConnectionId}.",
            Context.ConnectionId);

        try
        {
            await _broadcaster.SendToCallerAsync(
                Context.ConnectionId,
                RealtimeErrorEnvelopeFactory.CreateInternalError(),
                CancellationToken.None);
        }
        catch (OperationCanceledException) when (Context.ConnectionAborted.IsCancellationRequested)
        {
        }
        catch (Exception notificationException)
        {
            _logger.LogError(
                notificationException,
                "Unable to send an internal-error envelope to connection {ConnectionId}.",
                Context.ConnectionId);
        }
    }
}
