namespace Laberinto.Domain.Board;

public sealed class SymbolBag
{
    private readonly List<MagicSymbol> _remainingSymbols;
    private readonly Random _random;

    public SymbolBag(BoardDefinition board, Random? random = null)
    {
        ArgumentNullException.ThrowIfNull(board);

        _remainingSymbols = board.SymbolPositions.Keys.ToList();
        _random = random ?? Random.Shared;
    }

    public int RemainingCount => _remainingSymbols.Count;

    public MagicSymbol Draw()
    {
        if (_remainingSymbols.Count == 0)
        {
            throw new InvalidOperationException("The symbol bag is empty.");
        }

        var index = _random.Next(_remainingSymbols.Count);
        var symbol = _remainingSymbols[index];
        _remainingSymbols.RemoveAt(index);
        return symbol;
    }
}
