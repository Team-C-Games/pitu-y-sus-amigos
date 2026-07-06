# PRD — Prueba de motor: entidad Dado

> NOTA: Objetivo de PRUEBA para verificar que el loop de desarrollo funciona de
> punta a punta (Aider + Ollama + dotnet test + commit). No es un objetivo de
> diseño del juego; puede modificarse o reemplazarse.

## Objetivo
Implementar la entidad Dado del dominio, capaz de tirarse y devolver un valor
según las caras del dado real del Laberinto Mágico.

## Alcance
SÍ entra: la clase Dado en Laberinto.Domain, un método Tirar() que devuelve int,
y sus tests en Laberinto.Tests.
NO entra: red, SignalR, base de datos, otras entidades, ni Application/
Infrastructure/Api.

## Comportamiento esperado
- El dado tiene 6 caras con estos valores: 1, 2, 2, 3, 3, 4.
- Tirar() devuelve uno de esos valores.
- Sobre muchas tiradas solo pueden salir valores del conjunto {1, 2, 3, 4}.

## Criterios de aceptación
1. Tirar() nunca devuelve un valor fuera de {1, 2, 3, 4}.
2. En 1000 tiradas aparecen los cuatro valores (1,2,3,4) al menos una vez.
3. Los tests compilan y pasan con dotnet test.

## Restricciones técnicas
- Código en backend/Laberinto.Domain y backend/Laberinto.Tests.
- Dado no depende de nada fuera de Laberinto.Domain.
- No modificar contracts/, docs/game-rules.md, ni otras capas.
# 🧙 PRD — Iteración 1: Entidad Tablero y Mecánica de Símbolos

## Objetivo
Implementar la estructura básica del tablero de juego (cuadrícula de casillas), la gestión de los símbolos mágicos activos y la lógica para que un peón sume puntos al recolectarlos.

## Alcance
- **SÍ entra:** La representación del tablero en el dominio, la posición de los símbolos mágicos en sus casillas correspondientes, la bolsa de símbolos para revelar fichas al azar, y el contador de puntos por jugador.
- **NO entra:** Los muros invisibles subterráneos ni las colisiones (eso va en la siguiente iteración). Tampoco entra la interfaz gráfica web todavía, todo se maneja a nivel de lógica.

## Comportamiento esperado
- Existe un tablero con sus casillas y una "bolsa de tela" virtual que contiene las 24 fichas de símbolos mágicos.
- Siempre debe haber exactamente **un (1) símbolo mágico activo** y visible en el tablero.
- Cuando un peón se mueve y cae exactamente en la casilla del símbolo activo, gana un punto y el sistema saca un nuevo símbolo al azar de la bolsa.

## Criterios de aceptación
1. **Validación de Bolsa y Símbolo Activo:** Al iniciar el juego, se debe elegir un símbolo al azar de la bolsa de 24 fichas y marcarlo como el "símbolo activo" actual.
2. **Validación de Captura:** Si un peón termina su movimiento en la casilla del símbolo activo, el jugador suma automáticamente +1 punto, su turno finaliza de inmediato, y ese símbolo se remueve del juego.
3. **Validación de Spawn:** Inmediatamente después de capturar un símbolo, el sistema debe tomar otra ficha de la bolsa y colocarla en su casilla correspondiente como el nuevo objetivo.
4. **Caso Especial (Spawn Inmediato):** Si al revelarse el nuevo símbolo resulta que ya había un peón parado en esa casilla, ese jugador se lleva el punto de forma automática y el sistema debe sacar otro símbolo inmediatamente.
