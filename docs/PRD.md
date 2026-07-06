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
---

#  PRD — Iteración 1: Entidad Tablero y Mecánica de Símbolos

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
   ---

#  PRD — Iteración 2: Configuración, Turnos y Victoria 

## Objetivo
Configurar las condiciones iniciales del juego, la dificultad de los muros invisibles, el ordenamiento de los turnos y el ciclo completo de vida de la partida (reinicio y fin del juego).

## Alcance
- **SÍ entra:** Pantalla de configuración (2-4 jugadores), guardado de nombres, selección obligatoria de dificultad (Fácil 19 muros / Difícil 24 muros), ciclo de turnos circular, pantalla de victoria a los 5 puntos y botón de reinicio.
- **NO entra:** El movimiento libre del peón todavía (se simula mediante teletransportación lógica para testear el flujo de los turnos).

## Criterios de aceptación
1. **Validación de Dificultad:** Al elegir el nivel Fácil el mapa debe inicializarse con 19 muros. Al elegir Difícil, debe inicializarse con 24 muros. Ninguna casilla puede quedar totalmente encerrada (debe tener al menos una entrada).
2. **Restricción de Esquinas:** En partidas de 2 jugadores, el sistema debe forzar de manera estricta que los peones inicien en esquinas opuestas del tablero de 6x6.
3. **Ciclo de Turno Circular:** El sistema debe indicar de quién es el turno. Al finalizar las acciones, el turno se transfiere al jugador de la derecha de forma estrictamente circular (ej: Jugador 1 -> 2 -> 3 -> 4 -> 1).
4. **Condición de Fin de Partida:** En el instante en que un usuario sume su quinta (5°) ficha, el flujo de turnos se congela por completo y se muestra un mensaje prominente anunciando al ganador de la partida.
5. **Reset Total:** Al presionar "Nueva Partida", los contadores de puntos vuelven a 0, las 24 fichas regresan a la bolsa, se redistribuyen los peones en las esquinas y los muros se vuelven a cargar según la dificultad seleccionada.
---

   #  PRD — Iteración 3: Movimiento Completo y Detección de Muros 

## Objetivo
Habilitar el movimiento interactivo por casillas del peón utilizando los pasos del dado e integrar el sistema de colisiones con los muros invisibles.

## Alcance
- **SÍ entra:** Validación interactiva casilla por casilla, bloqueo de movimientos diagonales, control de retroceso en el mismo turno, colisión con muros invisibles, penalización de reinicio y pérdida de puntos de movimiento excedentes.

## Criterios de aceptación
1. **Validación de Restricciones de Movimiento (US-04):** El peón se mueve de forma adyacente (horizontal o vertical). Si el usuario intenta trazar un camino diagonal, el sistema debe ignorar la acción. No se puede pisar dos veces la misma casilla en el mismo turno.
2. **Movimiento Parcial:** Si el jugador saca un 4 en el dado, el sistema debe permitirle detenerse voluntariamente tras haber avanzado 1, 2 o 3 casillas, cerrando su turno manualmente.
3. **Penalización por Choque con Muro (US-05):** Si la trayectoria del peón choca contra un muro invisible cargado en la lógica, el peón es teletransportado inmediatamente a su esquina inicial de partida, pierde los pasos que le quedaban en el dado y el turno pasa automáticamente al siguiente jugador.
4. **Alerta de Colisión:** Al chocar con el muro, el sistema debe desplegar una advertencia visual ("¡Chocaste con un muro!") para alertar al jugador antes de mandar al peón de vuelta a la base.
