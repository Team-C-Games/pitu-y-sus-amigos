using System.Text.Json;

namespace Laberinto.Api.Realtime.Mocks;

public static class MockGameScenarioFactory
{
    private static readonly JsonSerializerOptions SerializerOptions =
        new(JsonSerializerDefaults.Web);

    public static JsonElement CreateStatePayload()
    {
        var state = new MockGameState
        {
            GameId = "mock-game",
            Status = "demo",
            CurrentPlayerId = "mock-player-1",
            RemainingSteps = 0,
            ActiveSymbolId = "mock-symbol-1",
            Players =
            [
                new MockPlayerState
                {
                    PlayerId = "mock-player-1",
                    Name = "Demo Player",
                    Color = "blue",
                    Row = 0,
                    Column = 0,
                    Points = 0
                }
            ]
        };

        return JsonSerializer.SerializeToElement(
            state,
            SerializerOptions);
    }
}
