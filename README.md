# El Laberinto Mágico

Versión digital, **multijugador y por turnos**, del juego de mesa *El Laberinto
Mágico*: aprendices de mago exploran un laberinto en busca de símbolos mágicos,
mientras los muros —ocultos bajo el tablero— se descubren recién al chocar con
ellos. Gana quien junta **5 símbolos** primero.

Este README explica cómo está armado el proyecto y cómo trabajar en él. Cualquier
integrante nuevo debería poder leerlo y arrancar sin preguntarle a nadie.

> **Las reglas completas del juego están en [`docs/game-rules.md`](docs/game-rules.md).**
> Ese documento es la **fuente de verdad** de las reglas y no se modifica: las
> decisiones de implementación van en otros archivos (ver más abajo).

---

## 1. Qué es el proyecto

Un juego web multijugador por turnos. Los jugadores mueven su peón por un
laberinto (solo en horizontal/vertical), descubren muros invisibles al intentar
cruzarlos, y compiten por llegar antes al símbolo mágico activo. Toda la lógica
de reglas (tablero, muros, turnos, símbolos, condición de victoria) vive en el
backend; el frontend es la interfaz que juega cada participante.

Reglas resumidas:

- Objetivo: ser el primero en recolectar 5 símbolos mágicos.
- Movimiento por turnos, tirando un dado de caras `1, 2, 2, 3, 3, 4`.
- Los muros están ocultos; al chocar con uno, el turno termina y el peón vuelve
  a su esquina inicial.
- Al alcanzar el símbolo activo se suma un punto y se revela otro.

Para el detalle exacto, ver siempre `docs/game-rules.md`.

---

## 2. Stack técnico

| Capa | Tecnología |
|------|------------|
| Frontend | **Angular** (carpeta `frontend/`) |
| Backend | **ASP.NET Core 10 + SignalR** (carpeta `backend/`) para el tiempo real por turnos |
| Arquitectura backend | **Clean Architecture**: `Domain → Application → Infrastructure → Api` |
| Estado | **En memoria** por ahora (sin base de datos en esta fase) |

**Hacia dónde va** (todavía no implementado):

- **Supabase (Postgres)** como base de datos persistente.
- **Railway** como hosting del backend.
- **Vercel** para el frontend.

La regla de dependencias de Clean Architecture es: las capas de adentro no
conocen a las de afuera. `Domain` no depende de nadie; `Application` depende de
`Domain`; `Infrastructure` y `Api` implementan/exponen hacia afuera. La lógica
pura del juego vive en `Domain`.

---

## 3. Declaración de autoría del código

Esta sección es importante y explícita:

- **El código del juego se desarrolla exclusivamente con un modelo de IA local**
  (**Ollama** ejecutando **`qwen2.5-coder`**), operado a través de **Aider**.
  **Nada del código del juego se escribe con IA en la nube.** Todo el desarrollo
  de la lógica corre en la máquina, contra el modelo local.
- **El andamiaje inicial del repositorio** (estructura de carpetas, creación de
  los proyectos .NET y Angular, `Dockerfile`, `docker-compose.yml`,
  configuración del entorno) se preparó con herramientas de setup. **No se usó
  ninguna IA en la nube para escribir lógica del juego.**

En resumen: la infraestructura se preparó con tooling de setup; la lógica del
juego la produce el loop con IA **local**.

---

## 4. Cómo funciona la maquinaria del loop (*Looping Engineering*)

El desarrollo sigue un ciclo cerrado y repetible. Cada objetivo pasa por estos
pasos:

1. **El Analista Funcional define el objetivo.** Escribe, en lenguaje natural,
   qué hay que construir en `docs/PRD.md` (y ajusta `docs/features.md` si hace
   falta). No escribe código: describe el *qué* y los criterios de aceptación.

