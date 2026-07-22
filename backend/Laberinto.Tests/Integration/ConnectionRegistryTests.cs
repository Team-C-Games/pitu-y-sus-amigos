using Laberinto.Api.Realtime;

namespace Laberinto.Tests.Integration;

public class ConnectionRegistryTests
{
    [Fact]
    public void A_connection_is_registered_once()
    {
        var registry = new ConnectionRegistry();

        var firstRegistration = registry.Register("connection-1");
        var secondRegistration = registry.Register("connection-1");

        Assert.True(firstRegistration);
        Assert.False(secondRegistration);
        Assert.True(registry.Contains("connection-1"));
        Assert.Equal(1, registry.Count);
    }

    [Fact]
    public void A_connection_can_be_removed()
    {
        var registry = new ConnectionRegistry();
        registry.Register("connection-1");

        var removed = registry.Remove("connection-1");

        Assert.True(removed);
        Assert.False(registry.Contains("connection-1"));
        Assert.Equal(0, registry.Count);
    }
}
