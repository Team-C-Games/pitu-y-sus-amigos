using Laberinto.Domain.Rules;

namespace Laberinto.Tests.Domain;

public class StartingCornerRulesTests
{
    [Fact]
    public void Two_players_receive_opposite_corners()
    {
        var corners = StartingCornerRules.AssignCorners(2, new Random(1234));

        Assert.Equal(2, corners.Count);
        Assert.Equal(5, Math.Abs(corners[0].Row - corners[1].Row));
        Assert.Equal(5, Math.Abs(corners[0].Column - corners[1].Column));
    }

    [Theory]
    [InlineData(1)]
    [InlineData(5)]
    public void Player_count_must_be_between_two_and_four(int playerCount)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() =>
            StartingCornerRules.AssignCorners(playerCount, new Random(1234)));
    }
}
