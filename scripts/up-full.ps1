# Runs full stack (db + api + web)
$ErrorActionPreference = 'Stop'
docker compose --profile full up --build
