# CampusConnect — University Management System

A responsive full-stack CRUD website built for the **SW417 Web Engineering Problem-Based Learning assignment**. The application has three complete CRUD modules: Students, Courses, and Enrollments.

> **Important:** This repository is a working project implementation, but it is not yet deployed. You must configure MongoDB Atlas and hosting credentials, run the tests, deploy it, and insert your own student details and live links into the report before submission.

## Features

- Responsive React interface for desktop, tablet, and mobile.
- Dashboard counts for students, courses, enrollments, and active enrollment rate.
- Student CRUD: name, roll number, email, department, semester, and phone.
- Course CRUD: code, title, credits, instructor, department, and description.
- Enrollment CRUD: student/course relationship, semester, date, and status.
- Search across students and courses; search and status filter for enrollments.
- Client-side and server-side validation, unique roll numbers/emails/course codes, meaningful errors, and success notifications.
- Confirmation before deleting records.
- Referential integrity: students/courses with enrollments cannot be deleted until linked enrollments are removed.
- Persistent MongoDB storage; enrollment uniqueness per student/course/semester.
- REST API, CORS configuration, Helmet security headers, request logging, and API rate limiting.

## Architecture

```text
React + Vite client (port 5173)
        │ HTTP / JSON
        ▼
Express REST API (port 5000)
        │ Mongoose
        ▼
MongoDB Atlas database (campusconnect)
```

## Requirements

- Node.js 20 or newer (Node 22 recommended)
- npm
- MongoDB Atlas account (free tier is sufficient for a small academic demo)
- Git and GitHub account for source control

## Run locally

1. Install dependencies from the project root:

   ```bash
   npm install
   npm run install:all
   ```

2. Create a MongoDB Atlas database. Create a database user, allow your development IP in Network Access, and copy the connection string.

3. Copy `server/.env.example` to `server/.env` and set:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/campusconnect?retryWrites=true&w=majority
   CLIENT_ORIGIN=http://localhost:5173
   ```

   URL-encode special characters in the database password. Never commit `.env` to GitHub.

4. Copy `client/.env.example` to `client/.env`:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start both apps from the project root:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:5173`. The API health endpoint is `http://localhost:5000/api/health`.

### First use

- Add at least one student.
- Add at least one course.
- Add an enrollment linking that student and course.
- Test edit, delete, validation, search, and refresh persistence.

The application does not include seeded demo records by default. This avoids presenting fabricated campus data as real records.

## REST API reference

Base URL: `/api`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | API and database health |
| GET | `/dashboard` | Dashboard aggregate counts and recent enrollments |
| GET | `/students` | List/search students (`?search=`, `?department=`, `?semester=`) |
| GET | `/students/:id` | Read one student |
| POST | `/students` | Create a student |
| PUT | `/students/:id` | Update a student |
| DELETE | `/students/:id` | Delete student if no linked enrollments exist |
| GET | `/courses` | List/search courses (`?search=`, `?department=`) |
| GET | `/courses/:id` | Read one course |
| POST | `/courses` | Create a course |
| PUT | `/courses/:id` | Update a course |
| DELETE | `/courses/:id` | Delete course if no linked enrollments exist |
| GET | `/enrollments` | List/search enrollments (`?search=`, `?status=`) |
| GET | `/enrollments/:id` | Read one enrollment |
| POST | `/enrollments` | Create enrollment after validating student and course |
| PUT | `/enrollments/:id` | Update enrollment |
| DELETE | `/enrollments/:id` | Delete enrollment |

All responses use JSON. Successful responses contain `success: true`; error responses contain `success: false` and a human-readable `message`.

### Example API requests

Create student:

```bash
curl -X POST http://localhost:5000/api/students \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ayesha Khan","rollNumber":"K23SW001","email":"ayesha@example.com","department":"Software Engineering","semester":3,"phone":"+92 300 1234567"}'
```

Create course:

```bash
curl -X POST http://localhost:5000/api/courses \
  -H 'Content-Type: application/json' \
  -d '{"courseCode":"SW417","title":"Web Engineering","creditHours":3,"instructor":"Engr. Asmatullah Zubair","department":"Software Engineering"}'
```

Create enrollment: replace the two IDs with `_id` values returned by the API.

```bash
curl -X POST http://localhost:5000/api/enrollments \
  -H 'Content-Type: application/json' \
  -d '{"student":"STUDENT_OBJECT_ID","course":"COURSE_OBJECT_ID","semester":3,"status":"Enrolled","enrolledOn":"2026-10-21"}'
```

## Deployment overview

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for free-tier deployment instructions and environment variables. See [`docs/TESTING.md`](docs/TESTING.md) for a test matrix and [`docs/PROJECT_REPORT_TEMPLATE.md`](docs/PROJECT_REPORT_TEMPLATE.md) for the report structure required by the assignment.

## Scope and limitations

- Authentication/authorization is not implemented; the assignment brief does not explicitly require it. Do not use this demo for confidential real student data without adding access control and appropriate privacy safeguards.
- The API uses a permissive CORS default only for the local client origin; set `CLIENT_ORIGIN` to your exact deployed frontend URL for production.
- Dashboard statistics are based on current records; “active enrollment rate” is active enrollments divided by all enrollment records, not the percentage of eligible students.
- Search results are capped to keep the demo simple. A larger production deployment should add pagination and server-side indexes for search.
- Free hosting provider quotas, sleep behavior, and pricing may change; verify the provider's current plan before deployment.

## Assignment alignment

The app implements three CRUD modules with at least 12 operations, frontend/backend integration, database persistence, responsive layout, input validation, success/error feedback, deletion confirmation, deployment guidance, test documentation, report template, and presentation guidance. Final submission still requires your own implementation review, test evidence, GitHub repository URL, deployed site URL, report identity details, screenshots, and accessible video link.
