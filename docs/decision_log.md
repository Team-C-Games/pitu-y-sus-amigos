# Preguntas y Respuestas - Refinamiento de User Stories (21/07 Virginia con ChatGPT)

## Reinicio de una partida

### ¿Qué sucede cuando termina una partida y se inicia una nueva?

La partida se reinicia completamente.

- Todos los jugadores vuelven a comenzar desde el inicio.
- Se eliminan todos los muros descubiertos.
- Se limpia el estado del tablero.
- Se vuelve a cargar la configuración fija del laberinto usada al comienzo de la partida.

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

La única diferencia entre las dificultades es la cantidad de muros ocultos configurados.

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

---

# Decisiones técnicas - integración del motor y transporte (22/07/2026)

## Símbolos y configuración fija

- El tablero se representa como una cuadrícula de 6×6.
- El repositorio no contiene todavía los nombres visuales aprobados de las 24 fichas. Para no inventar significados se adoptaron identificadores neutrales y estables: `Symbol01` a `Symbol24`.
- `BoardDefinition` mantiene una única configuración hardcodeada e inmutable que asigna los 24 identificadores a posiciones únicas y válidas.
- La configuración se valida al inicializarse: deben estar presentes los 24 valores del enum, todas las coordenadas deben pertenecer al tablero y ninguna posición puede repetirse.
- `SymbolBag` se carga exclusivamente desde los símbolos presentes en `BoardDefinition`. La bolsa cambia el objetivo activo, pero nunca la posición configurada de un símbolo.
- Las coordenadas neutrales deberán contrastarse con el diseño visual aprobado antes de cerrar el contrato definitivo con Persona 3.

## Muros y modo fácil

- El modo fácil continúa requiriendo exactamente 19 muros fijos.
- No se agregaron muros aleatorios ni modo difícil.
- El repositorio todavía no contiene las 19 coordenadas oficiales de muros. `EasyBoardDefinition` exige las 19 al construirse, pero la configuración concreta queda bloqueada hasta recibir ese dato aprobado.

## Correcciones del motor recibido

- Se reemplazó la referencia inexistente al tipo `Board` por `BoardDefinition`, recuperando la compilación del proyecto Domain.
- El dado ahora devuelve una cantidad de pasos entre 1 y 4; anteriormente devolvía por error un `MagicSymbol`.
- La implementación técnica del dado conserva las caras `1, 2, 2, 3, 3, 4` y protege el acceso concurrente al generador aleatorio.
- Se reforzaron nulabilidad, copia defensiva del orden de jugadores, rango de 2 a 4 participantes, identificadores únicos, posiciones iniciales y orden de llegada.
- Se reemplazaron tests vacíos por pruebas de invariantes reales y se eliminaron esqueletos sin implementación asociada.

## Integración real con SignalR

No se creó `ApplicationGameBridge`. `Laberinto.Application` no contiene todavía:

- comandos o handlers de casos de uso;
- `IGameRepository` ni una abstracción equivalente para la sesión;
- DTO o proyección pública del estado de partida;
- un agregado `Game` funcional con símbolo objetivo y colección de jugadores;
- contratos de eventos para estado actualizado, choque con muro y fin de partida.

El modo `Real` mantiene `UnavailableRealGameBridge` y responde `not-ready`. `GameHub` continúa dependiendo únicamente de `IGameBridge`. Cuando Persona 1 entregue estos contratos se podrá agregar `ApplicationGameBridge` y cambiar solo el registro de dependencias, sin modificar el hub ni el protocolo `game-event`.

## Correcciones de preparación (22/07/2026 - Guillote)

### Dependencia OpenAPI

- `Microsoft.AspNetCore.OpenApi` 10.0.9 incorpora `Microsoft.OpenApi` 2.0.0 de
  forma transitiva.
- Se fija exclusivamente `Microsoft.OpenApi` en la versión 2.7.5, que corrige
  la vulnerabilidad `GHSA-v5pm-xwqc-g5wc`, sin cambiar el framework ni otros
  paquetes.

### Esquinas iniciales

- La regla funcional única es asignación aleatoria de esquinas.
- Con dos jugadores se elige al azar una pareja de esquinas opuestas.
- Los jugadores no eligen ni modifican su esquina inicial.

### CORS de desarrollo

- La política `DevelopmentFrontend` se registra solo cuando el entorno es
  `Development` y hay orígenes configurados.
- La configuración versionada permite únicamente `http://localhost:4200`, con
  métodos, encabezados y credenciales necesarios para SignalR.
- Producción no registra esta política; cualquier origen adicional debe ser una
  decisión explícita de despliegue.

### Muros fáciles

- Sigue sin existir una fuente aprobada con las 19 coordenadas oficiales.
- `EasyBoardDefinition` permanece como validador de una lista externa y tiene
  un único TODO localizado para incorporar el layout cuando el equipo entregue
  esa fuente. No se inventó ninguna configuración de muros.
