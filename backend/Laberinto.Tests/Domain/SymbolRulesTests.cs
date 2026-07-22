using Laberinto.Domain.Game;
using Laberinto.Domain.Rules;

namespace Laberinto.Tests.Domain;

public class SymbolRulesTests
{
    [Fact]
    public void Player_reaches_the_symbol_only_at_the_same_position()
    {
        var symbolPosition = new Position(2, 3);

        Assert.True(SymbolRules.HasReachedActiveSymbol(new Position(2, 3), symbolPosition));
        Assert.False(SymbolRules.HasReachedActiveSymbol(new Position(2, 4), symbolPosition));
    }

    [Fact]
    public void Collector_is_the_player_with_the_earliest_arrival_order()
    {
        var firstPlayer = Guid.NewGuid();
        var secondPlayer = Guid.NewGuid();

        var collector = SymbolRules.ResolveCollector(
            new Dictionary<Guid, int>
            {
                [firstPlayer] = 3,
                [secondPlayer] = 1
            });

        Assert.Equal(secondPlayer, collector);
    }
}
