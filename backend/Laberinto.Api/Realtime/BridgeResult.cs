namespace Laberinto.Api.Realtime;

public class BridgeResult
{
    public BridgeResult(IReadOnlyCollection<RealtimeEnvelope> envelopes)
    {
        Envelopes = envelopes;
    }

    public IReadOnlyCollection<RealtimeEnvelope> Envelopes { get; }
}
