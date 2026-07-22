using Laberinto.Domain.Game;

namespace Laberinto.Domain.Board;

public sealed class Wall : IEquatable<Wall>
{
    public Wall(Position from, Position to)
    {
        ArgumentNullException.ThrowIfNull(from);
        ArgumentNullException.ThrowIfNull(to);

        if (Math.Abs(from.Row - to.Row) + Math.Abs(from.Column - to.Column) != 1)
        {
            throw new ArgumentException("A wall must separate two adjacent positions.", nameof(to));
        }

        From = from;
        To = to;
    }

    public Position From { get; }

    public Position To { get; }

    public bool Blocks(Position from, Position to)
    {
        return (From.Equals(from) && To.Equals(to)) ||
               (From.Equals(to) && To.Equals(from));
    }

    public bool Equals(Wall? other)
    {
        return other is not null && Blocks(other.From, other.To);
    }

    public override bool Equals(object? obj)
    {
        return obj is Wall other && Equals(other);
    }

    public override int GetHashCode()
    {
        return From.GetHashCode() ^ To.GetHashCode();
    }
}
