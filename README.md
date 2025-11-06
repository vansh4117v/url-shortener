# URL Shortener

<!-- Badges -->
![React](https://img.shields.io/badge/React-19.0.0-blue) ![Vite](https://img.shields.io/badge/Vite-7.0.4-brightgreen) ![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey) ![Mongoose](https://img.shields.io/badge/Mongoose-8.17.1-red) ![Redis client](https://img.shields.io/badge/redis--client-5.9.0-orange) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.12-blueviolet) ![Node](https://img.shields.io/badge/Node-%3E%3D16-brightgreen)

A full‑stack URL shortener built with React (Vite) frontend and an Express + MongoDB backend. Features include user authentication (JWT via cookies), custom short IDs, click tracking with Redis caching, and rate limiting.



## Features

 **Core Features**
- Email/password authentication with JWT cookies
- Shorten URLs with optional custom short IDs
- Fast redirect/retrieval via Redis caching
- Click tracking with real-time counters
- Per-user URL management dashboard
- Rate limiting on auth and URL creation endpoints
- Input validation with Zod

## Architecture

- **Client**: React + Vite in `client/` (uses Tailwind-style UI components)
- **Server**: Express app in `server/` connecting to MongoDB and Redis
- **Authentication**: JWT stored in HTTP-only cookie
- **Redis**: Caching shortId → longUrl mappings and click counters
  

## Tech Stack

**Frontend**
- React 19 with Vite
- TailwindCSS 4 for styling
- React Router for navigation
- Axios for API calls
- Radix UI components
- React Hook Form + Zod validation

**Backend**
- Express 5
- MongoDB with Mongoose
- Redis for caching
- JWT authentication
- bcryptjs for password hashing
- Winston for logging
- Helmet & CORS for security


## Quick start (development)

### 1️⃣ Clone and install dependencies

```powershell
# Clone the repository
git clone https://github.com/vansh4117v/url-shortener.git
cd url-shortener

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2️⃣ Setup environment variables

Create `.env` files in both `server/` and `client/` directories.

**Server** (`server/.env`):
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/urlshortener
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173
REDIS_URL=redis://localhost:6379
```

**Client** (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Tip**: Copy from `.env.example` files if available

### 3️⃣ Start Redis server

Make sure Redis is running locally:
```powershell
redis-server
# or use Docker: docker run -d -p 6379:6379 redis
```

### 4️⃣ Run the application

Open two terminal windows:

**Terminal 1 - Server:**
```powershell
cd server
npm run dev
```

**Terminal 2 - Client:**
```powershell
cd client
npm run dev
```

The client will open at `http://localhost:5173` and connect to the API at `http://localhost:5000`.


## API Endpoints

**Base URL**: `http://localhost:5000/api`

### 🔐 Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/signup` | Register new user | ❌ |
| `POST` | `/auth/signin` | Sign in user | ❌ |
| `GET` | `/auth/me` | Get current user | ✅ |
| `POST` | `/auth/logout` | Logout user | ✅ |

### 🔗 URL Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/url/shorten` | Create short URL | ✅ |
| `GET` | `/url/` | Get all user URLs | ✅ |
| `GET` | `/url/:shortId` | Redirect to long URL | ❌ |
| `GET` | `/url/:shortId/info` | Get URL metadata | ✅ |
| `DELETE` | `/url/:shortId` | Delete URL | ✅ |




---

**Made with by [vansh4117v](https://github.com/vansh4117v)**
