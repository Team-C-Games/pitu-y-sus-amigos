using Laberinto.Application.Gameplay;

namespace Laberinto.Infrastructure.Persistence.InMemory;

public sealed class InMemoryGameRepository : IGameRepository
{
    private readonly object _sync = new();
    private GameSession? _session;

    public T Execute<T>(Func<GameSession?, RepositoryOperation<T>> operation)
    {
        ArgumentNullException.ThrowIfNull(operation);

        lock (_sync)
        {
            var result = operation(_session);
            _session = result.Session;
            return result.Result;
        }
    }
}
