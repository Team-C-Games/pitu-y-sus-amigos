using Laberinto.Domain.Dice;
using Laberinto.Domain.Game;

namespace Laberinto.Tests.Domain;

public class GameTests
{
    [Fact]
    public void Colors_must_be_reserved_in_join_order()
    {
        var game = new Game(new Random(11));
        var firstPlayer = game.AddPlayer(Guid.NewGuid(), "Ana");
        var secondPlayer = game.AddPlayer(Guid.NewGuid(), "Beto");

        Assert.Throws<InvalidOperationException>(() => game.ChooseColor(secondPlayer.Id, PlayerColor.Blue));

        game.ChooseColor(firstPlayer.Id, PlayerColor.Red);
        game.ChooseColor(secondPlayer.Id, PlayerColor.Blue);

        Assert.Equal(PlayerColor.Red, firstPlayer.Color);
        Assert.Equal(PlayerColor.Blue, secondPlayer.Color);
    }

    [Fact]
    public void Starting_a_two_player_game_assigns_opposite_corners_and_keeps_join_turn_order()
    {
        var game = ReadyTwoPlayerGame();
        var players = game.Players;

        game.Start();

        Assert.Equal(GameStatus.InProgress, game.Status);
        Assert.NotNull(game.ActiveSymbol);
        Assert.NotNull(game.Turn);
        Assert.Equal(players[0].Id, game.Turn!.CurrentPlayerId);
        Assert.Equal(5, Math.Abs(players[0].StartingPosition.Row - players[1].StartingPosition.Row));
        Assert.Equal(5, Math.Abs(players[0].StartingPosition.Column - players[1].StartingPosition.Column));
    }

    [Fact]
    public void Current_player_can_stop_without_spending_all_dice_steps()
    {
        var game = ReadyTwoPlayerGame();
        game.Start();
        var currentPlayerId = game.Turn!.CurrentPlayerId;

        game.Roll(currentPlayerId, new FixedDiceRoller(4));
        var outcome = game.Move(currentPlayerId, []);

        Assert.Equal(MoveResult.Success, outcome.Result);
        Assert.Equal(4, game.RemainingSteps);

        game.EndTurn(currentPlayerId);

        Assert.Equal(0, game.RemainingSteps);
        Assert.Equal(TurnPhase.WaitingForRoll, game.Turn.CurrentPhase);
        Assert.NotEqual(currentPlayerId, game.Turn.CurrentPlayerId);
    }

    [Fact]
    public void Only_the_current_player_can_roll_or_end_a_turn()
    {
        var game = ReadyTwoPlayerGame();
        game.Start();
        var nonCurrentPlayerId = game.Players.Single(player => player.Id != game.Turn!.CurrentPlayerId).Id;

        Assert.Throws<InvalidOperationException>(() => game.Roll(nonCurrentPlayerId, new FixedDiceRoller(1)));
        Assert.Throws<InvalidOperationException>(() => game.EndTurn(nonCurrentPlayerId));
    }

    private static Game ReadyTwoPlayerGame()
    {
        var game = new Game(new Random(42));
        var first = game.AddPlayer(Guid.NewGuid(), "Ana");
        var second = game.AddPlayer(Guid.NewGuid(), "Beto");
        game.ChooseColor(first.Id, PlayerColor.Red);
        game.ChooseColor(second.Id, PlayerColor.Blue);
        game.MarkReady(first.Id);
        game.MarkReady(second.Id);
        return game;
    }

    private sealed class FixedDiceRoller : IDiceRoller
    {
        private readonly int _value;

        public FixedDiceRoller(int value)
        {
            _value = value;
        }

        public int Roll() => _value;
    }
}
