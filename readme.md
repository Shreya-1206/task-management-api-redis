# Task Management API with Redis

A production-style backend API for task management built with Node.js, Express, TypeScript, MongoDB, and Redis caching.
Features include JWT-based authentication, user-specific CRUD operations for tasks, and caching for improved GET API performance.

## 🚀 Features
### User Authentication

Register & Login

Password hashing using bcrypt

JWT-based authorization for protected routes

### Task Management

Create, Read, Update, Delete tasks

Tasks are user-specific

Task fields: title, description, status, priority, user

### Redis Caching

GET /tasks endpoint uses Redis caching

Cache invalidation on task create, update, delete

TTL-based caching for performance improvement

### Clean Architecture

Loader-based app initialization

Modular controllers, routes, and models

### Environment Configuration

Separate .env file for sensitive information

Easy setup for local development

## 📂 Project Structure
project-root/
│
├─ src/
│   ├─ controllers/        # API logic for tasks and auth
│   ├─ loaders/            # MongoDB, Express, Redis initialization
│   ├─ middleware/         # Auth and Redis cache middleware
│   ├─ models/             # Mongoose schemas (User, Task)
│   ├─ routes/             # API routes for auth and tasks
│   └─ app.ts              # Express app entry
│
├─ .env                    # Environment variables
├─ package.json
├─ tsconfig.json
└─ README.md

## ⚙️ Environment Variables (.env)

Create a .env file in the root directory:

PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
REDIS_URL=redis://localhost:6379


PORT: Port for Express server

MONGO_URI: MongoDB connection string (local or Atlas)

JWT_SECRET: Secret key for JWT token

REDIS_URL: Redis connection URL

## 🛠 Setup & Run
1. Clone the repository
git clone <repository-url>
cd project-root

2. Install dependencies
npm install

3. Start Redis (via Docker)
docker run -p 6379:6379 redis

4. Run the application
npm run dev

5. Test APIs

Use Postman, Insomnia, or a React client

Available routes are listed below

## 📌 API Routes
Auth Routes
Method	Route	Description
POST	/auth/register	Register a new user
POST	/auth/login	Login and get JWT
Task Routes (Protected)
Method	Route	Description
POST	/tasks	Create a new task
GET	/tasks	Get all tasks of logged-in user
PUT	/tasks/:id	Update a task (ownership check)
DELETE	/tasks/:id	Delete a task (ownership check)
## 🗃 Redis Caching

Endpoint Cached: GET /tasks

Cache Key: tasks:user:<userId>

Cache TTL: 60 seconds (configurable)

## Cache Workflow

Middleware checks Redis cache

If cache exists → return cached response

If cache miss → fetch from MongoDB and store in Redis

Cache Invalidation: On task create, update, delete

## 📌 Notes

All APIs are user-specific and protected with JWT

Redis caching improves performance for GET requests

Uses loader-based pattern for modular initialization

Follows TypeScript best practices with proper types