2. **El Ingeniero del Loop corre el loop.** Aider —con el modelo local— lee el
   objetivo y:
   - Escribe **primero los tests** en `backend/Laberinto.Tests/`.
   - Después escribe el **código** en la capa que corresponda (por ejemplo
     `Laberinto.Domain` para lógica pura).
   - Corre `dotnet test`.
   - Si los tests fallan, **se auto-repara**: analiza el error y vuelve a
     intentar, corrigiendo solo el código de implementación (no los tests).

3. **Regla de los 15 minutos.** El bucle de auto-reparación tiene un tope de
   **15 minutos**. Si no logra poner los tests en verde en ese tiempo, **se
   corta** y el caso **escala al Arquitecto Revisor** (intervención humana). Es
   una salvaguarda para que el loop no gire en falso indefinidamente.

4. **Documentar y commitear.** Cuando los tests pasan, se registra la decisión
   en `docs/decision_log.md` (qué se hizo, qué patrón se aplicó y por qué) y se
   **commitea con identidad humana**, sin ninguna atribución de IA en el mensaje.

5. **El Arquitecto Revisor revisa el PR** antes del merge. Nada entra a la rama
   principal sin esa revisión.

---

## 5. Cómo interactuar con la maquinaria

Primero, parate en la raíz del repo:

```bash
cd /Users/guille/Documents/Boludeces/Pitu-y-sus-amigos
```

### Modo automatizado

```bash
./loop.sh
```

Lee `docs/PRD.md` y ejecuta el ciclo completo (generar → testear → auto-reparar
→ documentar). **Si `docs/PRD.md` está vacío, el script frena solo** con un
mensaje pidiendo que el Analista Funcional defina un objetivo (no corre con un
objetivo vacío).

### Modo interactivo (recomendado las primeras veces)

```bash
aider backend/Laberinto.Domain/ backend/Laberinto.Tests/
```

Se abre una sesión de Aider (contra el modelo local). Ahí escribís el objetivo
en lenguaje natural y vas guiando el desarrollo. Comandos útiles dentro de la
sesión:

- `/add <ruta>` — sumar más archivos al contexto.
- `/test` — correr el comando de tests configurado.
- `/undo` — deshacer el último cambio/commit de Aider.
- `/exit` — salir de la sesión.

### Levantar el juego completo en local

```bash
docker compose up --build
```

- **Backend** en `http://localhost:5291`
- **Frontend** en `http://localhost:4200`

---

## 6. Estructura de carpetas

```
.
├── backend/              # ASP.NET Core 10 — Clean Architecture (5 proyectos)
│   ├── Laberinto.Domain/          # Entidades y lógica pura del juego (sin dependencias)
│   ├── Laberinto.Application/     # Casos de uso / orquestación sobre el dominio
│   ├── Laberinto.Infrastructure/  # Implementaciones técnicas (persistencia, etc.)
│   ├── Laberinto.Api/             # Endpoints HTTP y hubs de SignalR
│   ├── Laberinto.Tests/           # Tests unitarios (el loop escribe acá primero)
│   ├── Dockerfile                 # Imagen del backend (multi-stage)
│   └── Laberinto.slnx             # Solución que agrupa los proyectos
│
├── frontend/             # Aplicación Angular (interfaz del jugador)
│
├── docs/                 # Documentación del proyecto
│   ├── game-rules.md     # Reglas del juego — FUENTE DE VERDAD (no se modifica)
│   ├── PRD.md            # Objetivo actual del loop (lo escribe el Analista Funcional)
│   ├── features.md       # Detalle de features
│   └── decision_log.md   # Registro de decisiones técnicas del loop
│
├── contracts/            # Contratos de mensajes (esquema de comunicación cliente/servidor)
│   └── messages.schema.json
│
├── loop.sh               # Orquestador del loop de desarrollo
├── docker-compose.yml    # Levanta backend + frontend juntos en local
└── .aider.conf.yml       # Config de Aider (modelo local, tests, sin atribución de IA)
```

---

### Convención de commits

Todos los commits llevan **identidad humana** y **nunca** atribución de IA (ni
"Claude", ni "Co-authored-by", ni "aider"), tanto en los commits manuales como
en los automáticos del loop.
