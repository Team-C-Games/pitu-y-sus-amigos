namespace Laberinto.Domain.Game;

public sealed class Position : IEquatable<Position>
{
    public int Row { get; }
    public int Column { get; }

    public Position(int row, int column)
    {
        Row = row;
        Column = column;
    }

    public bool Equals(Position? other)
    {
        return other is not null && Row == other.Row && Column == other.Column;
    }

    public override bool Equals(object? obj)
    {
        return obj is Position other && Equals(other);
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(Row, Column);
    }
}
