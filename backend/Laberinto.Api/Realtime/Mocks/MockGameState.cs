namespace Laberinto.Api.Realtime.Mocks;

public class MockGameState
{
    public string Mode { get; set; } = "mock";
    public string GameId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string CurrentPlayerId { get; set; } = string.Empty;
    public int RemainingSteps { get; set; }
    public string ActiveSymbolId { get; set; } = string.Empty;
    public MockPlayerState[] Players { get; set; } = [];
}
