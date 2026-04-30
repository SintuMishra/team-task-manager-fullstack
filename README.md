# Team Task Manager

Team Task Manager is a full-stack project management application for creating projects, managing team members, assigning tasks, and tracking progress with backend-enforced role-based access control.

## Submission Links

- Live URL: `LIVE_URL_HERE`
- GitHub Repository: `GITHUB_REPO_HERE`
- Demo Video: `DEMO_VIDEO_LINK_HERE`

## Overview

This project was built for a company assignment that required:

- authentication with signup and login
- project and team management
- task creation, assignment, and status tracking
- dashboard metrics and overdue visibility
- REST APIs with database-backed persistence
- role-based access control for Admin and Member users
- Railway deployment readiness

The current implementation preserves those requirements with a React + Vite frontend, Express API, PostgreSQL database, Prisma ORM, JWT authentication, and production deployment support.

## Key Features

- User signup, login, logout, and authenticated session persistence
- JWT-protected API routes with bcrypt password hashing
- Backend-enforced RBAC for `ADMIN` and `MEMBER` roles
- Project CRUD for authorized users
- Project team member management by email
- Task creation, assignment, editing, deletion, and assignee status updates
- Dashboard metrics for total work, task status, overdue tasks, recent tasks, and project progress
- Search and filtering for projects and tasks
- Responsive UI for desktop, tablet, and mobile screens
- Railway-ready deployment with health check support

## Roles and Permissions

| Capability | Admin | Member |
| --- | --- | --- |
| View dashboard | Yes | Yes |
| View accessible projects | Yes | Yes |
| Create project | Yes | No |
| Edit project | Yes | No |
| Delete project | Yes | No |
| Add project members | Yes | No |
| Remove project members | Yes | No |
| Create task | Yes | No |
| Assign task | Yes | No |
| Edit any accessible task | Yes | No |
| Delete task | Yes | No |
| Update assigned task status | Yes | Yes, only assigned tasks |

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT, bcrypt |
| Tooling | Nodemon, Concurrently |
| Deployment | Railway |

## Architecture Overview

- `client/` contains the React single-page application.
- `server/` contains the Express API, Prisma schema, and seed logic.
- The frontend communicates with the backend through REST endpoints under `/api`.
- The backend enforces authentication and authorization with middleware on protected routes.
- In production, the Express server serves both the API and the built frontend bundle from `client/dist`.

## Folder Structure

```text
team-task-manager-fullstack/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── server/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── scripts/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── prisma.config.ts
├── submission-assets/
├── .env.example
├── package.json
├── railway.json
└── README.md
```

## Database Models Overview

| Model | Purpose |
| --- | --- |
| `User` | Stores account identity, role, and password hash |
| `Project` | Stores project details and ownership |
| `ProjectMember` | Stores project-to-user membership links |
| `Task` | Stores task details, assignment, due date, and status |

### Enums

- `Role`: `ADMIN`, `MEMBER`
- `TaskStatus`: `TODO`, `IN_PROGRESS`, `DONE`
- `Priority`: `LOW`, `MEDIUM`, `HIGH`

### Relationship Summary

- One user can own many projects.
- One project can have many members.
- One project can have many tasks.
- One user can be assigned many tasks.
- One user can create many tasks.

## API Endpoints

| Area | Method | Endpoint | Purpose |
| --- | --- | --- | --- |
| Auth | `POST` | `/api/auth/signup` | Create a user account |
| Auth | `POST` | `/api/auth/login` | Log in and receive JWT |
| Auth | `GET` | `/api/auth/me` | Get current authenticated user |
| Auth | `PUT` | `/api/auth/me` | Update profile |
| Projects | `GET` | `/api/projects` | List accessible projects |
| Projects | `POST` | `/api/projects` | Create a project |
| Projects | `GET` | `/api/projects/:id` | Get project details |
| Projects | `PUT` | `/api/projects/:id` | Update a project |
| Projects | `DELETE` | `/api/projects/:id` | Delete a project |
| Members | `GET` | `/api/projects/:id/members` | List project members |
| Members | `POST` | `/api/projects/:id/members` | Add member by email |
| Members | `DELETE` | `/api/projects/:id/members/:userId` | Remove project member |
| Tasks | `GET` | `/api/projects/:projectId/tasks` | List project tasks |
| Tasks | `POST` | `/api/projects/:projectId/tasks` | Create task |
| Tasks | `GET` | `/api/tasks/:id` | Get task details |
| Tasks | `PUT` | `/api/tasks/:id` | Update task |
| Tasks | `PATCH` | `/api/tasks/:id/status` | Update task status |
| Tasks | `DELETE` | `/api/tasks/:id` | Delete task |
| Dashboard | `GET` | `/api/dashboard` | Get dashboard metrics |
| Health | `GET` | `/api/health` | Health check for deployment |

