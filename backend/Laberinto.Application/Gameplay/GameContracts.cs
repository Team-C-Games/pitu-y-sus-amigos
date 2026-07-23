using Laberinto.Domain.Board;
using Laberinto.Domain.Dice;
using Laberinto.Domain.Game;

namespace Laberinto.Application.Gameplay;

public interface IGameRepository
{
    T Execute<T>(Func<GameSession?, RepositoryOperation<T>> operation);
}

public sealed record RepositoryOperation<T>(GameSession? Session, T Result);

public sealed class GameSession
{
    public GameSession(Game game)
    {
        Game = game;
    }

    public Game Game { get; }
    public Dictionary<string, Guid> PlayerByConnection { get; } = new(StringComparer.Ordinal);
    public HashSet<string> Connections { get; } = new(StringComparer.Ordinal);
}

public sealed record GamePlayerDto(
    string PlayerId,
    string Name,
    string? Color,
    int Row,
    int Column,
    int Points,
    bool IsReady,
    bool IsCurrentPlayer);

public sealed record GameWallDto(int FromRow, int FromColumn, int ToRow, int ToColumn);

public sealed record GameStateDto(
    string Status,
    IReadOnlyList<GamePlayerDto> Players,
    string? CurrentPlayerId,
    string? ActiveSymbolId,
    int RemainingSteps,
    string? WinnerPlayerId,
    IReadOnlyList<GameWallDto> Walls,
    IReadOnlyDictionary<string, PositionDto> Symbols);

public sealed record PositionDto(int Row, int Column);

public sealed record GameActionResult(GameStateDto State, GameWallDto? HitWall, bool Finished);

public sealed class GameApplicationService
{
    private readonly IGameRepository _repository;
    private readonly IDiceRoller _diceRoller;

    public GameApplicationService(IGameRepository repository, IDiceRoller diceRoller)
    {
        _repository = repository;
        _diceRoller = diceRoller;
    }

    public GameActionResult GetState(string connectionId)
    {
        return _repository.Execute(session => new RepositoryOperation<GameActionResult>(
            session,
            new GameActionResult(CreateState(session?.Game), null, false)));
    }

    public GameActionResult CreateGame(string connectionId, string name)
    {
        return _repository.Execute(existing =>
        {
            if (existing is not null)
            {
                throw new InvalidOperationException("An active game already exists.");
            }

            var game = new Game();
            var session = new GameSession(game);
            AddPlayer(session, connectionId, name);
            return new RepositoryOperation<GameActionResult>(session, new GameActionResult(CreateState(game), null, false));
        });
    }

    public GameActionResult JoinGame(string connectionId, string name)
    {
        return _repository.Execute(session =>
        {
            if (session is null)
            {
                throw new InvalidOperationException("There is no game to join.");
            }

            if (session.PlayerByConnection.ContainsKey(connectionId))
            {
                throw new InvalidOperationException("This connection has already joined the game.");
            }

            session.Connections.Add(connectionId);
            if (session.Game.Status == GameStatus.Lobby && session.Game.Players.Count < 4)
            {
                AddPlayer(session, connectionId, name);
            }

            return new RepositoryOperation<GameActionResult>(session, new GameActionResult(CreateState(session.Game), null, false));
        });
    }

    public GameActionResult ChooseColor(string connectionId, PlayerColor color) => Mutate(connectionId, (game, playerId) =>
    {
        game.ChooseColor(playerId, color);
        return null;
    });

    public GameActionResult Ready(string connectionId) => Mutate(connectionId, (game, playerId) =>
    {
        game.MarkReady(playerId);
        return null;
    });

    public GameActionResult StartGame(string connectionId) => Mutate(connectionId, (game, playerId) =>
    {
        if (!game.Players.Any(player => player.Id == playerId && player.IsReady))
        {
            throw new InvalidOperationException("Only a ready player can start the game.");
        }

        game.Start();
        return null;
    });

    public GameActionResult RollDice(string connectionId) => Mutate(connectionId, (game, playerId) =>
    {
        game.Roll(playerId, _diceRoller);
        return null;
    });

    public GameActionResult Move(string connectionId, IReadOnlyList<Direction> path) => Mutate(connectionId, (game, playerId) => game.Move(playerId, path).HitWallDefinition);

    public GameActionResult EndTurn(string connectionId) => Mutate(connectionId, (game, playerId) =>
    {
        game.EndTurn(playerId);
        return null;
    });

