export interface LobbyPlayer {
    id: string;
    name: string;
    avatar?: string;
    isHost: boolean;
    isReady: boolean;
    isCurrentTurn: boolean;
}
