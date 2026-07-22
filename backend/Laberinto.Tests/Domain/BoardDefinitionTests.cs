using Laberinto.Domain.Board;

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
}
