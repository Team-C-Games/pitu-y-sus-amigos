namespace Laberinto.Domain.Game;

public static class StartingCornerRules
{
    private static readonly Position[] Corners =
    {
        new Position(0, 0),
        new Position(0, 5),
        new Position(5, 0),
        new Position(5, 5)
    };

    public static List<Position> AssignCorners(int playerCount)
    {
        if (playerCount == 2)
        {
            var pairs = new (Position, Position)[]
            {
                (Corners[0], Corners[3]),
                (Corners[1], Corners[2])
            };
            var chosen = pairs[Random.Shared.Next(pairs.Length)];
            return new List<Position> { chosen.Item1, chosen.Item2 };
        }

        return Corners.OrderBy(_ => Random.Shared.Next()).Take(playerCount).ToList();
    }
}