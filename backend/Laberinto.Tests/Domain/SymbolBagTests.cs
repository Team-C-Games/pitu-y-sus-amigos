using Laberinto.Domain.Board;

namespace Laberinto.Tests.Domain;

public class SymbolBagTests
{
    [Fact]
    public void Every_drawn_target_belongs_to_the_fixed_board_configuration()
    {
        var board = new BoardDefinition([]);
        var bag = new SymbolBag(board, new Random(1234));

        var targets = Enumerable.Range(0, BoardDefinition.SymbolCount)
            .Select(_ => bag.Draw())
            .ToArray();

        Assert.Equal(BoardDefinition.SymbolCount, targets.Distinct().Count());
        Assert.All(targets, symbol => Assert.True(board.ContainsSymbol(symbol)));
        Assert.Equal(0, bag.RemainingCount);
        Assert.Throws<InvalidOperationException>(() => bag.Draw());
    }
}
