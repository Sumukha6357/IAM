# IAM Auth Platform (Monorepo)

## What this is
Full-stack IAM Lite auth platform:
- Backend: Spring Boot (Java 17)
- Frontend: Next.js
- DB: Postgres
- Cache: Redis

## Repo layout
- iam-auth-platform/   -> backend (Spring Boot)
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
