using Laberinto.Domain.Game;

namespace Laberinto.Tests.Domain;

public class TurnStateTests
{
    [Fact]
    public void Player_order_is_copied_and_turns_advance_in_sequence()
    {
        var firstPlayer = Guid.NewGuid();
        var secondPlayer = Guid.NewGuid();
        var playerOrder = new List<Guid> { firstPlayer, secondPlayer };
        var turn = new TurnState(playerOrder);

        playerOrder.Clear();
        turn.NextTurn();

        Assert.Equal(secondPlayer, turn.CurrentPlayerId);
        Assert.Equal(TurnPhase.WaitingForRoll, turn.CurrentPhase);
    }

    [Fact]
    public void Player_order_rejects_duplicates()
    {
        var playerId = Guid.NewGuid();

        Assert.Throws<ArgumentException>(() => new TurnState([playerId, playerId]));
    }
}
