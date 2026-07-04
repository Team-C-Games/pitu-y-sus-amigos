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
