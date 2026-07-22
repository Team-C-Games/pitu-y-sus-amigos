using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Laberinto.Api.Realtime;

public static class GameBridgeServiceCollectionExtensions
{
    public static GameBridgeMode AddGameBridge(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        ArgumentNullException.ThrowIfNull(services);
        ArgumentNullException.ThrowIfNull(configuration);
        ArgumentNullException.ThrowIfNull(environment);

        var mode = GetMode(configuration);

        if (mode == GameBridgeMode.Mock && !environment.IsDevelopment())
        {
            throw new InvalidOperationException(
                "GameBridge:Mode=Mock is only allowed in the Development environment.");
        }

        if (mode == GameBridgeMode.Mock)
        {
            services.AddSingleton<IGameBridge, MockGameBridge>();
        }
        else
        {
            services.AddSingleton<IGameBridge, UnavailableRealGameBridge>();
        }

        return mode;
    }

    private static GameBridgeMode GetMode(IConfiguration configuration)
    {
        var configuredMode = configuration[$"{GameBridgeOptions.SectionName}:Mode"];

        if (string.IsNullOrWhiteSpace(configuredMode) ||
            string.Equals(configuredMode, nameof(GameBridgeMode.Real), StringComparison.OrdinalIgnoreCase))
        {
            return GameBridgeMode.Real;
        }

        if (string.Equals(configuredMode, nameof(GameBridgeMode.Mock), StringComparison.OrdinalIgnoreCase))
        {
            return GameBridgeMode.Mock;
        }

        throw new InvalidOperationException(
            "GameBridge:Mode must be either 'Real' or 'Mock'.");
    }
}
