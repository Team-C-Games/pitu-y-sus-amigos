using System.Diagnostics.CodeAnalysis;

namespace Laberinto.Infrastructure.Persistence.InMemory;

public class SingleSessionStore<T>
{
    private readonly object _sync = new();
    private T? _value;
    private bool _hasValue;

    public bool TryRead<TResult>(
        Func<T, TResult> read,
        [MaybeNullWhen(false)] out TResult result)
    {
        ArgumentNullException.ThrowIfNull(read);

        lock (_sync)
        {
            if (_hasValue)
            {
                result = read(_value!);
                return true;
            }

            result = default!;
            return false;
        }
    }

    public void Set(T value)
    {
        ArgumentNullException.ThrowIfNull(value);

        lock (_sync)
        {
            _value = value;
            _hasValue = true;
        }
    }

    public void Clear()
    {
        lock (_sync)
        {
            _value = default;
            _hasValue = false;
        }
    }

    public T Update(Func<T, T> update)
    {
        ArgumentNullException.ThrowIfNull(update);

        lock (_sync)
        {
            if (!_hasValue)
            {
                throw new InvalidOperationException("A session must be stored before it can be updated.");
            }

            var updatedValue = update(_value!);
            ArgumentNullException.ThrowIfNull(updatedValue);
            _value = updatedValue;
            return updatedValue;
        }
    }
}
