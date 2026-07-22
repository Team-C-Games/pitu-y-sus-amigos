using Laberinto.Domain.Game;

namespace Laberinto.Tests.Domain;

public class PositionTests
{
    [Fact]
    public void Positions_with_the_same_coordinates_are_equal()
    {
        var first = new Position(2, 3);
        var second = new Position(2, 3);

        Assert.Equal(first, second);
        Assert.Equal(first.GetHashCode(), second.GetHashCode());
    }
}
