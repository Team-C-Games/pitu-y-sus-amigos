namespace Laberinto.Domain.Game;

public static class SymbolRules
{
    public static bool HasReachedActiveSymbol(Position playerPosition, Position activeSymbolPosition)
    {
        return playerPosition.Equals(activeSymbolPosition);
    }

    public static Guid ResolveCollector(IReadOnlyDictionary<Guid, int> arrivalOrderByPlayer)
    {
        return arrivalOrderByPlayer.OrderBy(kv => kv.Value).First().Key;
    }
}