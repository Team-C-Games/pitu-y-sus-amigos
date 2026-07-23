using Laberinto.Api.Realtime;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;

namespace Laberinto.Tests.Integration;

public class GameBridgeRegistrationTests
{
    [Fact]
    public void Missing_mode_defaults_to_the_application_real_bridge()
    {
        var services = new ServiceCollection();

        var mode = services.AddGameBridge(
            new ConfigurationBuilder().Build(),
            new TestHostEnvironment(Environments.Production));
        var bridge = services.BuildServiceProvider().GetRequiredService<IGameBridge>();

        Assert.Equal(GameBridgeMode.Real, mode);
        Assert.IsType<ApplicationGameBridge>(bridge);
    }

    [Fact]
    public void Mock_mode_registers_the_mock_bridge_in_development()
    {
        var services = new ServiceCollection();

        services.AddGameBridge(
            CreateConfiguration("Mock"),
            new TestHostEnvironment(Environments.Development));
        var bridge = services.BuildServiceProvider().GetRequiredService<IGameBridge>();

        Assert.IsType<MockGameBridge>(bridge);
    }

    [Fact]
    public void Real_mode_registers_the_application_real_bridge()
    {
        var services = new ServiceCollection();

        services.AddGameBridge(
            CreateConfiguration("Real"),
            new TestHostEnvironment(Environments.Production));
        var bridge = services.BuildServiceProvider().GetRequiredService<IGameBridge>();

        Assert.IsType<ApplicationGameBridge>(bridge);
    }

    [Fact]
    public void Mock_mode_fails_to_start_outside_development()
    {
        var services = new ServiceCollection();

        var exception = Assert.Throws<InvalidOperationException>(() => services.AddGameBridge(
            CreateConfiguration("Mock"),
            new TestHostEnvironment(Environments.Production)));

        Assert.Equal(
            "GameBridge:Mode=Mock is only allowed in the Development environment.",
            exception.Message);
    }

    [Fact]
    public void Unknown_mode_fails_with_a_clear_configuration_error()
    {
        var services = new ServiceCollection();

        var exception = Assert.Throws<InvalidOperationException>(() => services.AddGameBridge(
            CreateConfiguration("Unknown"),
            new TestHostEnvironment(Environments.Development)));

        Assert.Equal("GameBridge:Mode must be either 'Real' or 'Mock'.", exception.Message);
    }

    private static IConfiguration CreateConfiguration(string mode)
    {
        return new ConfigurationBuilder()
            .AddInMemoryCollection(
                new Dictionary<string, string?>
                {
                    [$"{GameBridgeOptions.SectionName}:Mode"] = mode
                })
            .Build();
    }

    private sealed class TestHostEnvironment : IHostEnvironment
    {
        public TestHostEnvironment(string environmentName)
        {
            EnvironmentName = environmentName;
        }

        public string EnvironmentName { get; set; }

        public string ApplicationName { get; set; } = "Laberinto.Tests";

        public string ContentRootPath { get; set; } = AppContext.BaseDirectory;

        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
    }
}
