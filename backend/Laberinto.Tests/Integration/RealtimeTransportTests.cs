using System.Text.Json;
using Laberinto.Api.Realtime;

namespace Laberinto.Tests.Integration;

public class RealtimeTransportTests
{
    [Fact]
    public void The_client_event_name_is_game_event()
    {
        Assert.Equal("game-event", RealtimeBroadcaster.ClientEventName);
    }

    [Fact]
    public void An_envelope_keeps_its_audience_in_the_backend_but_hides_it_from_json()
    {
        var envelope = new RealtimeEnvelope(
            "state",
            JsonSerializer.SerializeToElement(new { }),
            DateTimeOffset.UtcNow,
            RealtimeAudience.GameGroup);

        var json = JsonSerializer.Serialize(envelope);
        using var document = JsonDocument.Parse(json);

        Assert.Equal(RealtimeAudience.GameGroup, envelope.Audience);
        Assert.DoesNotContain(
            document.RootElement.EnumerateObject(),
            property => string.Equals(property.Name, "audience", StringComparison.OrdinalIgnoreCase));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" ")]
    public void The_command_validator_rejects_a_missing_or_blank_name(string? name)
    {
        var validator = new RealtimeCommandValidator();

        var isValid = validator.TryValidate(
            new RealtimeCommand
            {
                Name = name ?? string.Empty,
                Payload = JsonSerializer.SerializeToElement(new { })
            },
            out _);

        Assert.False(isValid);
    }

    [Fact]
    public void The_command_validator_rejects_a_null_command()
    {
        var validator = new RealtimeCommandValidator();

        var isValid = validator.TryValidate(null, out _);

        Assert.False(isValid);
    }

    [Fact]
    public void The_command_validator_rejects_a_name_longer_than_100_characters()
    {
        var validator = new RealtimeCommandValidator();

        var isValid = validator.TryValidate(
            new RealtimeCommand
            {
                Name = new string('a', 101),
                Payload = JsonSerializer.SerializeToElement(new { })
            },
            out _);

        Assert.False(isValid);
    }

    [Fact]
    public void The_command_validator_rejects_invalid_name_characters()
    {
        var validator = new RealtimeCommandValidator();

        var isValid = validator.TryValidate(
            new RealtimeCommand
            {
                Name = "invalid command!",
                Payload = JsonSerializer.SerializeToElement(new { })
            },
            out _);

        Assert.False(isValid);
    }

    [Fact]
    public void The_command_validator_rejects_an_undefined_payload()
    {
        var validator = new RealtimeCommandValidator();

        var isValid = validator.TryValidate(
            new RealtimeCommand
            {
                Name = "valid-command",
                Payload = default
            },
            out _);

        Assert.False(isValid);
    }

    [Fact]
    public void The_command_validator_accepts_a_valid_generic_command()
    {
        var validator = new RealtimeCommandValidator();

        var isValid = validator.TryValidate(
            new RealtimeCommand
            {
                Name = "valid-command_1",
                Payload = JsonSerializer.SerializeToElement(new { })
            },
            out _);

        Assert.True(isValid);
    }

    [Fact]
    public void The_internal_error_envelope_is_safe_for_the_caller()
    {
        var envelope = RealtimeErrorEnvelopeFactory.CreateInternalError();

        Assert.Equal("internal-error", envelope.Type);
        Assert.Equal(RealtimeAudience.Caller, envelope.Audience);
        Assert.Equal(
            "Unable to process the realtime request.",
            envelope.Payload.GetProperty("message").GetString());
    }
}
