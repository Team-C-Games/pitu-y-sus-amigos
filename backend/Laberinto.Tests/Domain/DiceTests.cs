using Laberinto.Domain.Dice;
using GameDice = Laberinto.Domain.Dice.Dice;

namespace Laberinto.Tests.Domain;

public class DiceTests
{
    [Theory]
    [InlineData(1)]
    [InlineData(2)]
    [InlineData(3)]
    [InlineData(4)]
    public void Dice_returns_a_valid_number_of_steps(int steps)
    {
        var dice = new GameDice(new StubDiceRoller(steps));

        Assert.Equal(steps, dice.Roll());
    }

    [Theory]
    [InlineData(0)]
    [InlineData(5)]
    public void Dice_rejects_values_outside_its_faces(int steps)
    {
        var dice = new GameDice(new StubDiceRoller(steps));

        Assert.Throws<InvalidOperationException>(() => dice.Roll());
    }

    private sealed class StubDiceRoller : IDiceRoller
    {
        private readonly int _steps;

        public StubDiceRoller(int steps)
        {
            _steps = steps;
        }

        public int Roll()
        {
            return _steps;
        }
    }
}
