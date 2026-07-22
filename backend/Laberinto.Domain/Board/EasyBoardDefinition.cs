namespace Laberinto.Domain.Board;

public static class EasyBoardDefinition
{
    public const int RequiredWallCount = 19;

    public static BoardDefinition Create(IEnumerable<Wall> walls)
    {
        ArgumentNullException.ThrowIfNull(walls);

        var configuredWalls = walls.ToArray();
        if (configuredWalls.Length != RequiredWallCount)
        {
            throw new ArgumentException(
                $"Easy mode requires exactly {RequiredWallCount} fixed walls.",
                nameof(walls));
        }

        return new BoardDefinition(configuredWalls);
    }
}
