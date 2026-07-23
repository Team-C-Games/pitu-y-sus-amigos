using Laberinto.Domain.Board;
using Laberinto.Domain.Game;

namespace Laberinto.Tests.Domain;

public class BoardDefinitionTests
{
    [Fact]
    public void Fixed_board_contains_exactly_24_symbols()
    {
        var board = new BoardDefinition([]);

        Assert.Equal(BoardDefinition.SymbolCount, board.SymbolPositions.Count);
        Assert.Equal(BoardDefinition.SymbolCount, Enum.GetValues<MagicSymbol>().Length);
        Assert.Equal(Enum.GetValues<MagicSymbol>(), board.SymbolPositions.Keys.OrderBy(symbol => symbol));
    }

    [Fact]
    public void Fixed_symbol_positions_are_unique_and_inside_the_6_by_6_board()
    {
        var board = new BoardDefinition([]);
        var positions = board.SymbolPositions.Values;

        Assert.Equal(BoardDefinition.SymbolCount, positions.Distinct().Count());
        Assert.All(positions, position => Assert.True(BoardDefinition.IsInside(position)));
    }

    [Fact]
    public void Easy_board_requires_exactly_19_walls()
    {
        var exception = Assert.Throws<ArgumentException>(() => EasyBoardDefinition.Create([]));

        Assert.Contains("19", exception.Message);
    }

    [Fact]
    public void Default_easy_board_has_19_valid_walls_and_every_cell_is_reachable()
    {
        var board = EasyBoardDefinition.CreateDefault();

        Assert.Equal(EasyBoardDefinition.RequiredWallCount, board.Walls.Count);
        Assert.Equal(board.Walls.Count, board.Walls.Distinct().Count());
        Assert.All(board.Walls, wall =>
        {
            Assert.True(BoardDefinition.IsInside(wall.From));
            Assert.True(BoardDefinition.IsInside(wall.To));
        });

        var reachable = ReachablePositions(board, new Position(0, 0));
        Assert.Equal(BoardDefinition.RowCount * BoardDefinition.ColumnCount, reachable.Count);
    }

    private static HashSet<Position> ReachablePositions(BoardDefinition board, Position start)
    {
        var reachable = new HashSet<Position> { start };
        var pending = new Queue<Position>([start]);
        var directions = new[] { (-1, 0), (1, 0), (0, -1), (0, 1) };

        while (pending.TryDequeue(out var current))
        {
            foreach (var (rowDelta, columnDelta) in directions)
            {
                var next = new Position(current.Row + rowDelta, current.Column + columnDelta);
                if (BoardDefinition.IsInside(next) && !board.IsBlocking(current, next) && reachable.Add(next))
                {
                    pending.Enqueue(next);
                }
            }
        }

        return reachable;
    }
}
