using Laberinto.Infrastructure.Randomness;

namespace Laberinto.Tests.Integration;

public class RandomDiceRollerTests
{
    [Fact]
    public void Roller_only_returns_configured_dice_faces()
    {
        var roller = new RandomDiceRoller(new Random(1234));

        var rolls = Enumerable.Range(0, 100).Select(_ => roller.Roll()).ToArray();

        Assert.All(rolls, roll => Assert.Contains(roll, new[] { 1, 2, 3, 4 }));
        Assert.Contains(1, rolls);
        Assert.Contains(2, rolls);
        Assert.Contains(3, rolls);
        Assert.Contains(4, rolls);
    }
}
