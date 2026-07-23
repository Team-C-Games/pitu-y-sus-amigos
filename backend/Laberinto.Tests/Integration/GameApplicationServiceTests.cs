using Laberinto.Application.Gameplay;
using Laberinto.Domain.Dice;
using Laberinto.Domain.Game;
using Laberinto.Infrastructure.Persistence.InMemory;

namespace Laberinto.Tests.Integration;

public class GameApplicationServiceTests
{
    [Fact]
    public void Lobby_can_be_created_configured_and_started_with_a_fixed_easy_board()
    {
        var games = CreateService();

        games.CreateGame("connection-a", "Ana");
        games.JoinGame("connection-b", "Beto");
        games.ChooseColor("connection-a", PlayerColor.Red);
        games.ChooseColor("connection-b", PlayerColor.Blue);
        games.Ready("connection-a");
        games.Ready("connection-b");

        var result = games.StartGame("connection-a");

        Assert.Equal("inprogress", result.State.Status);
        Assert.Equal(2, result.State.Players.Count);
        Assert.Equal(19, result.State.Walls.Count);
        Assert.Equal(24, result.State.Symbols.Count);
        Assert.NotNull(result.State.ActiveSymbolId);
        Assert.NotNull(result.State.CurrentPlayerId);
    }

    [Fact]
    public void A_connection_cannot_join_the_same_game_twice()
    {
        var games = CreateService();

        games.CreateGame("connection-a", "Ana");

        Assert.Throws<InvalidOperationException>(() => games.JoinGame("connection-a", "Ana again"));
    }

    [Fact]
    public void Spectator_cannot_execute_player_actions()
    {
        var games = CreateService();

        games.CreateGame("connection-a", "Ana");
        games.JoinGame("connection-b", "Beto");
        games.JoinGame("connection-c", "Caro");
        games.JoinGame("connection-d", "Dani");
        games.JoinGame("spectator", "Ignored while lobby is full");

        Assert.Throws<InvalidOperationException>(() => games.Ready("spectator"));
    }

    [Fact]
    public void Leaving_the_last_connection_cleans_the_single_session()
    {
        var games = CreateService();

        games.CreateGame("connection-a", "Ana");
        var result = games.LeaveGame("connection-a");

        Assert.Equal("none", result.State.Status);
    }

    [Fact]
    public void A_player_can_resume_after_a_realtime_reconnection()
    {
        var games = CreateService();
        games.CreateGame("connection-a", "Ana");
        var playerId = games.GetPlayerId("connection-a");

        games.Disconnected("connection-a");
        games.ResumePlayer("connection-a-reconnected", playerId);

        games.ChooseColor("connection-a-reconnected", PlayerColor.Red);
        Assert.Throws<InvalidOperationException>(() => games.ChooseColor("connection-a", PlayerColor.Blue));
    }

    private static GameApplicationService CreateService()
    {
        return new GameApplicationService(new InMemoryGameRepository(), new FixedDiceRoller());
    }

    private sealed class FixedDiceRoller : IDiceRoller
    {
        public int Roll() => 2;
    }
}
