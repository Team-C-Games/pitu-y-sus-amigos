using System.Text.Json;
using System.Diagnostics.CodeAnalysis;
using System.Text.RegularExpressions;

namespace Laberinto.Api.Realtime;

public class RealtimeCommandValidator
{
    private static readonly Regex CommandNamePattern = new(
        "^[A-Za-z0-9_-]+$",
        RegexOptions.CultureInvariant);

    public bool TryValidate(
        [NotNullWhen(true)] RealtimeCommand? command,
        out string message)
    {
        if (command is null)
        {
            message = "A realtime command is required.";
            return false;
        }

        if (string.IsNullOrWhiteSpace(command.Name))
        {
            message = "A realtime command name is required.";
            return false;
        }

        if (command.Name.Length > 100)
        {
            message = "A realtime command name cannot exceed 100 characters.";
            return false;
        }

        if (!CommandNamePattern.IsMatch(command.Name))
        {
            message = "A realtime command name can contain only letters, numbers, hyphens, and underscores.";
            return false;
        }

        if (command.Payload.ValueKind == JsonValueKind.Undefined)
        {
            message = "A realtime command payload is required.";
            return false;
        }

        message = string.Empty;
        return true;
    }
}
