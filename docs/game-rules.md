# 🧙 Laberinto Mágico - Reglas del Juego

> Este documento describe las reglas funcionales que servirán como base para el desarrollo del videojuego.
>
> **Objetivo:** mantener una fuente de verdad de las reglas acordadas por el equipo. Las decisiones exclusivamente técnicas se documentan en otros archivos.

---

# Índice

- [Idea del juego](#idea-del-juego)
- [Objetivo](#objetivo)
- [Componentes](#componentes)
- [Tablero](#tablero)
- [Preparación](#preparación)
- [Turno de juego](#turno-de-juego)
- [Muros invisibles](#muros-invisibles)
- [Símbolos mágicos](#símbolos-mágicos)
- [Fin del juego](#fin-del-juego)
- [Dificultad y alcance inicial](#dificultad-y-alcance-inicial)
- [Configuración fija del tablero](#configuración-fija-del-tablero)
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

# Tablero

El tablero tiene una cuadrícula de **6 filas por 6 columnas**, con 36 casillas
en total.

Cada casilla debe tener al menos una entrada; ninguna puede quedar completamente
aislada por muros.

---

# Preparación

1. Colocar el laberinto subterráneo dentro de la caja.
2. Cargar la configuración fija de 19 muros en las ranuras correspondientes.
3. Verificar que cada casilla tenga al menos una entrada y que ninguna quede completamente bloqueada.
4. Colocar la placa superior sobre el laberinto.
5. Introducir todas las fichas de símbolos en la bolsa y mezclarlas.
6. Sacar una ficha al azar y colocarla visible junto al tablero. Ese será el símbolo activo.
7. La partida admite de **2 a 4 jugadores**. Las esquinas iniciales se asignan al azar entre las disponibles. En una partida de dos jugadores se elige al azar una pareja de esquinas opuestas y se asigna una a cada participante.
8. Los jugadores ingresan a la partida uno por uno y, en ese orden, eligen uno de los colores que todavía está disponible.
9. Colocar la bola metálica debajo del tablero, alineada con cada peón.

---

# Turno de juego

Los jugadores juegan por turnos.

El jugador inicial se elige al azar al comenzar cada partida.

Cada turno consta de las siguientes etapas.

## 1. Tirar el dado

El resultado indica la cantidad máxima de casillas que puede recorrer el jugador.

Es válido mover menos casillas de las obtenidas, incluso **cero**. El jugador puede finalizar voluntariamente su turno en la casilla donde se encuentra.

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

Si al revelarse un nuevo símbolo ya existe uno o más peones sobre esa casilla:

- Obtiene automáticamente la ficha el peón que haya llegado primero a esa casilla y permanezca allí.
- Se revela inmediatamente un nuevo símbolo.

El sistema registra un orden de llegada cada vez que un peón entra en una casilla. Si un peón se mueve fuera de ella y vuelve a entrar, recibe un nuevo orden de llegada. Como los turnos se resuelven de forma secuencial, no puede haber empate en dicho orden.

---

# Fin del juego

La partida termina cuando un jugador obtiene cinco símbolos mágicos.

Ese jugador es el ganador.

---

# Dificultad y alcance inicial

## Fácil

- 19 muros
- Mayor cantidad de caminos abiertos
- Es la única modalidad incluida en la primera versión del videojuego.
- La distribución de los muros es fija, está validada y se carga desde una configuración hardcodeada. No se genera al azar.

## Difícil

- 24 muros
- Laberinto más complejo
- Queda fuera del alcance inicial y se considera una mejora futura, junto con las configuraciones aleatorias de muros.

---

# Configuración fija del tablero

Las 24 fichas de símbolos mágicos tienen una casilla fija en el tablero. La
aplicación las representa mediante una configuración hardcodeada que relaciona
cada identificador de símbolo con su posición en la cuadrícula de 6×6. La bolsa
solo determina el orden aleatorio en que esos símbolos se convierten en el
objetivo activo; nunca cambia su posición.

Los muros permanecen ocultos y no se marcan visualmente cuando un jugador los
descubre. Los jugadores deben recordarlos durante la partida.

---

# Preguntas abiertas

No hay preguntas funcionales abiertas para el alcance inicial. La transcripción
exacta de los 24 identificadores de símbolo y sus coordenadas se mantiene como
dato de configuración del tablero, tomando como referencia el diseño visual
aprobado.
