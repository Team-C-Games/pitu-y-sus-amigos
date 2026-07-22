using Laberinto.Domain.Board;
using Laberinto.Domain.Game;

namespace Laberinto.Domain.Rules;

public static class StartingCornerRules
{
    private static readonly Position[] Corners =
    {
        new Position(0, 0),
        new Position(0, BoardDefinition.ColumnCount - 1),
        new Position(BoardDefinition.RowCount - 1, 0),
        new Position(BoardDefinition.RowCount - 1, BoardDefinition.ColumnCount - 1)
    };

    public static IReadOnlyList<Position> AssignCorners(int playerCount, Random? random = null)
    {
        if (playerCount is < 2 or > 4)
        {
            throw new ArgumentOutOfRangeException(nameof(playerCount), "A game requires between two and four players.");
        }

        random ??= Random.Shared;

        if (playerCount == 2)
        {
            var pairs = new (Position, Position)[]
            {
                (Corners[0], Corners[3]),
                (Corners[1], Corners[2])
            };
            var chosen = pairs[random.Next(pairs.Length)];
            return Array.AsReadOnly(new[] { chosen.Item1, chosen.Item2 });
        }

        var selectedCorners = Corners
            .OrderBy(_ => random.Next())
            .Take(playerCount)
            .ToArray();

        return Array.AsReadOnly(selectedCorners);
    }
}
