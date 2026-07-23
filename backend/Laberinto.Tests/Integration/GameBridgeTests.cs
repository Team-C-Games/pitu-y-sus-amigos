using System.Text.Json;
using Laberinto.Api.Realtime;
using Laberinto.Application.Gameplay;
using Laberinto.Domain.Dice;
using Laberinto.Infrastructure.Persistence.InMemory;

namespace Laberinto.Tests.Integration;

public class GameBridgeTests
{
    [Fact]
    public async Task Mock_bridge_returns_state_to_the_caller()
    {
        var bridge = new MockGameBridge();

        var result = await bridge.GetStateAsync();

        var envelope = Assert.Single(result.Envelopes);
        Assert.Equal("state", envelope.Type);
        Assert.Equal(RealtimeAudience.Caller, envelope.Audience);
        Assert.Equal("mock", envelope.Payload.GetProperty("mode").GetString());
        Assert.Equal("mock-game", envelope.Payload.GetProperty("gameId").GetString());
        Assert.Equal("demo", envelope.Payload.GetProperty("status").GetString());

        var player = Assert.Single(envelope.Payload.GetProperty("players").EnumerateArray());
        Assert.Equal("mock-player-1", player.GetProperty("playerId").GetString());
        Assert.Equal("Demo Player", player.GetProperty("name").GetString());
    }

    [Fact]
    public async Task Mock_bridge_rejects_commands_for_the_caller()
    {
        var bridge = new MockGameBridge();
        var command = new RealtimeCommand
        {
            Name = "unknown",
            Payload = JsonSerializer.SerializeToElement(new { })
        };

        var result = await bridge.DispatchAsync(command);

        var envelope = Assert.Single(result.Envelopes);
        Assert.Equal("action-rejected", envelope.Type);
        Assert.Equal(RealtimeAudience.Caller, envelope.Audience);
    }

    [Fact]
    public async Task Unavailable_real_bridge_returns_not_ready_to_the_caller_for_state()
    {
        var bridge = new UnavailableRealGameBridge();

        var result = await bridge.GetStateAsync();

        var envelope = Assert.Single(result.Envelopes);
        Assert.Equal("not-ready", envelope.Type);
        Assert.Equal(RealtimeAudience.Caller, envelope.Audience);
    }

    [Fact]
    public async Task Unavailable_real_bridge_returns_not_ready_to_the_caller_for_commands()
    {
        var bridge = new UnavailableRealGameBridge();
        var command = new RealtimeCommand
        {
            Name = "request",
            Payload = JsonSerializer.SerializeToElement(new { })
        };

        var result = await bridge.DispatchAsync(command);

        var envelope = Assert.Single(result.Envelopes);
        Assert.Equal("not-ready", envelope.Type);
        Assert.Equal(RealtimeAudience.Caller, envelope.Audience);
    }

    [Fact]
    public async Task Real_bridge_serializes_game_state_payloads_with_web_casing()
    {
        var games = new GameApplicationService(new InMemoryGameRepository(), new FixedDiceRoller());
        var bridge = new ApplicationGameBridge(games);
        var create = new RealtimeCommand
        {
            Name = "create-game",
            Payload = JsonSerializer.SerializeToElement(new { name = "Ana" })
        };

        var result = await bridge.DispatchAsync("connection-a", create);

        var envelope = Assert.Single(result.Envelopes, candidate => candidate.Type == "game-state");
        Assert.Equal("game-state", envelope.Type);
        Assert.Equal("lobby", envelope.Payload.GetProperty("status").GetString());
        Assert.True(envelope.Payload.TryGetProperty("players", out _));
        Assert.False(envelope.Payload.TryGetProperty("Status", out _));

        var session = Assert.Single(result.Envelopes, candidate => candidate.Type == "player-session");
        Assert.Equal(RealtimeAudience.Caller, session.Audience);
        Assert.True(session.Payload.TryGetProperty("playerId", out _));
    }

    private sealed class FixedDiceRoller : IDiceRoller
    {
        public int Roll() => 2;
    }
}
