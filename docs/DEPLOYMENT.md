# Free-tier deployment guide

Deployment provider plans and free-tier conditions can change. Confirm current quotas and availability before using them for a deadline-sensitive submission.

## 1. Create the MongoDB Atlas database

1. Create an Atlas project and a free cluster, if available in your region.
2. Create a database user with a strong password.
3. In Network Access, allow connections from your deployment environment. For a simple classroom demo, a broad allowlist can be used only if permitted by your institution and provider; restrict access where possible.
4. Copy the application connection string and replace the username, password, and cluster host.
5. Use the database name `campusconnect` in the URI.

Do not commit connection strings or passwords to GitHub.

## 2. Push the source to GitHub

From the project root:

```bash
git init
git add .
git commit -m "Build CampusConnect university management system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/campusconnect.git
git push -u origin main
```

Create the GitHub repository first and replace `YOUR_USERNAME` with your own account.

## 3. Deploy the backend (example: Render web service)

1. Create a new web service and connect the GitHub repository.
2. Set the service root directory to `server`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables:

   - `NODE_ENV` = `production`
   - `MONGODB_URI` = your Atlas connection string
   - `CLIENT_ORIGIN` = your exact deployed frontend origin (for example, `https://your-project.vercel.app`)
   - `PORT` is usually assigned by the platform; the server reads it automatically.

6. Deploy and open `https://YOUR-BACKEND-HOST/api/health`. Expect JSON with `success: true` and `database: "connected"`.

The server does not serve the frontend; deploy them separately.

## 4. Deploy the frontend (example: Vercel)

1. Create a new Vercel project from the same GitHub repository.
2. Set the root directory to `client`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable `VITE_API_URL` with your backend URL plus `/api`, e.g. `https://YOUR-BACKEND-HOST/api`.
6. Deploy and open the generated site URL.

If you change `VITE_API_URL`, rebuild/redeploy the frontend. Update the backend `CLIENT_ORIGIN` to the exact frontend URL, redeploy the backend, and test again.

## 5. Final smoke test

- Open the frontend URL in a private/incognito browser window.
- Confirm the API status indicates connected.
- Create a test student and a test course.
- Create an enrollment using those records.
- Refresh the page and verify the records remain.
- Update a record, then delete the enrollment.
- Delete the test student/course after the enrollment is removed.
- Check the browser console and hosted backend logs for errors.
- Add the live frontend URL to the report and ensure the instructor can access it.

## Troubleshooting

- **Database disconnected:** verify `MONGODB_URI`, database credentials, IP/network access, and URL encoding of password characters.
- **CORS error:** set `CLIENT_ORIGIN` to the exact frontend origin including `https://`, without a trailing path; redeploy backend.
- **Client cannot reach API:** confirm `VITE_API_URL` includes `/api` and redeploy the frontend.
- **Service sleeps or is slow:** some free hosting tiers pause idle services; wait for startup and retry. Check current provider policy.
- **Duplicate key response:** roll number, email, course code, or the same student/course/semester enrollment already exists.
- **Delete blocked:** remove related enrollments before deleting a student or course.
