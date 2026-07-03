#!/usr/bin/env bash
set -euo pipefail

PRD_FILE="docs/PRD.md"
MAX_MINUTES=15

if [ ! -s "$PRD_FILE" ]; then
  echo "⛔ $PRD_FILE está vacío. El Analista Funcional tiene que definir un"
  echo "   objetivo antes de correr el loop. Frenando."
  exit 1
fi

echo "🔄 Objetivo detectado en $PRD_FILE. Iniciando loop..."
START=$(date +%s)

# 1. Aider genera tests + código a partir del objetivo
aider --yes \
  --message "Leé docs/PRD.md y docs/features.md. Implementá el objetivo
  pendiente respetando Clean Architecture (backend/Laberinto.Domain,
  backend/Laberinto.Application). Escribí primero los tests unitarios en
  backend/Laberinto.Tests/. No toques contracts/." \
  docs/PRD.md docs/features.md backend/

# 2. Bucle de auto-reparación con tope de 15 minutos
until dotnet test backend/Laberinto.Tests/Laberinto.Tests.csproj; do
  elapsed=$(( ($(date +%s) - START) / 60 ))
  if [ "$elapsed" -ge "$MAX_MINUTES" ]; then
    echo "⛔ 15 min superados sin pasar tests. ESCALAR AL ARQUITECTO."
    exit 2
  fi
  echo "❌ Tests fallan. Aider analiza el error..."
  dotnet test backend/Laberinto.Tests/Laberinto.Tests.csproj 2>&1 | tail -50 > /tmp/err.log
  aider --yes \
    --message "Estos tests fallan. Corregí SOLO el código de implementación,
    no los tests. Error:
$(cat /tmp/err.log)" \
    backend/
done

# 3. Documentar la decisión
echo "✅ Tests verdes. Actualizando decision_log.md..."
aider --yes \
  --message "Actualizá docs/decision_log.md con: qué se hizo, qué patrón se
  aplicó y por qué, y por qué esta decisión y no otra. Máx 15 líneas." \
  docs/decision_log.md

echo "🎉 Loop completo. Revisá 'git status' antes de hacer push vos mismo."
