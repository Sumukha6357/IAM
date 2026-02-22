# Contributing

## Prerequisites
- Docker Desktop (for compose-based runs)
- Java 17 and Maven (optional if running backend locally)
- Node.js 18+ and npm (for frontend local runs)

## Run the Project
- Core (db + redis + api): scripts/up-core.ps1
- Full (db + redis + api + web): scripts/up-full.ps1

## Run Tests
- Backend: scripts/test-backend.ps1
- Frontend: scripts/test-frontend.ps1
- Full suite: scripts/test-all.ps1

## Export OpenAPI
- scripts/export-openapi.ps1 (writes docs/api/openapi.json)

## Folder Rules
- Backend: api/
- Frontend: web/
- Documentation: docs/
- Scripts: scripts/

## Before Sharing the Repo
- Confirm scripts/test-all.ps1 passes.
- Run scripts/export-openapi.ps1 and commit updated docs/api/openapi.json.
- Ensure docker compose full profile runs cleanly.
- Verify README links and runbooks are present.
- Remove any secrets from .env; use .env.example for defaults.
