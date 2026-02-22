Write-Host "==> IAM: test-frontend"
Write-Host "Running: npm run lint; npm run build (web)"
Push-Location $PSScriptRoot\..\web
npm run lint
npm run build
Pop-Location
