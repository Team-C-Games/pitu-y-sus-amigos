export interface MagicSymbolVisual {
  readonly id: string;
  readonly name: string;
  readonly glyph: string;
}

const MAGIC_SYMBOLS: readonly MagicSymbolVisual[] = [
  { id: 'Symbol01', name: 'Sol', glyph: '☀' },
  { id: 'Symbol02', name: 'Luna', glyph: '☾' },
  { id: 'Symbol03', name: 'Búho', glyph: '🦉' },
  { id: 'Symbol04', name: 'Araña', glyph: '🕷' },
  { id: 'Symbol05', name: 'Llave', glyph: '🗝' },
  { id: 'Symbol06', name: 'Corona', glyph: '♛' },
  { id: 'Symbol07', name: 'Varita', glyph: '🪄' },
  { id: 'Symbol08', name: 'Conejo', glyph: '♞' },
  { id: 'Symbol09', name: 'Hoja', glyph: '❧' },
  { id: 'Symbol10', name: 'Cáliz', glyph: '⚱' },
  { id: 'Symbol11', name: 'Máscara', glyph: '☠' },
  { id: 'Symbol12', name: 'Escoba', glyph: '🜁' },
  { id: 'Symbol13', name: 'Gato', glyph: '🐈' },
  { id: 'Symbol14', name: 'Pluma', glyph: '🪶' },
  { id: 'Symbol15', name: 'Vela', glyph: '🕯' },
  { id: 'Symbol16', name: 'Trébol', glyph: '✿' },
  { id: 'Symbol17', name: 'Espiral', glyph: '🌀' },
  { id: 'Symbol18', name: 'Estrella', glyph: '✦' },
  { id: 'Symbol19', name: 'Murciélago', glyph: '🦇' },
  { id: 'Symbol20', name: 'Telaraña', glyph: '🕸' },
  { id: 'Symbol21', name: 'Frasco', glyph: '⚗' },
  { id: 'Symbol22', name: 'Montaña', glyph: '⛰' },
  { id: 'Symbol23', name: 'Cristal', glyph: '◇' },
  { id: 'Symbol24', name: 'Runas', glyph: 'ᚠ' },
];

const SYMBOLS_BY_ID = new Map(MAGIC_SYMBOLS.map((symbol) => [symbol.id, symbol]));
const UNKNOWN_SYMBOL: MagicSymbolVisual = { id: 'unknown', name: 'Símbolo mágico', glyph: '✦' };

export function magicSymbolFor(id: string): MagicSymbolVisual {
  return SYMBOLS_BY_ID.get(id) ?? UNKNOWN_SYMBOL;
}
