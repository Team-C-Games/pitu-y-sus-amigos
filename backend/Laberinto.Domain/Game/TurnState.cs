namespace Laberinto.Domain.Game;

public sealed class TurnState
{
    private readonly IReadOnlyList<Guid> _playerOrder;
    private int _currentPlayerIndex;

    public TurnPhase CurrentPhase { get; private set; }

    public TurnState(IEnumerable<Guid> playerOrder)
    {
        ArgumentNullException.ThrowIfNull(playerOrder);

        var configuredOrder = playerOrder.ToArray();
        if (configuredOrder.Length is < 2 or > 4)
        {
            throw new ArgumentOutOfRangeException(
                nameof(playerOrder),
                "A game requires between two and four players.");
        }

        if (configuredOrder.Any(playerId => playerId == Guid.Empty) ||
            configuredOrder.Distinct().Count() != configuredOrder.Length)
        {
            throw new ArgumentException(
                "Player order must contain unique, non-empty identifiers.",
                nameof(playerOrder));
        }

        _playerOrder = Array.AsReadOnly(configuredOrder);
        _currentPlayerIndex = 0;
        CurrentPhase = TurnPhase.WaitingForRoll;
    }

    public Guid CurrentPlayerId => _playerOrder[_currentPlayerIndex];

    public bool IsPlayerTurn(Guid playerId)
    {
        return CurrentPlayerId == playerId;
    }

    public void AdvancePhase(TurnPhase newPhase)
    {
        if (!Enum.IsDefined(newPhase))
        {
            throw new ArgumentOutOfRangeException(nameof(newPhase));
        }

        CurrentPhase = newPhase;
    }

    public void NextTurn()
    {
        _currentPlayerIndex = (_currentPlayerIndex + 1) % _playerOrder.Count;
        CurrentPhase = TurnPhase.WaitingForRoll;
    }
}
