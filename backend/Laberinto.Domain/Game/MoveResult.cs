namespace Laberinto.Domain.Game;

public enum MoveResult
{
    Success,
    BlockedByWall,
    ReachedDestination,
    ReturnedToStart
}