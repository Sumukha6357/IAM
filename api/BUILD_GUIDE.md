# IAM Backend - Build & Run Guide

## Prerequisites
You need either:
- **Maven** installed globally, OR
- **Docker** (recommended - no local Java/Maven needed)

## Option 1: Docker (Recommended - No Setup Required)

### Build and Run Everything
```bash
cd c:/Proj/IAM/api
docker-compose up --build
```

This will:
- Build the Spring Boot application
- Start PostgreSQL database
- Start Redis cache
- Run the backend on http://localhost:8081

## Option 2: Local Development (Requires Maven)

### Install Maven
1. Download from: https://maven.apache.org/download.cgi
2. Extract and add to PATH
3. Verify: `mvn --version`

### Build and Run
```bash
cd c:/Proj/IAM/api
mvn clean install
mvn spring-boot:run
```

## IDE Setup

### IntelliJ IDEA
1. Open the `api` folder
2. IDEA will auto-detect Maven project
3. Wait for indexing to complete
4. Right-click `pom.xml` â†’ Maven â†’ Reload Project
5. If errors persist: File â†’ Invalidate Caches â†’ Restart

### VS Code
1. Install "Extension Pack for Java"
2. Open the `api` folder
3. VS Code will auto-configure
4. If errors: Ctrl+Shift+P â†’ "Java: Clean Java Language Server Workspace"

### Eclipse
1. File â†’ Import â†’ Maven â†’ Existing Maven Projects
2. Select `api` folder
3. Right-click project â†’ Maven â†’ Update Project

## Fixing Current IDE Errors

The compilation errors you're seeing are **IDE cache issues**. The code is correct.

**Quick Fix:**
1. Close your IDE
2. Delete these folders (if they exist):
   - `api/.idea`
   - `api/target`
   - `api/.vscode`
3. Reopen the project in your IDE
4. Let it re-index

**Or use Docker** (no IDE issues):
```bash
docker-compose up --build
```

## Testing the Backend

Once running, test with:
```bash
# Register a user
curl -X POST http://localhost:8081/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"USER"}'

# Login
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
