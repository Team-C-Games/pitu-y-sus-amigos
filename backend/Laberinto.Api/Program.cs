using Laberinto.Api.Endpoints;
using Laberinto.Api.Hubs;
using Laberinto.Api.Realtime;
using Laberinto.Infrastructure.Persistence.InMemory;

const string ConfiguredCorsPolicy = "ConfiguredCors";

var builder = WebApplication.CreateBuilder(args);

var corsOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>()?
    .Where(origin => !string.IsNullOrWhiteSpace(origin))
    .ToArray() ?? [];

if (corsOrigins.Length == 0)
{
    corsOrigins = ["http://localhost:4200"];
}

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSignalR();

builder.Services.AddCors(options => options.AddPolicy(
    ConfiguredCorsPolicy,
    policy => policy
        .WithOrigins(corsOrigins)
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()));

builder.Services.AddSingleton<ConnectionRegistry>();
builder.Services.AddSingleton<RealtimeBroadcaster>();
builder.Services.AddSingleton<RealtimeCommandValidator>();
builder.Services.AddSingleton(typeof(SingleSessionStore<>));

var gameBridgeMode = builder.Services.AddGameBridge(
    builder.Configuration,
    builder.Environment);

var app = builder.Build();

app.Logger.LogInformation("Game bridge mode: {Mode}", gameBridgeMode);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors(ConfiguredCorsPolicy);

app.MapHub<GameHub>("/hubs/game");
app.MapHealthEndpoints();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

public partial class Program
{
}
