using Laberinto.Domain.Board;

namespace Laberinto.Domain.Game;

public sealed class Player
{
    public Guid Id { get; }
    public string Name { get; }
    public PlayerColor Color { get; }
    public Position Position { get; private set; }
    public Position StartingPosition { get; }

    public Player(Guid id, string name, PlayerColor color, Position startingPosition)
    {
        if (id == Guid.Empty)
        {
            throw new ArgumentException("Player id cannot be empty.", nameof(id));
        }

        ArgumentException.ThrowIfNullOrWhiteSpace(name);
        ArgumentNullException.ThrowIfNull(startingPosition);

        if (!BoardDefinition.IsInside(startingPosition))
        {
            throw new ArgumentOutOfRangeException(
                nameof(startingPosition),
                "Player position must be inside the board.");
        }

        if (!Enum.IsDefined(color))
        {
            throw new ArgumentOutOfRangeException(nameof(color));
        }

        Id = id;
        Name = name.Trim();
        Color = color;
        StartingPosition = startingPosition;
        Position = startingPosition;
    }

    public void MoveTo(Position newPosition)
    {
        ArgumentNullException.ThrowIfNull(newPosition);

        if (!BoardDefinition.IsInside(newPosition))
        {
            throw new ArgumentOutOfRangeException(
                nameof(newPosition),
                "Player position must be inside the board.");
        }

        Position = newPosition;
    }

    public void ResetToStart()
    {
        Position = StartingPosition;
    }
}
