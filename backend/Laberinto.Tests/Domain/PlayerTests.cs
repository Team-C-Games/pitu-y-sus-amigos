using Laberinto.Domain.Game;

namespace Laberinto.Tests.Domain;

public class PlayerTests
{
    [Fact]
    public void Player_position_must_remain_inside_the_board()
    {
        var player = new Player(
            Guid.NewGuid(),
            "Player",
            PlayerColor.Blue,
            new Position(0, 0));

        Assert.Throws<ArgumentOutOfRangeException>(() =>
            player.MoveTo(new Position(-1, 0)));
        Assert.Equal(new Position(0, 0), player.Position);
    }

    [Fact]
    public void Reset_returns_the_player_to_the_starting_position()
    {
        var player = new Player(
            Guid.NewGuid(),
            "Player",
            PlayerColor.Red,
            new Position(0, 0));
        player.MoveTo(new Position(1, 0));

        player.ResetToStart();

        Assert.Equal(new Position(0, 0), player.Position);
    }
}
