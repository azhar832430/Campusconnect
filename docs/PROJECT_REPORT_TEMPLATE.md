# CampusConnect: Design and Development of a Responsive CRUD-Based Website

> Replace every bracketed item with your own details and actual evidence. Do not claim a test passed unless you performed it. Insert real URLs only after deployment.

## 1. Project title and domain

**Title:** CampusConnect — University Management System  
**Domain:** Education / University Administration

## 2. Student information

- Student name: [Your full name]
- Roll number: [Your roll number]
- Course: SW417 — Web Engineering
- Instructor: Engr. Asmatullah Zubair
- Department/campus: [Your department/campus]
- Batch: K23SW

## 3. Problem statement and objectives

Manual or disconnected academic records can make student information, course catalogs, and enrollment records difficult to maintain consistently. CampusConnect provides one responsive interface for managing these records and links each enrollment to a valid student and course.

Objectives:

1. Build a responsive, interactive website for university administration.
2. Implement three modules with Create, Read, Update, and Delete operations.
3. Persist records in MongoDB and connect the frontend to a REST API.
4. Validate input, show meaningful feedback, and confirm destructive actions.
5. Test the system, deploy it to a compatible hosting platform, and demonstrate it.

## 4. Domain description and purpose

CampusConnect is an academic demonstration application intended to show how student, course, and enrollment information can be managed through a centralized web system. It is a prototype and does not include production authentication or authorization.

## 5. CRUD modules

### 5.1 Student Management

Attributes: name, roll number, email, department, semester, phone.  
Create: add a student through a validated form. Read: list/search student records and retrieve a record by ID. Update: edit student information. Delete: remove a student only after confirming that no enrollments depend on the record.

### 5.2 Course Management

Attributes: course code, title, credit hours, instructor, department, description.  
Create, read, update, and delete course records. Course codes are unique; a course with enrollments cannot be deleted until the linked enrollments are removed.

### 5.3 Enrollment Management

Attributes: student reference, course reference, semester, status, enrollment date.  
Create enrollments for existing students and courses; view/search/filter registrations; update status or details; delete registrations after confirmation. A student/course/semester combination must be unique.

## 6. Technology stack

- Frontend: React, Vite, JavaScript, CSS, Lucide icons.
- Backend: Node.js, Express REST API.
- Database: MongoDB Atlas with Mongoose models.
- API communication: HTTP and JSON.
- Deployment target: [Frontend provider] and [Backend provider].
- Source control: Git and GitHub.

## 7. Architecture and database design

The React frontend sends JSON requests to the Express API. The API validates input and reads/writes MongoDB using Mongoose. The API returns JSON responses containing success state, messages, and record data.

### Entities and attributes

| Entity | Attributes | Constraints / relationship |
|---|---|---|
| Student | `_id`, name, rollNumber, email, department, semester, phone, timestamps | Unique roll number and email; semester 1–12 |
| Course | `_id`, courseCode, title, creditHours, instructor, department, description, timestamps | Unique course code; credit hours 1–6 |
| Enrollment | `_id`, student, course, semester, status, enrolledOn, timestamps | References Student and Course; unique student/course/semester; status is Enrolled, Completed, or Withdrawn |

### Relationships

A student can have multiple enrollments. A course can have multiple enrollments. Each enrollment references one student and one course. This models a many-to-many relationship between students and courses through the Enrollment collection.

Insert your own database relationship diagram here: [Add diagram].

## 8. Screenshots

Insert actual screenshots and captions for:

1. Dashboard.
2. Student list and student creation form.
3. Student update and deletion confirmation.
4. Course list and course creation form.
5. Enrollment list and enrollment creation form.
6. Validation/error message.
7. Responsive mobile layout.
8. Database persistence or API health check.

## 9. Testing results

Use `docs/TESTING.md` as the test plan. Include the test ID, input/steps, expected output, actual output, pass/fail, and screenshot or API response evidence. Summarize the actual results here:

- Tests performed: [number]
- Passed: [number]
- Failed: [number]
- Outstanding issues: [details]

## 10. Challenges and resolutions

Document challenges you personally encountered and how you resolved them. Possible areas to discuss only if they occurred: MongoDB connection configuration, CORS, duplicate-key validation, enrollment references, deployment environment variables, or responsive table layouts.

## 11. Live website URL

[Paste the deployed frontend URL and verify it is accessible to your instructor.]

## 12. GitHub source code repository

[Paste your public repository URL. Ensure no `.env` file, database password, or secret key is committed.]

## 13. Presentation video link

[Upload the recorded demonstration to Google Drive, set an appropriate viewer permission, and paste the accessible link.]

## Conclusion

Summarize what the implemented and tested application accomplishes, the final results, and limitations. Base the conclusion on your actual implementation and tests.
