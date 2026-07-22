namespace Laberinto.Api.Realtime;

public class GameBridgeOptions
{
    public const string SectionName = "GameBridge";

    public GameBridgeMode Mode { get; set; } = GameBridgeMode.Real;
}

public enum GameBridgeMode
{
    Real,
    Mock
}
