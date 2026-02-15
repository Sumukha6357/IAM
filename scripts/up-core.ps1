# Runs core services (db + api)
$ErrorActionPreference = 'Stop'
docker compose --profile core up --build
