using System.Collections.ObjectModel;
using Laberinto.Domain.Game;

namespace Laberinto.Domain.Board;

public sealed class BoardDefinition
{
    public const int RowCount = 6;
    public const int ColumnCount = 6;
    public const int SymbolCount = 24;

    private static readonly IReadOnlyDictionary<MagicSymbol, Position> FixedSymbolPositions =
        CreateFixedSymbolPositions();

    private readonly IReadOnlyList<Wall> _walls;

    public BoardDefinition(IEnumerable<Wall> walls)
    {
        ArgumentNullException.ThrowIfNull(walls);

        var configuredWalls = walls.ToArray();
        if (configuredWalls.Any(wall => wall is null))
        {
            throw new ArgumentException("Wall configuration cannot contain null values.", nameof(walls));
        }

        if (configuredWalls.Any(wall =>
                !IsInside(wall.From) || !IsInside(wall.To)))
        {
            throw new ArgumentException("Every wall endpoint must be inside the 6x6 board.", nameof(walls));
        }

        if (configuredWalls.Distinct().Count() != configuredWalls.Length)
        {
            throw new ArgumentException("Wall configuration cannot contain duplicates.", nameof(walls));
        }

        _walls = Array.AsReadOnly(configuredWalls);
    }

    public IReadOnlyDictionary<MagicSymbol, Position> SymbolPositions => FixedSymbolPositions;

    public IReadOnlyList<Wall> Walls => _walls;

    public Position GetSymbolPosition(MagicSymbol symbol)
    {
        if (!FixedSymbolPositions.TryGetValue(symbol, out var position))
        {
            throw new ArgumentOutOfRangeException(nameof(symbol));
        }

        return position;
    }

    public bool ContainsSymbol(MagicSymbol symbol)
    {
        return FixedSymbolPositions.ContainsKey(symbol);
    }

    public bool IsBlocking(Position from, Position to)
    {
        ArgumentNullException.ThrowIfNull(from);
        ArgumentNullException.ThrowIfNull(to);

        if (!IsInside(from))
        {
            throw new ArgumentOutOfRangeException(nameof(from), "Starting position must be inside the board.");
        }

        if (!IsInside(to))
        {
            return true;
        }

        if (Math.Abs(from.Row - to.Row) + Math.Abs(from.Column - to.Column) != 1)
        {
            throw new ArgumentException("Board movement must connect adjacent positions.", nameof(to));
        }

        return _walls.Any(wall => wall.Blocks(from, to));
    }

    public static bool IsInside(Position position)
    {
        ArgumentNullException.ThrowIfNull(position);

        return position.Row >= 0 && position.Row < RowCount &&
               position.Column >= 0 && position.Column < ColumnCount;
    }

    private static IReadOnlyDictionary<MagicSymbol, Position> CreateFixedSymbolPositions()
{
    var positions = new Dictionary<MagicSymbol, Position>
    {
        [MagicSymbol.Llave] = new(0, 1),
        [MagicSymbol.Corona] = new(0, 2),
        [MagicSymbol.Anillo] = new(0, 3),
        [MagicSymbol.Espada] = new(0, 4),
        [MagicSymbol.Cofre] = new(1, 0),
        [MagicSymbol.Pocion] = new(1, 1),
        [MagicSymbol.Gema] = new(1, 4),
        [MagicSymbol.Pergamino] = new(1, 5),
        [MagicSymbol.Estrella] = new(2, 0),
        [MagicSymbol.Luna] = new(2, 2),
        [MagicSymbol.Sol] = new(2, 3),
        [MagicSymbol.Fuego] = new(2, 5),
        [MagicSymbol.Caldero] = new(3, 0),
        [MagicSymbol.Hongo] = new(3, 2),
        [MagicSymbol.Buho] = new(3, 3),
        [MagicSymbol.Arania] = new(3, 5),
        [MagicSymbol.Murcielago] = new(4, 0),
        [MagicSymbol.Gato] = new(4, 1),
        [MagicSymbol.Dragon] = new(4, 4),
        [MagicSymbol.Varita] = new(4, 5),
        [MagicSymbol.Trebol] = new(5, 1),
        [MagicSymbol.Herradura] = new(5, 2),
        [MagicSymbol.Ojo] = new(5, 3),
        [MagicSymbol.Runa] = new(5, 4)
    };

    if (positions.Count != SymbolCount ||
        positions.Count != Enum.GetValues<MagicSymbol>().Length)
    {
        throw new InvalidOperationException("The board must configure every one of the 24 magic symbols exactly once.");
    }

    if (positions.Values.Any(position => !IsInside(position)))
    {
        throw new InvalidOperationException("Every magic symbol must be placed inside the 6x6 board.");
    }

    if (positions.Values.Distinct().Count() != SymbolCount)
    {
        throw new InvalidOperationException("Magic symbols must occupy unique board positions.");
    }

    return new ReadOnlyDictionary<MagicSymbol, Position>(positions);
}