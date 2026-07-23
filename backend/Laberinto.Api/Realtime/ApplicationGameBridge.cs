using System.Text.Json;
using Laberinto.Application.Gameplay;
using Laberinto.Domain.Game;

namespace Laberinto.Api.Realtime;

public sealed class ApplicationGameBridge : IGameBridge
{
    private static readonly JsonSerializerOptions ClientJsonOptions = new(JsonSerializerDefaults.Web);
    private readonly GameApplicationService _games;

    public ApplicationGameBridge(GameApplicationService games)
    {
        _games = games;
    }

    public Task<BridgeResult> GetStateAsync(CancellationToken cancellationToken = default)
    {
        return GetStateAsync(string.Empty, cancellationToken);
    }

    public Task<BridgeResult> GetStateAsync(string connectionId, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return Task.FromResult(Result(_games.GetState(connectionId), RealtimeAudience.Caller));
    }

    public Task<BridgeResult> DispatchAsync(RealtimeCommand command, CancellationToken cancellationToken = default)
    {
        return DispatchAsync(string.Empty, command, cancellationToken);
    }

    public Task<BridgeResult> DispatchAsync(string connectionId, RealtimeCommand command, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        try
        {
            var commandName = command.Name.ToLowerInvariant();
            var action = commandName switch
            {
                "create-game" => _games.CreateGame(connectionId, RequiredString(command.Payload, "name")),
                "join-game" => _games.JoinGame(connectionId, RequiredString(command.Payload, "name")),
                "choose-color" => _games.ChooseColor(connectionId, ParseColor(RequiredString(command.Payload, "color"))),
                "ready" => _games.Ready(connectionId),
                "start-game" => _games.StartGame(connectionId),
                "roll-dice" => _games.RollDice(connectionId),
                "move" => _games.Move(connectionId, ParsePath(command.Payload)),
                "end-turn" => _games.EndTurn(connectionId),
                "resume-player" => _games.ResumePlayer(connectionId, ParsePlayerId(command.Payload)),
                "leave-game" => _games.LeaveGame(connectionId),
                "restart-game" => _games.RestartGame(),
                "get-state" => _games.GetState(connectionId),
                _ => throw new InvalidOperationException("Unknown game command.")
            };

            var result = Result(action, RealtimeAudience.GameGroup);
            if (commandName is "create-game" or "join-game")
            {
                var playerId = _games.GetPlayerId(connectionId);
                result = new BridgeResult(
                [
                    .. result.Envelopes,
                    Envelope("player-session", new { playerId }, RealtimeAudience.Caller)
                ]);
            }

            return Task.FromResult(result);
        }
        catch (InvalidOperationException exception)
        {
            return Task.FromResult(new BridgeResult([RealtimeErrorEnvelopeFactory.CreateActionRejected(exception.Message)]));
        }
        catch (ArgumentException exception)
        {
            return Task.FromResult(new BridgeResult([RealtimeErrorEnvelopeFactory.CreateActionRejected(exception.Message)]));
        }
    }

    public Task ConnectionOpenedAsync(string connectionId, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        _games.Connected(connectionId);
        return Task.CompletedTask;
    }

    public Task ConnectionClosedAsync(string connectionId, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        _games.Disconnected(connectionId);
        return Task.CompletedTask;
    }

    private static BridgeResult Result(GameActionResult action, RealtimeAudience audience)
    {
        var envelopes = new List<RealtimeEnvelope>
        {
            Envelope("game-state", action.State, audience)
        };
        if (action.HitWall is not null)
        {
            envelopes.Add(Envelope("wall-hit", new { wall = action.HitWall, durationMs = 1500 }, RealtimeAudience.GameGroup));
        }

        if (action.Finished)
        {
            envelopes.Add(Envelope("game-finished", new { winnerPlayerId = action.State.WinnerPlayerId }, RealtimeAudience.GameGroup));
        }

        return new BridgeResult(envelopes);
    }

    private static RealtimeEnvelope Envelope(string type, object payload, RealtimeAudience audience)
    {
        return new RealtimeEnvelope(
            type,
            JsonSerializer.SerializeToElement(payload, ClientJsonOptions),
            DateTimeOffset.UtcNow,
            audience);
    }

    private static string RequiredString(JsonElement payload, string property)
    {
        if (payload.ValueKind != JsonValueKind.Object || !payload.TryGetProperty(property, out var value) ||
            value.ValueKind != JsonValueKind.String || string.IsNullOrWhiteSpace(value.GetString()))
        {
            throw new ArgumentException($"'{property}' is required.");
        }

        return value.GetString()!;
    }

    private static PlayerColor ParseColor(string value)
    {
        return Enum.TryParse<PlayerColor>(value, true, out var color)
            ? color
            : throw new ArgumentException("The color is invalid.");
    }

    private static IReadOnlyList<Direction> ParsePath(JsonElement payload)
    {
        if (payload.ValueKind != JsonValueKind.Object || !payload.TryGetProperty("path", out var path) || path.ValueKind != JsonValueKind.Array)
        {
            throw new ArgumentException("'path' must be an array.");
        }

        return path.EnumerateArray().Select(value =>
        {
            if (value.ValueKind != JsonValueKind.String || !Enum.TryParse<Direction>(value.GetString(), true, out var direction))
            {
                throw new ArgumentException("The movement path contains an invalid direction.");
            }

            return direction;
        }).ToArray();
    }

    private static Guid ParsePlayerId(JsonElement payload)
    {
        var value = RequiredString(payload, "playerId");
        return Guid.TryParse(value, out var playerId)
            ? playerId
            : throw new ArgumentException("'playerId' is invalid.");
    }
}