## Environment Variables

### Root `.env.example`

| Variable | Required | Example | Notes |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | `postgresql://postgres:postgres@localhost:5432/team_task_manager?schema=public` | Shared local example for Prisma and API |
| `JWT_SECRET` | Yes | `replace-with-a-long-random-jwt-secret` | Use a strong secret in real environments |
| `PORT` | Yes | `5000` | API server port |
| `FRONTEND_URL` | Yes | `http://localhost:5173` | CORS allowlist origin |

### Server `server/.env.example`

| Variable | Required | Example | Notes |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | `postgresql://postgres:postgres@localhost:5432/team_task_manager?schema=public` | Prisma and Express database connection |
| `JWT_SECRET` | Yes | `replace-with-a-long-random-jwt-secret` | JWT signing secret |
| `PORT` | Yes | `5000` | Railway overrides this automatically in production |
| `FRONTEND_URL` | Yes | `http://localhost:5173` | Single origin or comma-separated allowlist |

### Client `client/.env.example`

| Variable | Required | Example | Notes |
| --- | --- | --- | --- |
| `VITE_API_URL` | Optional | `http://localhost:5000/api` | Leave unset in production when Express serves the frontend |

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment files

```bash
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env
```

If you change `PORT` in `server/.env`, update `client/.env` so `VITE_API_URL` points to the same backend port during local development.

### 3. Generate Prisma client

```bash
npm run prisma:generate
```

### 4. Apply database migrations

```bash
npm run prisma:migrate
```

### 5. Seed demo data

```bash
npm run seed
```

### 6. Start the app locally

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

## Production Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start client and server in development |
| `npm run build` | Build frontend and generate Prisma client |
| `npm run start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Apply production-safe Prisma migrations |
| `npm run seed` | Seed demo data |
| `npm run smoke:dashboard` | Verify dashboard login and API response shape |

## Demo Credentials

### Admin

- Email: `admin@example.com`
- Password: `admin123`

### Member

- Email: `member@example.com`
- Password: `member123`

## Dashboard Response Shape

The dashboard endpoint is designed to safely return zero values and empty arrays when no project or task data exists.

```json
{
  "totalProjects": 0,
  "totalTasks": 0,
  "todoTasks": 0,
  "inProgressTasks": 0,
  "completedTasks": 0,
  "overdueTasks": 0,
  "myAssignedTasks": [],
  "recentTasks": [],
  "projectProgress": []
}
```

## Railway Deployment Guide

### 1. Create the services

- Create a new Railway project.
- Add a PostgreSQL service.
- Connect this repository as the application service.

### 2. Set environment variables

- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`
- `NODE_ENV=production`
- `PORT` is typically injected by Railway, but the app supports it explicitly

### 3. Build and start commands

The repository already includes:

- `railway.json`
- root `npm run build`
- root `npm run start`
- Prisma production migration command

Recommended deployment flow:

```bash
npm install
npm run build
npm run prisma:migrate
npm run start
```

### 4. Verify deployment

- Open `GET /api/health`
- Log in as Admin
- Log in as Member
- Confirm dashboard, projects, and task flows work

## Testing Checklist

- Signup succeeds with valid inputs
- Signup rejects duplicate email
- Login works for admin and member users
- Protected routes reject unauthenticated access
- Admin can create, edit, and delete projects
- Admin can add and remove project members
- Admin can create, assign, edit, and delete tasks
- Member can view accessible projects and tasks
- Member can update status only for assigned tasks
- Dashboard loads metrics for both admin and member users
- Overdue tasks are highlighted
- Empty states render cleanly when data is absent
- `npm run smoke:dashboard` passes
- `npm run build` passes
- `GET /api/health` returns success

## Screenshots

Add screenshots before submission:

- Login page
- Signup page
- Admin dashboard
- Projects page
- Project details page
- Task create or edit form
- Member dashboard or assigned tasks view
- RBAC difference between admin and member

## Submission Checklist

- Replace `LIVE_URL_HERE`
- Replace `GITHUB_REPO_HERE`
- Replace `DEMO_VIDEO_LINK_HERE`
- Add screenshots to this README
- Verify `.env` files are not committed
- Verify Railway environment variables are set
- Run `npm run build`
- Run `npm run smoke:dashboard`
- Confirm admin and member login
- Record and upload the demo video

## Known Notes

- `npm run prisma:migrate` and `npm run seed` require a running PostgreSQL instance that matches `DATABASE_URL`.
- During local development, `client/.env` should point to the same backend port defined in `server/.env`.
- The backend uses `FRONTEND_URL` for CORS and `PORT` for local or Railway runtime binding.

## Author

- GitHub: https://github.com/SintuMishra
- Project: Team Task Manager
