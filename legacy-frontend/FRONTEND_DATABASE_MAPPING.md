# GIBIConnect Frontend → API → Database Mapping

This document details the end-to-end data flow from React + Vite frontend components to Express REST APIs and PostgreSQL database tables.

| Page | Route | API Endpoint | PostgreSQL Tables | Purpose |
|---|---|---|---|---|
| **Home** | `/` | `GET /api/institutions/featured`<br>`GET /api/news`<br>`GET /api/stats` | `institutions`, `programs`, `resources`, `research`, `institution_news` | Landing page hero, search trigger, key metrics, latest news |
| **Institution List** | `/institutions` | `GET /api/institutions?region=&type=&ownership=` | `institutions`, `institution_verification` | Directory listing with region/ownership filter chips and card grid |
| **Institution Overview** | `/institutions/:id` | `GET /api/institutions/:id`<br>`GET /api/institutions/:id/facilities` | `institutions`, `institution_verification`, `facilities` | Master layout header, accreditation badge, campus facilities, contact info |
| **Institution Departments** | `/institutions/:id/departments` | `GET /api/institutions/:id/departments` | `faculties`, `departments` | Faculty breakdown accordion and department listings |
| **Institution Programs** | `/institutions/:id/programs` | `GET /api/institutions/:id/programs` | `programs`, `departments` | Program degree level filters (Bachelor, Master, PhD) and duration |
| **Institution Admissions** | `/institutions/:id/admissions` | `GET /api/institutions/:id/admissions` | `admissions`, `programs` | Intake deadlines, eligibility criteria, application steps |
| **Institution Tuition** | `/institutions/:id/tuition` | `GET /api/institutions/:id/tuition` | `tuition_fees`, `programs` | Tuition costs per semester/year, currency, and mandatory fee table |
| **Institution Scholarships** | `/institutions/:id/scholarships` | `GET /api/institutions/:id/scholarships` | `institution_scholarships`, `scholarships` | Scholarships and financial aid packages available at this institution |
| **Institution Resources** | `/institutions/:id/resources` | `GET /api/institutions/:id/resources` | `resources`, `categories`, `tags` | University-specific course documents, slides, lecture recordings |
| **Institution Research** | `/institutions/:id/research` | `GET /api/institutions/:id/research` | `research`, `resources`, `research_authors`, `authors` | University research papers, theses, dissertations, DOI links |
| **Institution Reviews** | `/institutions/:id/reviews` | `GET /api/institutions/:id/reviews`<br>`POST /api/institutions/:id/reviews` | `reviews`, `users` | Student reviews, rating breakdown (1-5), submission form |
| **Programs Catalog** | `/programs` | `GET /api/programs` | `programs`, `institutions`, `departments` | Nationwide search across all degree offerings with study mode filters |
| **Admissions Hub** | `/admissions` | `GET /api/admissions` | `admissions`, `institutions`, `programs` | Unified admissions calendar and application gateway |
| **Scholarships Directory** | `/scholarships` | `GET /api/scholarships` | `scholarships`, `institutions` | Search scholarships by deadline, eligibility, and funding provider |
| **Global Resource Library** | `/resources` | `GET /api/resources`<br>`GET /api/categories` | `resources`, `categories`, `tags`, `institutions` | Filter by file type (PDF, DOCX, Video, Audio), category, and keyword |
| **Global Research Discovery** | `/research` | `GET /api/research` | `research`, `resources`, `authors`, `institutions` | Research publications, thesis search, author profile modals, DOI redirect |
| **Unified Search** | `/search` | `GET /api/search?q=` | `institutions`, `programs`, `resources`, `research` | Cross-entity instant search using pg_trgm and tsvector rankings |
| **AI Academic Advisor** | `/ai-consultation` | `POST /api/ai/consult`<br>`GET /api/ai/conversations` | `ai_conversations`, `ai_messages`, verified context from 35 tables | Interactive AI advisory chat grounded in real institutional database records |
| **User Profile** | `/profile` | `GET /api/users/me`<br>`GET /api/users/me/saved-*` | `users`, `saved_institutions`, `saved_programs`, `resource_bookmarks` | Manage profile, view saved bookmarks, manage comparisons |
| **Admin Console** | `/admin` | `GET /api/admin/verifications`<br>`GET /api/admin/reports` | `institution_verification`, `resource_reports`, `audit_logs` | Approve accreditation, moderate resource reports, review audit logs |
