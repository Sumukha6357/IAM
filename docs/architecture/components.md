# Components

## Core Services
- Web (Next.js): UI and client-side auth flows. Lives in web/. Runs on port 3000 in dev. Uses NEXT_PUBLIC_API_BASE_URL (compose) or NEXT_PUBLIC_API_URL (frontend code fallback) to reach the API.
- API (Spring Boot): Auth and system endpoints. Lives in api/. Exposes port 8080 by default in compose.
- DB (Postgres): Persistent user and audit data. Compose service name: db, container name: iam_db.
- Cache (Redis): Token and rate-limiting data. Compose service name: redis, container name: iam_redis.

## Communication Flow
- Browser -> Web: http://localhost:3000
- Web -> API: http://localhost:8080 (compose). Client code uses env-driven base URL.
- API -> DB: jdbc:postgresql://db:5432/${POSTGRES_DB} (compose network service name).
- API -> Redis: redis:6379 (compose network service name).

## Docker Services and Ports
- web service: exposes ${WEB_PORT:-3000}:3000
- api service: exposes ${API_PORT:-8080}:8080
- db service: exposes ${POSTGRES_PORT:-5432}:5432
- redis service: exposes ${REDIS_PORT:-6379}:6379

## Docker Profiles
- core: db + redis + api. Use for backend-only work and API docs generation.
- full: db + redis + api + web. Use for full-stack dev.
- Services without a profile run by default, but in this repo api and web are profile-bound.

## Configuration Sources
- .env.example (root): canonical env keys and defaults for compose and local runs.
- docker-compose.yml (root): service wiring, ports, and environment variable mapping.
- api/src/main/resources/application.yml: Spring Boot config with env fallbacks.
- web/.env.local (optional): Next.js runtime env values.

## Localhost vs Service Names
- From your browser: use localhost ports (3000 for web, 8080 for API).
- From containers: use compose service names (db, redis) not localhost.
