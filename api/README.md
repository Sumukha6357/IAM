# IAM Lite - Authentication & Authorization Platform

A production-ready, full-stack authentication platform with modern security features.

## ðŸš€ Quick Start

### Backend (Docker - Recommended)
```bash
cd c:/Proj/IAM/api
docker-compose up --build
```
Backend runs on: http://localhost:8081

### Frontend
```bash
cd c:/Proj/IAM/web
npm install
npm run dev
```
Frontend runs on: http://localhost:3000

## ðŸ“‹ Features

### Backend (Spring Boot)
- âœ… JWT Authentication (15-min access tokens)
- âœ… Refresh Token Rotation (7-day expiry)
- âœ… Redis Token Blacklisting
- âœ… OTP Password Reset
- âœ… Login Throttling (brute-force protection)
- âœ… Role-Based Access Control (RBAC)
- âœ… BCrypt Password Hashing

### Frontend (Next.js)
- âœ… Modern, Responsive UI
- âœ… Dark Mode Support
- âœ… Protected Routes
- âœ… Automatic Token Refresh
- âœ… Glass-morphism Design
- âœ… Smooth Animations

## ðŸ› ï¸ Tech Stack

**Backend:**
- Java 17
- Spring Boot 3.x
- Spring Security
- PostgreSQL
- Redis
- JWT (jjwt)
- Docker

**Frontend:**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

## ðŸ“ Project Structure

```
c:/Proj/IAM/
â”œâ”€â”€ api/     # Spring Boot Backend
â”‚   â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ Dockerfile
â”‚   â”œâ”€â”€ docker-compose.yml
â”‚   â””â”€â”€ pom.xml
â””â”€â”€ web/                   # Next.js Frontend
    â”œâ”€â”€ app/
    â”œâ”€â”€ lib/
    â””â”€â”€ package.json
```

## ðŸ”§ Development Setup

### Prerequisites
- **Docker** (for backend)
- **Node.js 18+** (for frontend)
- **IDE**: IntelliJ IDEA, VS Code, or Eclipse

### Backend Setup
See [BUILD_GUIDE.md](./BUILD_GUIDE.md) for detailed instructions.

### Frontend Setup
```bash
cd c:/Proj/IAM/web
npm install
npm run dev
```

## ðŸŒ API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | Login and get tokens |
| `/auth/refresh` | POST | Refresh access token |
| `/auth/logout` | POST | Logout and blacklist token |
| `/auth/password/otp` | POST | Request password reset OTP |
| `/auth/password/reset` | POST | Reset password with OTP |

## ðŸ” Security Features

1. **Stateless Authentication**: JWT-based, no server sessions
2. **Token Rotation**: Refresh tokens rotated on each use
3. **Blacklisting**: Logout adds tokens to Redis blacklist
4. **Password Security**: BCrypt hashing with salt
5. **Brute-Force Protection**: Login throttling (5 attempts, 15-min lockout)
6. **CORS**: Configured for frontend integration

## ðŸ“ Environment Variables

### Backend (.env)
```env
SERVER_PORT=8081
DB_URL=jdbc:postgresql://postgres:5432/iam_lite
DB_USERNAME=postgres
DB_PASSWORD=postgres
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=900000
REFRESH_TOKEN_EXPIRATION=604800000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8081
```

## ðŸ› Troubleshooting

### IDE Compilation Errors
If you see "User cannot be resolved" or similar errors:
1. Close IDE
2. Delete `.idea`, `target`, `.vscode` folders
3. Reopen project
4. Let IDE re-index

Or use Docker (no IDE needed):
```bash
docker-compose up --build
```

### Port Conflicts
If ports 8081, 5432, or 6379 are in use:
- Edit `docker-compose.yml` to change port mappings
- Update `.env.local` with new backend URL

## ðŸ“– Documentation

- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Detailed build instructions
- [Walkthrough](../brain/.../walkthrough.md) - Complete feature walkthrough

## ðŸ‘¨â€ðŸ’» Development

### Running Tests
```bash
cd c:/Proj/IAM/api
mvn test
```

### Building for Production
```bash
# Backend
docker build -t iam-backend .

# Frontend
cd c:/Proj/IAM/web
npm run build
```

## ðŸ“„ License

This project is for educational and portfolio purposes.

## ðŸ¤ Contributing

This is a personal project, but feedback and suggestions are welcome!
