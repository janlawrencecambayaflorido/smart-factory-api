# Automated Smart Factory and Production Line Tracking System - Backend API

ITEC 116 Final Project - Systems Integration Backend Prototype.
A REST API that tracks production lines, machines, products, production output and
machine status history, secured with JWT authentication and role-based access control
(Admin, Supervisor, Operator).

## Tech Stack
- NestJS 11 (Node.js)
- TypeORM 0.3
- MySQL / MariaDB (XAMPP)
- JWT (passport-jwt) + bcryptjs password hashing
- class-validator (input validation), @nestjs/throttler (login rate limit)
- Postman (API testing)

## How to Run Locally
1. Install Node.js (LTS) and XAMPP. Start **MySQL** in the XAMPP Control Panel.
2. In phpMyAdmin create an empty database named `smart_factory_db`.
3. Clone and install:
   ```bash
   git clone https://github.com/janlawrencecambayaflorido/smart-factory-api.git
   cd smart-factory-api
   npm install
   ```
4. Copy `.env.example` to `.env` and fill in your values.
5. Start the server:
   ```bash
   npm run start:dev
   ```
   API base URL: `http://localhost:3000/api/v1`
6. In Postman, import `Smart_Factory_API.postman_collection.json` (in the project root)
   and run **1. Auth → Login as Admin** first.

A default Admin account is created on first run from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`.

## Modules and Endpoints (29)
| Module | Endpoints |
|---|---|
| Auth | POST /auth/login, GET /auth/me, POST /auth/logout |
| Users | POST /users, GET /users |
| Production Lines | GET, GET /:id, POST, PUT /:id, PATCH /:id, DELETE /:id, GET /:id/machines |
| Machines | GET, GET /:id, POST, PATCH /:id, DELETE /:id |
| Products | GET, GET /:id, POST, PATCH /:id, DELETE /:id |
| Production Records | GET, GET /:id, POST, DELETE /:id |
| Machine Logs | GET, GET /:id, POST |
