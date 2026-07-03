# 🧙 Laberinto Mágico - Reglas del Juego

> Este documento describe las reglas del juego de mesa que servirán como base para el desarrollo del videojuego.
>
> **Objetivo:** documentar las reglas originales antes de comenzar el diseño técnico. Las decisiones de implementación deberán documentarse en otros archivos y nunca modificar este documento.

---

# Índice

- [Idea del juego](#idea-del-juego)
- [Objetivo](#objetivo)
- [Componentes](#componentes)
- [Preparación](#preparación)
- [Turno de juego](#turno-de-juego)
- [Muros invisibles](#muros-invisibles)
- [Símbolos mágicos](#símbolos-mágicos)
- [Fin del juego](#fin-del-juego)
- [Variantes de dificultad](#variantes-de-dificultad)
- [Preguntas abiertas](#preguntas-abiertas)

---

# Idea del juego

Los aprendices de mago exploran un laberinto misterioso en busca de símbolos mágicos.

Los grandes magos les juegan bromas haciendo que los caminos se abran y cierren constantemente. Como los muros están ocultos debajo del tablero, los jugadores nunca conocen exactamente el recorrido hasta que chocan contra uno de ellos.

---

# Objetivo

Ser el primer jugador en recolectar **cinco símbolos mágicos**.

---

# Componentes

- Tablero de dos niveles
  - Laberinto subterráneo (con muros)
  - Placa superior con los símbolos visibles
- 24 muros de madera
- 24 fichas de símbolos mágicos
- 1 bolsa de tela
- 1 dado con las caras:
  - 1
  - 2
  - 2
  - 3
  - 3
  - 4
- 4 peones
  - Rojo
  - Azul
  - Amarillo
  - Verde
- 4 bolas metálicas (una por peón)

---

# Preparación

1. Colocar el laberinto subterráneo dentro de la caja.
2. Insertar los muros de madera en las ranuras.
3. Cada casilla debe tener al menos una entrada. Ninguna puede quedar completamente bloqueada.
4. Colocar la placa superior sobre el laberinto.
5. Introducir todas las fichas de símbolos en la bolsa y mezclarlas.
6. Sacar una ficha al azar y colocarla visible junto al tablero. Ese será el símbolo activo.
7. Cada jugador elige un peón y lo coloca en una esquina.
8. En partidas de dos jugadores deben utilizarse esquinas opuestas.
9. Colocar la bola metálica debajo del tablero, alineada con el peón.

---

# Turno de juego

Los jugadores juegan por turnos.

El jugador inicial será quien haya perdido la partida anterior o, en su defecto, se elegirá al azar.

Cada turno consta de las siguientes etapas.

## 1. Tirar el dado

El resultado indica la cantidad máxima de casillas que puede recorrer el jugador.

Es válido mover menos casillas de las obtenidas.

## 2. Mover el peón

Durante un movimiento:

- Solo se puede mover horizontal o verticalmente.
- No está permitido mover en diagonal.
- Puede cambiarse de dirección durante el recorrido.
- El movimiento debe ser continuo.
- No está permitido retroceder sobre una casilla ya recorrida durante el mismo turno.

## 3. Compartir casillas

Está permitido atravesar peones de otros jugadores.

También está permitido que varios peones ocupen la misma casilla.

---

# Muros invisibles

Los muros permanecen ocultos debajo del tablero.

Un jugador descubre un muro únicamente cuando intenta atravesarlo.

## Si un jugador choca contra un muro

Sucede lo siguiente:

1. La bola metálica cae y sale por una de las cuatro esquinas.
2. El movimiento termina inmediatamente.
3. Las casillas restantes del dado se pierden.
4. El jugador recupera la bola.
5. El peón vuelve a la esquina inicial donde comenzó la partida.
6. La bola vuelve a colocarse debajo del tablero.
7. Finaliza el turno.

---

# Símbolos mágicos

Siempre existe un símbolo activo visible para todos los jugadores.

El objetivo de todos es alcanzar la casilla correspondiente a dicho símbolo.

## Cuando un jugador llega al símbolo

- Obtiene la ficha.
- Suma un punto.
- Su movimiento termina inmediatamente.
- Se revela un nuevo símbolo desde la bolsa.

## Caso especial

Si al revelarse un nuevo símbolo ya existe un peón sobre esa casilla:

- Ese jugador obtiene automáticamente la ficha.
- Se revela inmediatamente un nuevo símbolo.

---

# Fin del juego

La partida termina cuando un jugador obtiene cinco símbolos mágicos.

Ese jugador es el ganador.

---

# Variantes de dificultad

## Fácil

- 19 muros
- Mayor cantidad de caminos abiertos

## Difícil

- 24 muros
- Laberinto más complejo

---

# Preguntas abiertas

Esta sección se mantendrá durante la etapa de análisis del proyecto.

Aquí se registrarán todas las dudas detectadas por la IA o por el equipo antes de comenzar la implementación.

> Inicialmente esta sección debe permanecer vacía y será completada durante el proceso de análisis.