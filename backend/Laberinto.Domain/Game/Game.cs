using Laberinto.Domain.Board;
using Laberinto.Domain.Dice;
using Laberinto.Domain.Rules;

namespace Laberinto.Domain.Game;

public sealed class Game
{
    public const int WinningPoints = 5;

    private readonly List<Player> _players = [];
    private readonly Random _random;
    private SymbolBag? _symbolBag;
    private long _arrivalSequence;

    public Game(Random? random = null)
    {
        _random = random ?? Random.Shared;
        Board = EasyBoardDefinition.CreateDefault();
        Status = GameStatus.Lobby;
    }

    public BoardDefinition Board { get; }
    public GameStatus Status { get; private set; }
    public IReadOnlyList<Player> Players => _players.AsReadOnly();
    public TurnState? Turn { get; private set; }
    public MagicSymbol? ActiveSymbol { get; private set; }
    public int RemainingSteps { get; private set; }
    public Guid? WinnerPlayerId { get; private set; }
    public Wall? LastHitWall { get; private set; }

    public Player AddPlayer(Guid playerId, string name)
    {
        EnsureStatus(GameStatus.Lobby);
        if (_players.Count == 4)
        {
            throw new InvalidOperationException("The game already has four players.");
        }

        if (_players.Any(player => player.Id == playerId))
        {
            throw new InvalidOperationException("The player is already in the game.");
        }

        var player = new Player(playerId, name, null, new Position(0, 0));
        _players.Add(player);
        return player;
    }

    public void ChooseColor(Guid playerId, PlayerColor color)
    {
        EnsureStatus(GameStatus.Lobby);
        var player = FindPlayer(playerId);
        var firstWithoutColor = _players.FirstOrDefault(existing => !existing.Color.HasValue);
        if (firstWithoutColor is not null && firstWithoutColor.Id != playerId)
        {
            throw new InvalidOperationException("Colors must be chosen in player join order.");
        }

        if (_players.Any(existing => existing.Id != playerId && existing.Color == color))
        {
            throw new InvalidOperationException("That color is already reserved.");
        }

        player.ChooseColor(color);
    }

    public void MarkReady(Guid playerId)
    {
        EnsureStatus(GameStatus.Lobby);
        var player = FindPlayer(playerId);
        if (!player.Color.HasValue)
        {
            throw new InvalidOperationException("Choose a color before marking ready.");
        }

        player.MarkReady();
    }

    public void Start()
    {
        EnsureStatus(GameStatus.Lobby);
        if (_players.Count is < 2 or > 4 || _players.Any(player => !player.IsReady || !player.Color.HasValue))
        {
            throw new InvalidOperationException("Two to four ready players with unique colors are required.");
        }

        var corners = StartingCornerRules.AssignCorners(_players.Count, _random);
        for (var index = 0; index < _players.Count; index++)
        {
            _players[index].SetStartingPosition(corners[index], ++_arrivalSequence);
        }

        // The join order is also the agreed turn order. Corner assignment is
        // random, but it must not silently reshuffle turns.
        Turn = new TurnState(_players.Select(player => player.Id));
        _symbolBag = new SymbolBag(Board, _random);
        ActiveSymbol = _symbolBag.Draw();
        Status = GameStatus.InProgress;
        ResolveActiveSymbol();
    }

    public int Roll(Guid playerId, IDiceRoller roller)
    {
        EnsureCurrentPlayer(playerId, TurnPhase.WaitingForRoll);
        var value = new Laberinto.Domain.Dice.Dice(roller).Roll();
        RemainingSteps = value;
        Turn!.AdvancePhase(TurnPhase.Moving);
        return value;
    }

