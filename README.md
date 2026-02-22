# IAM Auth Platform (Monorepo)

## What this is
Full-stack IAM Lite auth platform:
- Backend: Spring Boot (Java 17)
- Frontend: Next.js
- DB: Postgres
- Cache: Redis

## Repo layout
- api/   -> backend (Spring Boot)
- web/                 -> frontend (Next.js)
- docs/                -> documentation
- scripts/             -> helper scripts

## Quickstart (Docker)
### Core (db + backend)
docker compose --profile core up --build

### Full (db + backend + frontend)
docker compose --profile full up --build

## Quickstart (Dev mode: run web locally)
docker compose --profile core up --build
cd web
npm run dev

## Env
Copy .env.example to .env and edit as needed.

## Testing
### Backend
cd api  
mvn test

### Frontend
cd web  
npm run lint  
npm run build

## Architecture Documentation
- docs/architecture/components.md
- docs/architecture/auth-flow.md
- docs/architecture/data-model.md
- docs/architecture/security-overview.md
- docs/architecture/decisions.md

## Developer Commands (Windows)
- `scripts/up-core.ps1` â€” start db + redis + api (core profile)
- `scripts/up-full.ps1` â€” start db + redis + api + web (full profile)
- `scripts/down.ps1` â€” stop services and remove orphans
- `scripts/reset-db.ps1` â€” reset volumes and start core
- `scripts/export-openapi.ps1` â€” export OpenAPI to docs/api/openapi.json
- `scripts/test-backend.ps1` â€” run backend tests
- `scripts/test-frontend.ps1` â€” run frontend lint + build
- `scripts/test-all.ps1` â€” run backend then frontend tests

## Demo Runbook
- docs/runbooks/demo.md

## Runbooks
- docs/runbooks/local-dev.md
- docs/runbooks/testing.md
- docs/runbooks/commands.md
- docs/runbooks/troubleshooting.md
- docs/runbooks/demo.md
- docs/runbooks/release-checklist.md
