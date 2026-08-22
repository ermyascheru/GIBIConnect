# GIBIConnect — Frontend to Database Mapping

This document details the mapping between GIBIConnect frontend features/pages, REST APIs, and the PostgreSQL database tables (strictly universities and colleges only, excluding high schools).

| # | Database Table | Frontend Feature Area | Frontend Page(s) | REST API Endpoint | Purpose / Description |
|---|----------------|-----------------------|------------------|-------------------|-----------------------|
| 1 | `users` | Identity & Authentication | `/login`, `/register`, `/profile`, `/admin/users` | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/users/me` | User accounts, hashed passwords, contact email, user roles (User, Moderator, Admin). |
| 2 | `institutions` | Institution Directory & Details | `/institutions`, `/institutions/:slug` | `GET /api/institutions`, `GET /api/institutions/:id` | Core higher education entities (Universities & Colleges only), names, slugs, ownership, types. |
| 3 | `institution_verification` | Verification Badge & Trust | `/institutions/:slug`, `/admin/verification` | `GET /api/institutions/:id/verification`, `POST /api/admin/verify` | Official accreditation and verification records by Ethiopian Ministry of Education. |
| 4 | `faculties` | Academic Hierarchy | `/institutions/:slug/departments` | `GET /api/institutions/:id/faculties` | College/faculty divisions within universities (e.g. Faculty of Technology). |
| 5 | `departments` | Department Discovery | `/institutions/:slug/departments` | `GET /api/institutions/:id/departments` | Academic departments offering degree programs. |
| 6 | `programs` | Global & Institution Programs | `/programs`, `/programs/:slug`, `/institutions/:slug/programs` | `GET /api/programs`, `GET /api/institutions/:id/programs` | Undergraduate, Master's, PhD degree programs, durations, study modes. |
| 7 | `admissions` | Admission Requirements | `/admissions`, `/institutions/:slug/admissions` | `GET /api/institutions/:id/admissions`, `GET /api/admissions` | Entrance exam cutoff scores, GPA requirements, application timelines. |
| 8 | `tuition_fees` | Tuition & Financials | `/institutions/:slug/tuition` | `GET /api/institutions/:id/tuition` | Cost per credit hour, semester fees, living expenses for public and private institutions. |
| 9 | `scholarships` | Global Scholarship Directory | `/scholarships`, `/scholarships/:slug` | `GET /api/scholarships` | Merit and need-based scholarship grants, financial award coverage. |
| 10 | `institution_scholarships` | Institution-specific Grants | `/institutions/:slug/scholarships` | `GET /api/institutions/:id/scholarships` | Junction associating scholarship programs with sponsoring universities/colleges. |
| 11 | `facilities` | Campus Facilities & Life | `/institutions/:slug/facilities` | `GET /api/institutions/:id/facilities` | Libraries, student dormitories, laboratories, sports facilities, cafeteria info. |
| 12 | `reviews` | Student & Alumni Reviews | `/institutions/:slug/reviews` | `GET /api/institutions/:id/reviews`, `POST /api/reviews` | Verified student reviews, 5-star ratings, and peer feedback. |
| 13 | `institution_news` | News & Announcements | `/institutions/:slug/news` | `GET /api/institutions/:id/news` | Official updates, research breakthroughs, campus events. |
| 14 | `academic_calendar` | Academic Dates & Semesters | `/institutions/:slug/calendar` | `GET /api/institutions/:id/calendar` | Semester registration dates, examination periods, graduation dates. |
| 15 | `careers` | Career Guidance | `/careers`, `/careers/:slug` | `GET /api/careers` | Career profiles, salary insights, and industrial skill requirements. |
| 16 | `program_careers` | Career-to-Program Linkages | `/programs/:slug` | `GET /api/programs/:id/careers` | Junction connecting academic curricula with viable professional career tracks. |
| 17 | `saved_institutions` | User Bookmarks | `/dashboard` | `GET /api/users/saved/institutions`, `POST /api/users/saved/institutions` | User-saved universities and colleges for quick reference and tracking. |
| 18 | `saved_programs` | User Bookmarks | `/dashboard` | `GET /api/users/saved/programs`, `POST /api/users/saved/programs` | User-saved degree programs. |
| 19 | `saved_scholarships` | User Bookmarks | `/dashboard` | `GET /api/users/saved/scholarships`, `POST /api/users/saved/scholarships` | User-saved scholarship opportunities. |
| 20 | `comparisons` | Institution Comparison | `/compare` | `GET /api/comparisons`, `POST /api/comparisons` | Multi-institution comparison sessions comparing 2–4 institutions. |
| 21 | `ai_conversations` | AI Consultant Sessions | `/ai` | `GET /api/ai/conversations`, `POST /api/ai/conversations` | Conversation session threads for GIBIConnect AI Consultation. |
| 22 | `ai_messages` | Grounded AI Chat Messages | `/ai` | `POST /api/ai/ask`, `GET /api/ai/conversations/:id/messages` | Individual chat messages, role (user/assistant), database citations. |
| 23 | `audit_logs` | Security & Admin Auditing | `/admin/audit` | `GET /api/admin/audit` | Administrative audit trail for verification status changes and content moderation. |

---

### Architectural Boundaries
1. **Frontend Isolation**: React runs solely in the client browser and interacts with data via the Express REST API. No direct database drivers (`pg`, Prisma client, etc.) are present in the frontend.
2. **Database Grounded AI**: AI responses are retrieved and formatted server-side using structured PostgreSQL queries before passing context to the AI model.
