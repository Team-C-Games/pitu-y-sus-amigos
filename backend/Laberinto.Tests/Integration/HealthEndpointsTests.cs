using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Laberinto.Tests.Integration;

public class HealthEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public HealthEndpointsTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Get_health_returns_ok_status()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/health");
        var responseBody = await response.Content.ReadAsStringAsync();
        using var payload = JsonDocument.Parse(responseBody);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("ok", payload.RootElement.GetProperty("status").GetString());
    }
}
