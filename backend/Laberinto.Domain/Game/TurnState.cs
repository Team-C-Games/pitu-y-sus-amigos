namespace Laberinto.Domain.Game;

public class TurnState
{
    private readonly List<Guid> _playerOrder;
    private int _currentPlayerIndex;

    public TurnPhase CurrentPhase { get; private set; }

    public TurnState(List<Guid> playerOrder)
    {
        if (playerOrder == null || playerOrder.Count == 0)
            throw new ArgumentException("Debe haber al menos un jugador para iniciar el turno.");

        _playerOrder = playerOrder;
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
        CurrentPhase = newPhase;
    }

    public void NextTurn()
    {
        _currentPlayerIndex = (_currentPlayerIndex + 1) % _playerOrder.Count;
        CurrentPhase = TurnPhase.WaitingForRoll;
    }
}