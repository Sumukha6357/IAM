# Resets db volume then starts core services
$ErrorActionPreference = 'Stop'
docker compose down -v
docker compose --profile core up --build
