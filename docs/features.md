# Estado de funcionalidades

## Implementado

- Tablero de 6×6 con 24 símbolos fijos, únicos y validados.
- Bolsa de símbolos que selecciona objetivos sin cambiar sus posiciones.
- Asignación aleatoria de esquinas iniciales; con dos jugadores son opuestas.
- Dado con caras `1, 2, 2, 3, 3, 4` y validaciones básicas de movimiento.
- Transporte SignalR mediante el evento `game-event`, endpoint `/health` y
  bridge `Real`/`Mock` seguro por entorno.
- Store genérico para una única sesión temporal en memoria.

## Pendiente

- Agregado `Game`, casos de uso de Application y contratos públicos para el
  bridge real.
- Configuración oficial de los 19 muros fijos del modo fácil.
- Estado público completo, eventos de juego y consumo final por el frontend.
- Limpieza orquestada de una partida concreta al finalizar o reiniciar.

## Trabajo futuro acordado

- Modo difícil con 24 muros.
- Muros aleatorios.
- Persistencia, historial de partidas y base de datos.
