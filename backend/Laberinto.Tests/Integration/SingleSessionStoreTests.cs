using Laberinto.Infrastructure.Persistence.InMemory;

namespace Laberinto.Tests.Integration;

public class SingleSessionStoreTests
{
    [Fact]
    public void A_new_store_is_empty()
    {
        var store = new SingleSessionStore<string>();

        var found = store.TryRead(value => value, out var value);

        Assert.False(found);
        Assert.Null(value);
    }

    [Fact]
    public void A_mutable_value_can_be_read_as_a_projection()
    {
        var store = new SingleSessionStore<MutableSession>();

        store.Set(new MutableSession { Value = 7 });

        var found = store.TryRead(session => session.Value, out var value);

        Assert.True(found);
        Assert.Equal(7, value);
    }

    [Fact]
    public void A_stored_value_can_be_cleared()
    {
        var store = new SingleSessionStore<string>();
        store.Set("session");

        store.Clear();

        Assert.False(store.TryRead(value => value, out _));
    }

    [Fact]
    public void Update_replaces_the_value_within_the_store()
    {
        var store = new SingleSessionStore<int>();
        store.Set(1);

        var updatedValue = store.Update(value => value + 1);

        Assert.Equal(2, updatedValue);
        Assert.True(store.TryRead(value => value, out var storedValue));
        Assert.Equal(2, storedValue);
    }

    [Fact]
    public void TryRead_returns_the_result_of_the_reader_for_an_existing_session()
    {
        var store = new SingleSessionStore<string>();
        store.Set("session");

        var found = store.TryRead(value => value.Length, out var length);

        Assert.True(found);
        Assert.Equal(7, length);
    }

    [Fact]
    public void Update_throws_when_the_store_is_empty()
    {
        var store = new SingleSessionStore<int>();

        Assert.Throws<InvalidOperationException>(() => store.Update(value => value + 1));
    }

    [Fact]
    public async Task Concurrent_updates_keep_the_stored_value_consistent()
    {
        var store = new SingleSessionStore<int>();
        store.Set(0);

        var updates = Enumerable.Range(0, 100)
            .Select(_ => Task.Run(() => store.Update(value => value + 1)));

        await Task.WhenAll(updates);

        Assert.True(store.TryRead(value => value, out var storedValue));
        Assert.Equal(100, storedValue);
    }

    private sealed class MutableSession
    {
        public int Value { get; set; }
    }
}
