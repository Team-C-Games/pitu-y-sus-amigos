namespace Laberinto.Domain.Game;

public class Player
{
    public Guid Id { get; }
    public string Name { get; }
    public PlayerColor Color { get; }
    public Position Position { get; private set; }
    public Position StartingPosition { get; }

    public Player(Guid id, string name, PlayerColor color, Position startingPosition)
    {
        Id = id;
        Name = name;
        Color = color;
        StartingPosition = startingPosition;
        Position = startingPosition;
    }

    public void MoveTo(Position newPosition)
    {
        Position = newPosition;
    }

    public void ResetToStart()
    {
        Position = StartingPosition;
    }
}