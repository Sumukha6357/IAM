Write-Host "==> IAM: test-backend"
Write-Host "Running: mvn test (api)"
Push-Location $PSScriptRoot\..\api
mvn test
Pop-Location
