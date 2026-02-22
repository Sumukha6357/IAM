# Architecture Decisions

## Monorepo Structure
- Decision: Keep backend and frontend in a single repo under c:/Proj/IAM.
- Why: Shared versioning, simpler local setup, and unified docs.
- Tradeoff: Larger repo and broader change scope per commit.

## Docker Profiles (core/full)
- Decision: Use compose profiles: core (db + redis + api) and full (core + web).
- Why: Faster backend-only workflows and optional frontend container.
- Tradeoff: Requires awareness of profiles for consistent startup.

## Environment Strategy
- Decision: Provide .env.example at repo root and map compose vars into Spring via application.yml.
- Why: Single source of truth for local config with clean defaults.
- Tradeoff: Must keep compose, .env.example, and application.yml in sync.

## OpenAPI Generation
- Decision: Generate OpenAPI from Springdoc and export /v3/api-docs to docs/api/openapi.json.
- Why: Generated docs reflect the running API and stay aligned with code.
- Tradeoff: Requires running the API to refresh docs.

## Testing Strategy
- Decision: One-command tests per layer (mvn test, npm run lint/build) with a runbook.
- Why: Clear local validation baseline and reproducible workflow.
- Tradeoff: Lint/build can be slower than unit-only checks.
