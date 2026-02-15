# Architecture Overview

## Components
- Backend: Spring Boot (Java 17)
- Frontend: Next.js
- DB: Postgres
- Cache: Redis (optional)

## Auth Flow (high level)
1) Register/Login
2) JWT issued
3) Protected routes call backend with token
