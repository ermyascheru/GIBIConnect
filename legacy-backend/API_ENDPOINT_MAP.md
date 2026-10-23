# GIBIConnect Backend API Endpoint Map

This document outlines the REST API architecture connecting the Node.js + Express backend to the PostgreSQL database.

## 1. Authentication & Users
- **`POST /api/auth/register`**
  - **Purpose**: Register new user account.
  - **Auth**: Public.
  - **Tables**: `users`.
  - **Request Body**: `{ email, password, full_name }`.
  - **Response**: `201 Created { user: { id, email, full_name, role }, token }`.
- **`POST /api/auth/login`**
  - **Purpose**: Authenticate user and issue JWT.
  - **Auth**: Public.
  - **Tables**: `users`.
  - **Request Body**: `{ email, password }`.
  - **Response**: `200 OK { user: { id, email, full_name, role }, token }`.
- **`GET /api/users/me`**
  - **Purpose**: Retrieve authenticated user profile with saved entity counts.
  - **Auth**: Authenticated (`user`, `moderator`, `admin`).
  - **Tables**: `users`, `saved_institutions`, `saved_programs`, `saved_scholarships`, `resource_bookmarks`.
- **`GET /api/users/me/saved-institutions`** / **`POST /api/users/me/saved-institutions`**
  - **Tables**: `saved_institutions`, `institutions`.

## 2. Institutions
- **`GET /api/institutions`**
  - **Purpose**: Paginated list of institutions with multi-criteria filters (region, ownership, type, search).
  - **Auth**: Public.
  - **Tables**: `institutions`, `institution_verification`, `reviews`.
  - **Query Params**: `page, limit, region, type, ownership, search`.
- **`GET /api/institutions/:idOrSlug`**
  - **Purpose**: Full institutional profile with verification status, rating aggregates, and summary stats.
  - **Auth**: Public.
  - **Tables**: `institutions`, `institution_verification`, `reviews`.
- **`GET /api/institutions/:id/departments`**
  - **Tables**: `faculties`, `departments`.
- **`GET /api/institutions/:id/programs`**
  - **Tables**: `programs`, `departments`, `institutions`.
- **`GET /api/institutions/:id/admissions`**
  - **Tables**: `admissions`, `programs`.
- **`GET /api/institutions/:id/tuition`**
  - **Tables**: `tuition_fees`, `programs`.
- **`GET /api/institutions/:id/scholarships`**
  - **Tables**: `institution_scholarships`, `scholarships`.
- **`GET /api/institutions/:id/facilities`**
  - **Tables**: `facilities`.
- **`GET /api/institutions/:id/reviews`** / **`POST /api/institutions/:id/reviews`**
  - **Tables**: `reviews`, `users`.
- **`GET /api/institutions/:id/news`**
  - **Tables**: `institution_news`.
- **`GET /api/institutions/:id/calendar`**
  - **Tables**: `academic_calendar`.
- **`GET /api/institutions/:id/resources`**
  - **Purpose**: Institution-specific educational resources.
  - **Auth**: Public / Authenticated based on visibility.
  - **Tables**: `resources`, `categories`, `tags`.
- **`GET /api/institutions/:id/research`**
  - **Purpose**: Institution-specific scientific research publications.
  - **Auth**: Public.
  - **Tables**: `research`, `resources`, `research_authors`, `authors`.

## 3. Programs & Admissions
- **`GET /api/programs`**
  - **Tables**: `programs`, `institutions`, `departments`.
- **`GET /api/programs/:id`**
  - **Tables**: `programs`, `institutions`, `departments`, `program_careers`, `careers`, `tuition_fees`, `admissions`.
- **`GET /api/admissions`**
  - **Tables**: `admissions`, `institutions`, `programs`.

## 4. Scholarships & Careers
- **`GET /api/scholarships`**
  - **Tables**: `scholarships`, `institution_scholarships`, `institutions`.
- **`GET /api/careers`**
  - **Tables**: `careers`, `program_careers`.

## 5. Resource Library (Global & Uploads)
- **`GET /api/resources`**
  - **Purpose**: Global resource catalog with full-text search, type, and category filtering.
  - **Auth**: Public.
  - **Tables**: `resources`, `institutions`, `categories`, `resource_categories`, `tags`, `resource_tags`.
- **`GET /api/resources/:id`**
  - **Tables**: `resources`, `institutions`, `faculties`, `departments`, `programs`, `categories`, `tags`.
- **`POST /api/resources/:id/view`**
  - **Tables**: `resource_views`.
- **`GET /api/resources/:id/download`**
  - **Tables**: `resources`, `resource_downloads`.
- **`POST /api/resources/:id/report`**
  - **Tables**: `resource_reports`.

## 6. Research Subsystem (Global Discovery)
- **`GET /api/research`**
  - **Purpose**: Global research repository discovery with full-text query, year, type, and author filters.
  - **Auth**: Public.
  - **Tables**: `research`, `resources`, `institutions`, `research_authors`, `authors`.
- **`GET /api/research/:id`**
  - **Tables**: `research`, `resources`, `research_authors`, `authors`, `institutions`.

## 7. AI Consultation & Advisory
- **`POST /api/ai/consult`**
  - **Purpose**: Grounded AI advisory endpoint. Performs database retrieval first, compiles grounded context, and executes LLM inference.
  - **Auth**: Public / Authenticated.
  - **Tables**: `ai_conversations`, `ai_messages`, `institutions`, `programs`, `admissions`, `tuition_fees`, `scholarships`, `resources`, `research`.
  - **Request Body**: `{ prompt, conversation_id (optional), institution_id (optional) }`.
  - **Response**: `200 OK { response, conversation_id, citations: [...] }`.

## 8. Admin & Moderation
- **`GET /api/admin/verifications`** / **`POST /api/admin/verifications/:id`**
  - **Auth**: Admin only.
  - **Tables**: `institution_verification`, `institutions`, `audit_logs`.
- **`GET /api/admin/reports`** / **`PATCH /api/admin/reports/:id`**
  - **Auth**: Moderator / Admin.
  - **Tables**: `resource_reports`, `resources`, `audit_logs`.
- **`GET /api/admin/audit-logs`**
  - **Auth**: Admin only.
  - **Tables**: `audit_logs`, `users`.
