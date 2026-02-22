Write-Host "==> IAM: test-all"
Write-Host "Running: test-backend.ps1, then test-frontend.ps1"
& "$PSScriptRoot\test-backend.ps1"
& "$PSScriptRoot\test-frontend.ps1"
