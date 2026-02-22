Write-Host "==> IAM: export-openapi"
$ErrorActionPreference = 'Stop'

# Ensure core stack is running
$apiId = docker compose --profile core ps -q api
if (-not $apiId) {
    Write-Host "Starting core stack (background)..."
    docker compose --profile core up -d --build
} else {
    $running = (docker inspect -f '{{.State.Running}}' $apiId) 2>$null
    if ($running -ne 'true') {
        Write-Host "Starting core stack (background)..."
        docker compose --profile core up -d --build
    }
}

# Give the API a moment to come up
Start-Sleep -Seconds 3

$uri = 'http://localhost:8080/v3/api-docs'
$outFile = Join-Path $PSScriptRoot '..\docs\api\openapi.json'
Write-Host "Exporting OpenAPI from $uri"

curl.exe -s $uri -o $outFile

if ((Test-Path $outFile) -and ((Get-Item $outFile).Length -gt 0)) {
    Write-Host "OpenAPI exported to $outFile"
} else {
    throw "OpenAPI export failed or empty file: $outFile"
}
