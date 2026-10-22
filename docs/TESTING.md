# CampusConnect testing plan

Run these tests locally and repeat the critical tests on the deployed website. Fill in the actual result and evidence columns after testing; do not mark tests passed without running them.

| ID | Area | Test | Expected result | Actual result / evidence |
|---|---|---|---|---|
| T01 | API | Open `/api/health` with MongoDB running | HTTP 200; `success: true`; database connected | Pending |
| T02 | Student Create | Submit a valid student | HTTP 201; student appears in list | Pending |
| T03 | Student Read | Open student list and individual endpoint | Correct student details returned | Pending |
| T04 | Student Update | Change semester or phone | Updated data appears after reload | Pending |
| T05 | Student Delete | Delete student without enrollments | Confirmation shown; record removed | Pending |
| T06 | Student validation | Submit without name/roll/email/department/semester | Form/API rejects invalid data | Pending |
| T07 | Student uniqueness | Reuse an existing roll number or email | HTTP 409 with useful message | Pending |
| T08 | Course Create | Submit a valid course | HTTP 201; course appears in list | Pending |
| T09 | Course Read | Search by course code/title | Matching course appears | Pending |
| T10 | Course Update | Edit instructor or credit hours | Updated data persists | Pending |
| T11 | Course Delete | Delete course without enrollments | Confirmation shown; record removed | Pending |
| T12 | Course validation | Submit invalid credit hours or missing fields | Form/API rejects invalid data | Pending |
| T13 | Enrollment Create | Link existing student and course | Enrollment appears with populated names | Pending |
| T14 | Enrollment Read | Filter by status/search by student | Correct results displayed | Pending |
| T15 | Enrollment Update | Change status to Completed | New status persists | Pending |
| T16 | Enrollment Delete | Confirm delete | Enrollment is removed | Pending |
| T17 | Relationship integrity | Delete student/course with an enrollment | HTTP 409; record remains intact | Pending |
| T18 | Referential validation | Submit nonexistent student/course ID | Request rejected | Pending |
| T19 | Persistence | Refresh/restart backend after creating a record | Record remains in MongoDB | Pending |
| T20 | UX | Cancel a delete confirmation | Record remains unchanged | Pending |
| T21 | Responsive | Test narrow mobile, tablet, desktop widths | Navigation and tables remain usable | Pending |
| T22 | Deployment | Open live site and health endpoint | Site loads; API/database connected | Pending |

## Suggested API smoke tests

Use Postman, Insomnia, or curl. Store returned `_id` values to use in update, delete, and enrollment requests.

1. `GET /api/health`
2. `POST /api/students` with valid data, then `GET /api/students`.
3. `PUT /api/students/:id`, then read the student again.
4. Create a course with `POST /api/courses` and read it.
5. Create an enrollment with the student and course IDs.
6. Attempt to delete the student while enrolled; expect HTTP 409.
7. Update enrollment status, then delete enrollment.
8. Delete the student and course; verify both are gone.
9. Repeat duplicate and invalid-input cases.

## Evidence to capture

- Dashboard with counts.
- Student list, create form, and edit result.
- Course list, create form, and edit result.
- Enrollment list showing student/course relation and status.
- Required-field or invalid-email error.
- Delete confirmation dialog.
- Successful delete and relationship-protection error.
- Browser widths for desktop and mobile.
- API health JSON and one persistence check after refresh.
