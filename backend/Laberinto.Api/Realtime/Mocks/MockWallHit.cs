namespace Laberinto.Api.Realtime.Mocks;

public class MockWallHit
{
    public string PlayerId { get; set; } = string.Empty;
    public int FromRow { get; set; }
    public int FromColumn { get; set; }
    public int ToRow { get; set; }
    public int ToColumn { get; set; }
}
