# Preguntas y Respuestas - Refinamiento de User Stories (21/07 Virginia con ChatGPT)

## Reinicio de una partida

### ¿Qué sucede cuando termina una partida y se inicia una nueva?

La partida se reinicia completamente.

- Todos los jugadores vuelven a comenzar desde el inicio.
- Se eliminan todos los muros descubiertos.
- Se limpia el estado del tablero.
- El laberinto se genera nuevamente como al comienzo de una partida.

Esto también permite que un jugador pueda abandonar la partida entre partidas sin afectar el funcionamiento.

---

## Tablero

### ¿Los símbolos (tesoros) cambian según la dificultad?

No.

Los símbolos son siempre los mismos y permanecen en las mismas posiciones independientemente de la dificultad seleccionada.

---

## Dificultad

### ¿El laberinto difícil (24 muros) mantiene las mismas reglas funcionales definidas para el laberinto normal?

Sí.

La única diferencia entre las dificultades es la cantidad de muros ocultos generados.

Las reglas de movimiento, detección de muros, objetivos y demás mecánicas permanecen iguales.

---

## Descubrimiento de muros

### ¿Qué ocurre cuando un jugador descubre un muro oculto?

Cuando un jugador intenta atravesar un muro oculto:

1. El muro se revela visualmente durante unos segundos.
2. El jugador regresa a su casilla de inicio.
3. Luego el muro vuelve a quedar oculto.

A partir de ese momento, los jugadores deben recordar su ubicación.

---

### ¿El conocimiento de los muros es individual o compartido?

Es compartido.

Aunque el muro vuelva a ocultarse visualmente, se considera que todos los jugadores observaron dónde apareció.

La memoria del juego es colectiva: cuando un muro es descubierto, todos los jugadores conocen su existencia, aunque deban recordarla manualmente.

No existe un conocimiento privado por jugador.