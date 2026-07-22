using Laberinto.Domain.Board;

namespace Laberinto.Domain.Game;

public interface IDiceRoller
{
    MagicSymbol Roll();
}

public class Dice
{
    private readonly IDiceRoller _roller;

    public Dice(IDiceRoller roller)
    {
        _roller = roller;
    }

    public MagicSymbol Roll()
    {
        return _roller.Roll();
    }
}