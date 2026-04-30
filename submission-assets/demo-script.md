# Demo Script

## Goal

Record a 2 to 5 minute walkthrough that shows the core assignment requirements working clearly and without extra filler.

## 1. Introduction

Say:

"This is Team Task Manager, a full-stack project management application where Admin and Member users can manage projects, team membership, task assignments, and progress tracking with backend-enforced role-based access control."

## 2. Tech Stack

Briefly mention:

- React + Vite frontend
- Express.js backend
- PostgreSQL database
- Prisma ORM
- JWT authentication
- bcrypt password hashing
- Railway deployment support

## 3. Admin Login

Show the login page and sign in with:

- Email: `admin@example.com`
- Password: `admin123`

Mention:

- authentication is JWT-based
- protected routes require login
- session state persists on refresh

## 4. Dashboard Overview

Open the dashboard and point out:

- total projects
- total tasks
- in progress tasks
- completed tasks
- overdue tasks
- recent tasks
- project progress

Mention that dashboard data comes from the backend and is role-aware.

## 5. Project Management

Go to the Projects page and:

- open an existing project
- create a new project or edit an existing one
- mention that only Admin users can create, edit, or delete projects

## 6. Team Member Management

Inside a project detail page:

- show the Team Members section
- add a member by email
- mention duplicate prevention and validation for non-existing users

## 7. Task Creation and Assignment

Inside the same project:

- create a task
- set title, priority, due date, and description
- assign it to a valid project member

Mention:

- only project members can be assigned
- task validation is enforced by the backend

## 8. Member Login

Log out and sign in with:

- Email: `member@example.com`
- Password: `member123`

Mention that the member sees only allowed actions and accessible data.

## 9. Member Task Update

Show that the member can:

- open assigned tasks
- update task status

Also show that the member cannot:

- create projects
- manage team membership
- edit or delete tasks they do not control

## 10. RBAC Explanation

Say:

"Role-based access control is enforced on the backend with middleware. The frontend hides unauthorized actions for clarity, but the API also blocks them directly."

## 11. Deployment Readiness

Briefly mention:

- Railway-ready configuration is included
- the app uses `PORT`, `DATABASE_URL`, and `FRONTEND_URL`
- health check endpoint: `/api/health`
- Prisma migrations run in production with `npm run prisma:migrate`

## 12. Closing

Say:

"This project meets the assignment requirements for authentication, project management, team management, task tracking, dashboard reporting, RBAC, database-backed APIs, and deployment readiness."
