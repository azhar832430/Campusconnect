# Architecture and design decisions

## Request flow

1. The user interacts with the React interface.
2. `client/src/lib/api.js` sends JSON requests to the API URL configured by `VITE_API_URL`.
3. Express applies security headers, CORS, JSON body parsing, logging, and API rate limiting.
4. Route handlers validate and process CRUD operations through Mongoose models.
5. MongoDB stores documents persistently; Mongoose populates student/course references when returning enrollment records.
6. The API returns JSON with a success flag, a message, and data where relevant. The UI refreshes the affected list and dashboard after mutations.

## Main directories

```text
campusconnect/
├── client/
│   ├── src/App.jsx                 # Layout, dashboard, lists, CRUD interactions
│   ├── src/components/Modal.jsx    # Accessible modal shell
│   ├── src/components/RecordForm.jsx # Reusable validated create/edit forms
│   ├── src/lib/api.js               # Fetch wrapper and error handling
│   └── src/styles.css               # Responsive UI styling
├── server/
│   └── src/
│       ├── index.js                 # Express setup and DB connection
│       ├── models/                  # Student, Course, Enrollment schemas
│       ├── routes/                  # REST endpoints for each CRUD module
│       └── middleware/errors.js     # Not-found and central error handling
└── docs/                            # Deployment, tests, report, presentation
```

## Integrity decisions

- Student roll number and email are unique.
- Course code is unique.
- Enrollment references existing student/course documents.
- The same student cannot be enrolled in the same course in the same semester twice.
- A student/course cannot be deleted while enrollments refer to it; remove those enrollments first.
- Form constraints are duplicated on the backend because client validation can be bypassed.

## Security and production limitations

The app uses Helmet, a request-size limit, rate limiting, and configurable CORS. It does not implement user authentication or role-based access control, because those are not explicitly requested in the provided assignment. Consequently, do not expose real student records publicly. A production version must add authentication, authorization, audit logging, stricter database network access, pagination, backups, and privacy controls.
