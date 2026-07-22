using Laberinto.Domain.Game;

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

    public static BoardDefinition CreateDefault()
    {
        return Create(CreateFixedWalls());
    }

    private static IEnumerable<Wall> CreateFixedWalls()
    {
        return new[]
        {
            new Wall(new Position(0, 1), new Position(0, 2)),
            new Wall(new Position(0, 3), new Position(0, 4)),
            new Wall(new Position(1, 0), new Position(1, 1)),
            new Wall(new Position(1, 2), new Position(1, 3)),
            new Wall(new Position(1, 4), new Position(1, 5)),
            new Wall(new Position(2, 1), new Position(2, 2)),
            new Wall(new Position(2, 3), new Position(2, 4)),
            new Wall(new Position(3, 0), new Position(3, 1)),
            new Wall(new Position(3, 2), new Position(3, 3)),
            new Wall(new Position(3, 4), new Position(3, 5)),
            new Wall(new Position(4, 1), new Position(4, 2)),
            new Wall(new Position(4, 3), new Position(4, 4)),
            new Wall(new Position(0, 2), new Position(1, 2)),
            new Wall(new Position(1, 3), new Position(2, 3)),
            new Wall(new Position(2, 0), new Position(3, 0)),
            new Wall(new Position(2, 4), new Position(3, 4)),
            new Wall(new Position(3, 1), new Position(4, 1)),
            new Wall(new Position(4, 2), new Position(5, 2)),
            new Wall(new Position(4, 4), new Position(5, 4)),
        };
    }
}