# Demo Runbook (2?3 minutes)

## Preconditions
- Option A (full stack in Docker): run scripts/up-full.ps1
- Option B (API in Docker + web local):
  - run scripts/up-core.ps1
  - then run `npm run dev` from web/ (if you prefer local dev)

## URLs to Open
- Frontend: http://localhost:3000
- Swagger UI: http://localhost:8080/swagger-ui/index.html

## Demo Flow

### 1) Register
- Click ?Create Account?.
- Enter an email and a strong password.
- Submit.
- Success looks like: redirect to Login and a clean success state (no error banner).

### 2) Login
- Enter the same credentials.
- Submit.
- Success looks like: dashboard loads with stats tiles and audit log section.

### 3) Dashboard
- Confirm you see: Active Sessions, Revoked Tokens, Blocked Attempts, Total Users.
- Success looks like: tiles render values and audit log table is visible.

### 4) Profile
- Click ?Profile?.
- Edit display name and optionally photo URL.
- Save.
- Success looks like: updated name/photo shown, no error message.

### 5) Security
- Click ?Security Settings?.
- Change password (old + new, confirm).
- Success looks like: green success message for password change.

### 6) Delete Account (if available)
- Navigate to ?Delete Account?.
- If the flow is implemented, follow prompts.
- Success looks like: confirmation message or redirect to Login.

## Common Demo Failures and Quick Fixes
- Ports in use (3000/8080/5432/6379): stop conflicting services or edit .env and re-run scripts/up-full.ps1.
- Docker not running: start Docker Desktop and re-run scripts/up-full.ps1.
- API not reachable (frontend errors): ensure scripts/up-full.ps1 or scripts/up-core.ps1 is running; verify http://localhost:8080 is reachable.
- Swagger not opening: run scripts/export-openapi.ps1 and refresh; ensure API is up.
- Web cannot reach API: confirm NEXT_PUBLIC_API_BASE_URL in .env.example/.env and restart web.
- CORS errors: ensure frontend uses http://localhost:3000 and API allows that origin.
