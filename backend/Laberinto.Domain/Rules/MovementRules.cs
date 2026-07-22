using Laberinto.Domain.Board;
using Laberinto.Domain.Game;

namespace Laberinto.Domain.Rules;

public static class MovementRules
{
    public static MoveResult ExecutePath(
        BoardDefinition board,
        Position from,
        Position startingCorner,
        IReadOnlyList<Direction> path,
        out Position finalPosition)
    {
        ArgumentNullException.ThrowIfNull(board);
        ArgumentNullException.ThrowIfNull(from);
        ArgumentNullException.ThrowIfNull(startingCorner);
        ArgumentNullException.ThrowIfNull(path);

        if (!BoardDefinition.IsInside(from))
        {
            throw new ArgumentOutOfRangeException(nameof(from), "Movement position must be inside the board.");
        }

        if (!BoardDefinition.IsInside(startingCorner))
        {
            throw new ArgumentOutOfRangeException(
                nameof(startingCorner),
                "Starting corner must be inside the board.");
        }

        var visited = new HashSet<Position> { from };
        var current = from;

        foreach (var direction in path)
        {
            var next = GetNextPosition(current, direction);

            if (visited.Contains(next))
                throw new InvalidMoveException("No se puede retroceder sobre una casilla ya recorrida en este turno.");

            if (board.IsBlocking(current, next))
            {
                finalPosition = startingCorner;
                return MoveResult.BlockedByWall;
            }

            current = next;
            visited.Add(current);
        }

        finalPosition = current;
        return MoveResult.Success;
    }

    private static Position GetNextPosition(Position from, Direction direction)
    {
        return direction switch
        {
            Direction.Up => new Position(from.Row - 1, from.Column),
            Direction.Down => new Position(from.Row + 1, from.Column),
            Direction.Left => new Position(from.Row, from.Column - 1),
            Direction.Right => new Position(from.Row, from.Column + 1),
            _ => throw new ArgumentOutOfRangeException(nameof(direction))
        };
    }
}

public class InvalidMoveException : Exception
{
    public InvalidMoveException(string message) : base(message) { }
}
