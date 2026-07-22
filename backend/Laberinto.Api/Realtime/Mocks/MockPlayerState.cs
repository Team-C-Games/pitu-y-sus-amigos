namespace Laberinto.Api.Realtime.Mocks;

public class MockPlayerState
{
    public string PlayerId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int Row { get; set; }
    public int Column { get; set; }
    public int Points { get; set; }
}
