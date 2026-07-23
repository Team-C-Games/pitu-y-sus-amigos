export interface DiceVisual {
  /** Último resultado; null si todavía no se lanzó en este turno. */
  readonly value: number | null;
  /** El jugador local puede lanzar el dado ahora. */
  readonly isAvailable: boolean;
  /** Animación de lanzamiento en curso. */
  readonly isRolling?: boolean;
}
