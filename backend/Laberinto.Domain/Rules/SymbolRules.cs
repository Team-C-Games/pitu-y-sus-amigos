using Laberinto.Domain.Game;

namespace Laberinto.Domain.Rules;

public static class SymbolRules
{
    public static bool HasReachedActiveSymbol(Position playerPosition, Position activeSymbolPosition)
    {
        ArgumentNullException.ThrowIfNull(playerPosition);
        ArgumentNullException.ThrowIfNull(activeSymbolPosition);

        return playerPosition.Equals(activeSymbolPosition);
    }

    public static Guid ResolveCollector(IReadOnlyDictionary<Guid, int> arrivalOrderByPlayer)
    {
        ArgumentNullException.ThrowIfNull(arrivalOrderByPlayer);

        if (arrivalOrderByPlayer.Count == 0)
        {
            throw new ArgumentException("At least one player arrival is required.", nameof(arrivalOrderByPlayer));
        }

        if (arrivalOrderByPlayer.Keys.Any(playerId => playerId == Guid.Empty) ||
            arrivalOrderByPlayer.Values.Any(order => order < 0) ||
            arrivalOrderByPlayer.Values.Distinct().Count() != arrivalOrderByPlayer.Count)
        {
            throw new ArgumentException(
                "Arrival order must contain unique, non-negative values for valid players.",
                nameof(arrivalOrderByPlayer));
        }

        return arrivalOrderByPlayer.OrderBy(kv => kv.Value).First().Key;
    }
}
