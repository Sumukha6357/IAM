# Developer Command Runbook

## scripts/up-core.ps1
- Use when you want backend + dependencies only.
- Starts db, redis, and api via compose core profile.

## scripts/up-full.ps1
- Use for full-stack local run.
- Starts db, redis, api, and web via compose full profile.

## scripts/down.ps1
- Use to stop all services cleanly.
- Removes orphaned containers left from earlier compose changes.

## scripts/reset-db.ps1
- Use when you need a clean database.
- Stops containers, removes volumes, then starts core profile.

## scripts/export-openapi.ps1
- Use to regenerate docs/api/openapi.json from the running API.
- Starts core in background if needed, exports from /v3/api-docs.

## scripts/test-backend.ps1
- Use to run backend unit tests.
- Runs mvn test in api.

## scripts/test-frontend.ps1
- Use to validate frontend.
- Runs npm run lint and npm run build in web.

## scripts/test-all.ps1
- Use for full local validation.
- Runs backend tests then frontend lint/build.
