using System.Text.Json;
using Laberinto.Api.Realtime;

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
}