    public GameMoveOutcome Move(Guid playerId, IReadOnlyList<Direction> path)
    {
        EnsureCurrentPlayer(playerId, TurnPhase.Moving);
        ArgumentNullException.ThrowIfNull(path);
        if (path.Count > RemainingSteps)
        {
            throw new InvalidOperationException("The path exceeds the remaining dice steps.");
        }

        var player = FindPlayer(playerId);
        var result = MovementRules.ExecutePath(Board, player.Position, player.StartingPosition, path, out var finalPosition);
        if (result == MoveResult.BlockedByWall)
        {
            LastHitWall = FindWall(player.Position, path);
            player.ResetToStart();
            RemainingSteps = 0;
            CompleteTurn();
            return new GameMoveOutcome(result, true, false, LastHitWall);
        }

        player.MoveTo(finalPosition);
        if (path.Count > 0)
        {
            player.SetArrivalOrder(++_arrivalSequence);
        }

        RemainingSteps -= path.Count;
        var collected = ResolveActiveSymbol();
        if (collected || Status == GameStatus.Finished)
        {
            RemainingSteps = 0;
            CompleteTurn();
        }

        return new GameMoveOutcome(result, false, collected, null);
    }

    public void EndTurn(Guid playerId)
    {
        EnsureCurrentPlayer(playerId, TurnPhase.Moving);
        RemainingSteps = 0;
        CompleteTurn();
    }

    public bool RemovePlayer(Guid playerId)
    {
        var player = _players.SingleOrDefault(candidate => candidate.Id == playerId);
        if (player is null)
        {
            return false;
        }

        _players.Remove(player);
        return _players.Count == 0;
    }

    private bool ResolveActiveSymbol()
    {
        var collected = false;
        while (Status == GameStatus.InProgress && ActiveSymbol.HasValue)
        {
            var target = Board.GetSymbolPosition(ActiveSymbol.Value);
            var collector = _players
                .Where(player => player.Position.Equals(target))
                .OrderBy(player => player.ArrivalOrder)
                .FirstOrDefault();

            if (collector is null)
            {
                return collected;
            }

            collector.AddPoint();
            collected = true;
            if (collector.Points >= WinningPoints)
            {
                WinnerPlayerId = collector.Id;
                Status = GameStatus.Finished;
                return true;
            }

            ActiveSymbol = _symbolBag!.RemainingCount > 0 ? _symbolBag.Draw() : null;
        }

        return collected;
    }

    private void CompleteTurn()
    {
        if (Status == GameStatus.InProgress)
        {
            Turn!.NextTurn();
        }
    }

    private void EnsureCurrentPlayer(Guid playerId, TurnPhase phase)
    {
        EnsureStatus(GameStatus.InProgress);
        if (Turn is null || !Turn.IsPlayerTurn(playerId) || Turn.CurrentPhase != phase)
        {
            throw new InvalidOperationException("This action is not available to the current player.");
        }
    }

    private void EnsureStatus(GameStatus expected)
    {
        if (Status != expected)
        {
            throw new InvalidOperationException($"The game must be {expected} for this action.");
        }
    }

    private Player FindPlayer(Guid playerId)
    {
        return _players.SingleOrDefault(player => player.Id == playerId)
            ?? throw new InvalidOperationException("The player is not part of this game.");
    }

    private Wall? FindWall(Position from, IReadOnlyList<Direction> path)
    {
        var current = from;
        foreach (var direction in path)
        {
            var next = direction switch
            {
                Direction.Up => new Position(current.Row - 1, current.Column),
                Direction.Down => new Position(current.Row + 1, current.Column),
                Direction.Left => new Position(current.Row, current.Column - 1),
                Direction.Right => new Position(current.Row, current.Column + 1),
                _ => throw new ArgumentOutOfRangeException(nameof(path))
            };

            if (!BoardDefinition.IsInside(next))
            {
                throw new InvalidMoveException("Movement cannot leave the board.");
            }

            var wall = Board.Walls.FirstOrDefault(candidate => candidate.Blocks(current, next));
            if (wall is not null)
            {
                return wall;
            }

            current = next;
        }

        return null;
    }
}

public sealed record GameMoveOutcome(MoveResult Result, bool HitWall, bool CollectedSymbol, Wall? HitWallDefinition);
