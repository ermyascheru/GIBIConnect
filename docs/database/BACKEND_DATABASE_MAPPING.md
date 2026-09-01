# GIBIConnect Backend Database Mapping (All 35 Tables)

This document maps all 35 PostgreSQL database tables to their respective Backend Repositories, Services, Controllers, API Endpoints, and Frontend consumers.

| # | Table | Repository | Service | Controller | API Endpoint | Frontend Usage |
|---|---|---|---|---|---|---|
| 1 | `users` | `UserRepository` | `AuthService` / `UserService` | `AuthController` / `UserController` | `/api/auth/register`, `/api/auth/login`, `/api/users/me` | Authentication context, profile, login/register modals |
| 2 | `institutions` | `InstitutionRepository` | `InstitutionService` | `InstitutionController` | `/api/institutions`, `/api/institutions/:id`, `/api/institutions/:slug` | Institutions directory, filter sidebar, Institution Details header |
| 3 | `scholarships` | `ScholarshipRepository` | `ScholarshipService` | `ScholarshipController` | `/api/scholarships`, `/api/scholarships/:id` | Scholarships discovery page, scholarship cards |
| 4 | `careers` | `CareerRepository` | `CareerService` | `CareerController` | `/api/careers` | Career exploration grid, program career tags |
| 5 | `categories` | `CategoryRepository` | `CategoryService` | `CategoryController` | `/api/categories` | Resource catalog taxonomy filter pills |
| 6 | `tags` | `TagRepository` | `TagService` | `TagController` | `/api/tags` | Keyword tag pills, tag cloud search |
| 7 | `institution_verification` | `VerificationRepository` | `VerificationService` | `AdminController` | `/api/admin/verifications`, `/api/admin/verifications/:id` | Verified badge on institution profiles, admin audit queue |
| 8 | `faculties` | `FacultyRepository` | `FacultyService` | `InstitutionController` | `/api/institutions/:id/faculties` | Institution Details -> Faculties & Departments tab |
| 9 | `institution_scholarships` | `ScholarshipRepository` | `ScholarshipService` | `InstitutionController` | `/api/institutions/:id/scholarships` | Institution Details -> Scholarships tab |
| 10 | `facilities` | `FacilityRepository` | `FacilityService` | `InstitutionController` | `/api/institutions/:id/facilities` | Institution Details -> Overview -> Campus Facilities |
| 11 | `reviews` | `ReviewRepository` | `ReviewService` | `ReviewController` | `/api/institutions/:id/reviews` | Institution Details -> Reviews tab, rating submission |
| 12 | `institution_news` | `NewsRepository` | `NewsService` | `InstitutionController` | `/api/institutions/:id/news` | Institution Details -> News feed, home updates |
| 13 | `academic_calendar` | `CalendarRepository` | `CalendarService` | `InstitutionController` | `/api/institutions/:id/calendar` | Institution Details -> Calendar timeline view |
| 14 | `saved_institutions` | `SavedRepository` | `SavedService` | `UserController` | `/api/users/me/saved-institutions` | Bookmark button, Profile -> Saved Institutions |
| 15 | `saved_scholarships` | `SavedRepository` | `SavedService` | `UserController` | `/api/users/me/saved-scholarships` | Bookmark button, Profile -> Saved Scholarships |
| 16 | `comparisons` | `ComparisonRepository` | `ComparisonService` | `ComparisonController` | `/api/comparisons`, `/api/comparisons/:id` | Comparison tool modal, side-by-side matrix view |
| 17 | `ai_conversations` | `AIConversationRepository` | `AIService` | `AIController` | `/api/ai/conversations`, `/api/ai/conversations/:id` | AI Consultation chat sidebar, session manager |
| 18 | `audit_logs` | `AuditRepository` | `AuditService` | `AdminController` | `/api/admin/audit-logs` | Admin Dashboard -> Compliance & Audit Log |
| 19 | `authors` | `AuthorRepository` | `AuthorService` | `ResearchController` | `/api/research/authors`, `/api/research/authors/:id` | Author profiles, ORCID badges, paper attribution |
| 20 | `departments` | `DepartmentRepository` | `DepartmentService` | `InstitutionController` | `/api/institutions/:id/departments` | Institution Details -> Departments accordion |
| 21 | `ai_messages` | `AIMessageRepository` | `AIService` | `AIController` | `/api/ai/conversations/:id/messages` | AI chat window message history, grounding citations |
| 22 | `programs` | `ProgramRepository` | `ProgramService` | `ProgramController` | `/api/programs`, `/api/programs/:id`, `/api/institutions/:id/programs` | Programs catalog page, Institution Details -> Programs |
| 23 | `admissions` | `AdmissionRepository` | `AdmissionService` | `AdmissionController` | `/api/admissions`, `/api/institutions/:id/admissions` | Admissions page, Institution Details -> Admissions |
| 24 | `tuition_fees` | `TuitionRepository` | `TuitionService` | `InstitutionController` | `/api/institutions/:id/tuition` | Institution Details -> Tuition fee schedule table |
| 25 | `program_careers` | `ProgramRepository` | `CareerService` | `ProgramController` | `/api/programs/:id/careers` | Program Details -> Career Prospects section |
| 26 | `saved_programs` | `SavedRepository` | `SavedService` | `UserController` | `/api/users/me/saved-programs` | Bookmark button, Profile -> Saved Programs |
| 27 | `resources` | `ResourceRepository` | `ResourceService` | `ResourceController` | `/api/resources`, `/api/resources/:id`, `/api/institutions/:id/resources` | Resources catalog page (/resources), Institution Details -> Resources |
| 28 | `research` | `ResearchRepository` | `ResearchService` | `ResearchController` | `/api/research`, `/api/research/:id`, `/api/institutions/:id/research` | Research catalog page (/research), Institution Details -> Research |
| 29 | `resource_categories` | `ResourceRepository` | `CategoryService` | `ResourceController` | `/api/resources?category=:slug` | Resource category filter badges |
| 30 | `resource_tags` | `ResourceRepository` | `TagService` | `ResourceController` | `/api/resources?tag=:slug` | Resource keyword tag badges |
| 31 | `resource_bookmarks` | `SavedRepository` | `ResourceService` | `UserController` | `/api/users/me/saved-resources` | Bookmark resource button, Profile -> Saved Resources |
| 32 | `resource_views` | `ResourceRepository` | `ResourceService` | `ResourceController` | `/api/resources/:id/view` | View counter analytics on resource cards |
| 33 | `resource_downloads` | `ResourceRepository` | `ResourceService` | `ResourceController` | `/api/resources/:id/download` | Secure download trigger and download counter |
| 34 | `resource_reports` | `ReportRepository` | `ReportService` | `AdminController` | `/api/resources/:id/report`, `/api/admin/reports` | Report modal on resources, Admin moderation queue |
| 35 | `research_authors` | `ResearchRepository` | `AuthorService` | `ResearchController` | `/api/research/:id/authors` | Research paper authors list, corresponding author flag |
