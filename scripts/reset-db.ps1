Write-Host "==> IAM: reset-db"
Write-Host "Running: docker compose down -v"
docker compose down -v
Write-Host "Running: docker compose --profile core up --build"
docker compose --profile core up --build
