using Laberinto.Domain.Dice;

namespace Laberinto.Infrastructure.Randomness;

public sealed class RandomDiceRoller : IDiceRoller
{
    private static readonly int[] Faces = [1, 2, 2, 3, 3, 4];

    private readonly Random _random;
    private readonly object _sync = new();

    public RandomDiceRoller()
        : this(Random.Shared)
    {
    }

    public RandomDiceRoller(Random random)
    {
        _random = random ?? throw new ArgumentNullException(nameof(random));
    }

    public int Roll()
    {
        lock (_sync)
        {
            return Faces[_random.Next(Faces.Length)];
        }
    }
}
