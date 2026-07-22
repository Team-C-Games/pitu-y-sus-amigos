# UX Flow

## Objetivo

Este documento describe el flujo completo de navegación y la experiencia del jugador dentro de Laberinto Mágico.

No define el aspecto visual de la interfaz, sino el comportamiento esperado de cada pantalla y las acciones disponibles para los distintos tipos de usuarios.

---

# Flujo General

```text
Inicio
│
├── Ver reglas
├── Ver tutorial
├── Comenzar / Unirse a partida
│        │
│        ├── Crear partida
│        ├── Unirse a partida existente
│        └── Ver partida (si está completa)
│
└──────────────► Lobby
                    │
                    ├── Elegir nombre
                    ├── Elegir color
                    ├── Elegir esquina
                    ├── Ready
                    │
                    └── Esperar inicio
                            │
                            ▼
                       Partida
                            │
                            ├── Esperando turno
                            ├── Tirar dado
                            ├── Movimiento
                            ├── Obtener símbolo
                            ├── Fin de turno
                            │
                            ▼
                     Fin de partida
                            │
                            └── Volver al inicio
```

---

# Pantalla de Inicio

## Objetivo

Permitir al usuario acceder al juego o consultar información antes de comenzar.

## Opciones disponibles

- Ver reglas.
- Ver tutorial / video introductorio.
- Comenzar o unirse a una partida.
- Ver una partida en curso (si ya está completa).

## Estados

- El usuario pasa al lobby.

---

### Existe una partida con lugares disponibles

El botón cambia automáticamente a:

> Unirse a partida (2/4 jugadores)

El contador debe mostrar la cantidad actual de jugadores conectados.

---

### La partida está completa

El botón principal desaparece y es reemplazado por:

> Ver partida

El usuario entra como espectador.

Actualmente no existe límite de espectadores.

---

# Lobby

## Objetivo

Preparar la partida antes del comienzo.

## Acciones del jugador

Al ingresar debe:

- Elegir nombre.
- Elegir color.
- Elegir esquina inicial.

Luego podrá marcar:

> Ready

---

## Selección de color y esquina

Mientras el jugador **no haya marcado Ready**, puede modificar libremente:

- Color.
- Esquina.

Siempre que dichas opciones no estén ocupadas por jugadores que ya marcaron Ready.

---

## Resolución de conflictos

Si dos jugadores intentan seleccionar el mismo color o esquina exactamente al mismo tiempo:

- La asignación será aleatoria.
- El jugador que no obtuvo la selección deberá elegir nuevamente.

---

## Ready

Una vez presionado:

- No puede quitarse.
- No puede modificarse el color.
- No puede modificarse la esquina.
- No puede abandonarse la partida.

---

## Abandono

Mientras un jugador aún no esté Ready:

- Puede abandonar el lobby.

La partida continuará esperando la cantidad mínima de jugadores.

---

## Inicio de la partida

Existe una cantidad mínima de jugadores requerida para comenzar una partida.

Mientras no se alcance esa cantidad:

- El botón **Iniciar partida** no estará disponible.

Cuando todos los jugadores mínimos hayan marcado **Ready**:

- Aparece el botón **Iniciar partida**.
- Cualquier jugador que ya esté Ready puede iniciarla.
- También pueden optar por esperar a que se unan más jugadores.

Mientras la partida permanezca en el lobby:

- Nuevos jugadores pueden seguir uniéndose hasta alcanzar el máximo permitido.

Cuando la cantidad máxima de jugadores (4) haya ingresado y todos hayan marcado **Ready**:

- La partida comienza automáticamente.
- Ya no se aceptan nuevos jugadores.

## No existe partida

Botón principal:

> Comenzar partida

Al presionarlo:

- Se crea una nueva instancia de partida.
---

## Orden de turnos

El orden de los turnos queda determinado por el orden en que los jugadores ingresaron a la partida.

---

# Partida

## Información visible

Durante toda la partida deben visualizarse:

- Tablero.
- Posición de todos los jugadores.
- Jugador cuyo turno está activo.
- Orden de turnos.
- Resultado del dado del turno actual.
- Cantidad de símbolos obtenidos por cada jugador.
- Jugadores activos.
- Espectadores conectados.

---

## Área común

La interfaz tendrá un área compartida con información general del juego.

Contendrá:

- Bolsa de símbolos.
- Símbolo actual.
- Dado.
- Orden de jugadores.
- Resultado del dado.

Si es el turno del jugador, desde esta misma área podrá lanzar el dado.

---

# Movimiento

## Tirar dado

Al comenzar el turno el jugador lanza el dado.

El resultado determina la cantidad máxima de movimientos disponibles.

---

## Casillas disponibles

Luego de lanzar el dado:

- Se resaltan únicamente las casillas válidas.
- El jugador avanza una casilla por vez.

Después de cada movimiento:

- Se recalculan las casillas disponibles.

---

## Movimiento confirmado

Cada movimiento realizado es definitivo.

No existe opción para deshacer movimientos.

---

## Finalizar turno

El jugador puede terminar el turno en cualquier momento, aunque aún tenga movimientos disponibles.

---

# Descubrimiento de muros

Si un jugador intenta atravesar un muro oculto:

- El movimiento es cancelado.
- El jugador vuelve a su esquina inicial.
- El muro se revela visualmente durante unos segundos.
- Luego vuelve a ocultarse.

Todos los jugadores observan esa animación, pero posteriormente el tablero vuelve a ocultar dicho muro. Recordar su ubicación depende de la memoria de los jugadores.

---

# Espectadores

Los espectadores pueden:

- Ver el tablero.
- Ver el avance de todos los jugadores.
- Ver el estado de la partida.

No pueden:

- Tirar el dado.
- Mover jugadores.
- Interactuar con la partida.

---

# Fin de partida

Al finalizar la partida se muestra:

- Ganador o empate.
- Cantidad de símbolos obtenidos por cada jugador.
- Todos los muros revelados.
- Botón para salir de la partida.

---

# Nueva partida

Una nueva partida únicamente podrá comenzar cuando todos los usuarios hayan abandonado la partida actual.

No existe persistencia.

Cada nueva partida comienza completamente desde cero.

---

# Estados globales de la partida

La aplicación mantiene un único estado global de la partida. Tanto el backend como el frontend deberán utilizar estos estados para definir el comportamiento del sistema.

## Sin partida

No existe una partida creada.

La pantalla principal ofrece:

- Ver reglas.
- Ver tutorial.
- Comenzar partida.

---

## Lobby

Existe una partida creada pero aún no comenzó.

Los jugadores pueden:

- Unirse.
- Elegir nombre.
- Elegir color.
- Elegir esquina.
- Marcar Ready.

Dependiendo de la cantidad de jugadores Ready:

- Esperar más jugadores.
- Iniciar la partida (si ya se alcanzó el mínimo).
- Esperar hasta completar los cuatro jugadores.

Los espectadores también pueden ingresar al lobby para observar la preparación de la partida.

---

## En juego

La partida ya comenzó.

Durante este estado:

- No pueden ingresar nuevos jugadores.
- Los usuarios adicionales ingresan únicamente como espectadores.
- Se desarrolla el juego normalmente.

---

## Finalizada

La partida terminó.

Se muestran:

- Ganador o empate.
- Símbolos obtenidos por cada jugador.
- Todos los muros revelados.

Los jugadores y espectadores pueden abandonar la partida.

Cuando el último usuario abandona la sesión:

- La partida es destruida.
- El sistema vuelve al estado **Sin partida**.