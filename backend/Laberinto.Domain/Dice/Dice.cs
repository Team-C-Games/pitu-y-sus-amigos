namespace Laberinto.Domain.Dice;

public interface IDiceRoller
{
    int Roll();
}

public sealed class Dice
{
    private readonly IDiceRoller _roller;

    public Dice(IDiceRoller roller)
    {
        _roller = roller ?? throw new ArgumentNullException(nameof(roller));
    }

    public int Roll()
    {
        var steps = _roller.Roll();
        if (steps is < 1 or > 4)
        {
            throw new InvalidOperationException("A dice roll must produce between one and four steps.");
        }

        return steps;
    }
}