    public GameActionResult ResumePlayer(string connectionId, Guid playerId)
    {
        return _repository.Execute(session =>
        {
            var current = session ?? throw new InvalidOperationException("There is no active game to resume.");
            if (!current.Game.Players.Any(player => player.Id == playerId))
            {
                throw new InvalidOperationException("The saved player session is no longer available.");
            }

            foreach (var staleConnection in current.PlayerByConnection
                         .Where(pair => pair.Value == playerId)
                         .Select(pair => pair.Key)
                         .ToArray())
            {
                current.PlayerByConnection.Remove(staleConnection);
                current.Connections.Remove(staleConnection);
            }

            current.PlayerByConnection[connectionId] = playerId;
            current.Connections.Add(connectionId);
            return new RepositoryOperation<GameActionResult>(
                current,
                new GameActionResult(CreateState(current.Game), null, false));
        });
    }

    public GameActionResult RestartGame()
    {
        return _repository.Execute(session => new RepositoryOperation<GameActionResult>(
            null,
            new GameActionResult(CreateState(null), null, false)));
    }

    public GameActionResult LeaveGame(string connectionId)
    {
        return _repository.Execute(session =>
        {
            if (session is null)
            {
                return new RepositoryOperation<GameActionResult>(null, new GameActionResult(CreateState(null), null, false));
            }

            session.Connections.Remove(connectionId);
            if (session.PlayerByConnection.Remove(connectionId, out var playerId))
            {
                session.Game.RemovePlayer(playerId);
            }

            var remaining = session.Connections.Count == 0 || session.Game.Players.Count == 0;
            return new RepositoryOperation<GameActionResult>(
                remaining ? null : session,
                new GameActionResult(CreateState(remaining ? null : session.Game), null, false));
        });
    }

    public void Connected(string connectionId)
    {
        _repository.Execute(session =>
        {
            session?.Connections.Add(connectionId);
            return new RepositoryOperation<bool>(session, true);
        });
    }

    public void Disconnected(string connectionId)
    {
        _repository.Execute(session =>
        {
            session?.Connections.Remove(connectionId);
            return new RepositoryOperation<bool>(session, true);
        });
    }

    public Guid GetPlayerId(string connectionId)
    {
        return _repository.Execute(session =>
        {
            var current = session ?? throw new InvalidOperationException("There is no active game.");
            if (!current.PlayerByConnection.TryGetValue(connectionId, out var playerId))
            {
                throw new InvalidOperationException("The connection is not assigned to a player.");
            }

            return new RepositoryOperation<Guid>(current, playerId);
        });
    }

    private GameActionResult Mutate(string connectionId, Func<Game, Guid, Wall?> action)
    {
        return _repository.Execute(session =>
        {
            var current = session ?? throw new InvalidOperationException("There is no active game.");
            if (!current.PlayerByConnection.TryGetValue(connectionId, out var playerId))
            {
                throw new InvalidOperationException("Spectators cannot perform player actions.");
            }

            var wall = action(current.Game, playerId);
            return new RepositoryOperation<GameActionResult>(
                current,
                new GameActionResult(CreateState(current.Game), wall is null ? null : ToWall(wall), current.Game.Status == GameStatus.Finished));
        });
    }

    private static void AddPlayer(GameSession session, string connectionId, string name)
    {
        var player = session.Game.AddPlayer(Guid.NewGuid(), name);
        session.PlayerByConnection[connectionId] = player.Id;
        session.Connections.Add(connectionId);
    }

    private static GameStateDto CreateState(Game? game)
    {
        if (game is null)
        {
            return new GameStateDto("none", [], null, null, 0, null, [], new Dictionary<string, PositionDto>());
        }

        var current = game.Turn?.CurrentPlayerId;
        var players = game.Players.Select(player => new GamePlayerDto(
            player.Id.ToString(),
            player.Name,
            player.Color?.ToString().ToLowerInvariant(),
            player.Position.Row,
            player.Position.Column,
            player.Points,
            player.IsReady,
            player.Id == current)).ToArray();
        var walls = game.Board.Walls.Select(ToWall).ToArray();
        var symbols = game.Board.SymbolPositions.ToDictionary(
            pair => pair.Key.ToString(),
            pair => new PositionDto(pair.Value.Row, pair.Value.Column));
        return new GameStateDto(
            game.Status.ToString().ToLowerInvariant(),
            players,
            current?.ToString(),
            game.ActiveSymbol?.ToString(),
            game.RemainingSteps,
            game.WinnerPlayerId?.ToString(),
            walls,
            symbols);
    }

    private static GameWallDto ToWall(Wall wall) => new(wall.From.Row, wall.From.Column, wall.To.Row, wall.To.Column);
}
