using Laberinto.Domain.Board;
using Laberinto.Domain.Game;
using Laberinto.Domain.Rules;

namespace Laberinto.Tests.Domain;

public class MovementRulesTests
{
    [Fact]
    public void Path_moves_through_open_adjacent_positions()
    {
        var board = new BoardDefinition([]);

        var result = MovementRules.ExecutePath(
            board,
            new Position(0, 0),
            new Position(0, 0),
            [Direction.Right, Direction.Down],
            out var finalPosition);

        Assert.Equal(MoveResult.Success, result);
        Assert.Equal(new Position(1, 1), finalPosition);
    }

    [Fact]
    public void Wall_collision_returns_the_player_to_the_starting_corner()
    {
        var board = new BoardDefinition(
            [new Wall(new Position(0, 0), new Position(0, 1))]);
        var startingCorner = new Position(5, 5);

        var result = MovementRules.ExecutePath(
            board,
            new Position(0, 0),
            startingCorner,
            [Direction.Right],
            out var finalPosition);

        Assert.Equal(MoveResult.BlockedByWall, result);
        Assert.Equal(startingCorner, finalPosition);
    }

    [Fact]
    public void Path_cannot_return_to_a_position_visited_during_the_turn()
    {
        var board = new BoardDefinition([]);

        Assert.Throws<InvalidMoveException>(() => MovementRules.ExecutePath(
            board,
            new Position(0, 0),
            new Position(0, 0),
            [Direction.Right, Direction.Left],
            out _));
    }
}
