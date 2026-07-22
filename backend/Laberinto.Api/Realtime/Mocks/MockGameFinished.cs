namespace Laberinto.Api.Realtime.Mocks;

public class MockGameFinished
{
    public string WinnerPlayerId { get; set; } = string.Empty;
    public string WinnerName { get; set; } = string.Empty;
    public int WinnerPoints { get; set; }
}
