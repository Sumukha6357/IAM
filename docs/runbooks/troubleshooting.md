# Troubleshooting

## Docker not running
- Symptom: compose fails, daemon not reachable.
- Fix: start Docker Desktop, then rerun scripts/up-core.ps1 or scripts/up-full.ps1.

## Ports already in use (3000/8080/5432/6379)
- Symptom: bind errors or containers won?t start.
- Fix: stop conflicting services or change ports in .env, then rerun scripts.

## DB connection errors
- Symptom: API logs show datasource connection failure.
- Fix: ensure db service is healthy (scripts/up-core.ps1), check POSTGRES_* values in .env.

## Redis connection errors
- Symptom: API logs mention Redis connection refused.
- Fix: ensure redis is running; verify REDIS_PORT and compose status.

## Swagger not opening
- Symptom: http://localhost:8080/swagger-ui/index.html is blank or 404.
- Fix: run scripts/export-openapi.ps1 and refresh; confirm API is running.

## Web can?t reach API
- Symptom: frontend shows network errors or auth failures.
- Fix: verify API is up; confirm NEXT_PUBLIC_API_BASE_URL in .env/.env.example; restart web.

## CORS issues
- Symptom: browser console shows CORS blocked.
- Fix: ensure frontend runs on http://localhost:3000 and API CORS allows it.
