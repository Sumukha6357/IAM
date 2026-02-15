# Export OpenAPI JSON (PowerShell-friendly)
$ErrorActionPreference = 'Stop'
$uri = 'http://localhost:8080/v3/api-docs'
$outFile = Join-Path $PSScriptRoot '..\docs\api\openapi.json'
Invoke-RestMethod -Uri $uri -Method Get | ConvertTo-Json -Depth 100 | Set-Content -Encoding utf8 $outFile
