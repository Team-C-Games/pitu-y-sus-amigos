using System.Collections.Concurrent;

namespace Laberinto.Api.Realtime;

public class ConnectionRegistry
{
    private readonly ConcurrentDictionary<string, byte> _connectionIds = new();

    public bool Register(string connectionId)
    {
        return _connectionIds.TryAdd(connectionId, 0);
    }

    public bool Remove(string connectionId)
    {
        return _connectionIds.TryRemove(connectionId, out _);
    }

    public bool Contains(string connectionId)
    {
        return _connectionIds.ContainsKey(connectionId);
    }

    public int Count => _connectionIds.Count;
}
