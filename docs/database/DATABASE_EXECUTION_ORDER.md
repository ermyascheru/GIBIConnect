# GIBIConnect Database Execution Order & Dependency Analysis

This document outlines the strict topological creation order for all **35 tables** in the GIBIConnect PostgreSQL database.

### Prerequisites
- `00_prerequisites.sql`: Extensions (`pgcrypto`, `pg_trgm`), custom ENUM types, and helper/trigger functions.

| Order | File | Table | Depends On | Category |
|---|---|---|---|---|
| 01 | `01_users.sql` | **users** | *(None - Root Entity)* | Identity & Access |
| 02 | `02_institutions.sql` | **institutions** | *(None - Root Entity)* | Core Institutional |
| 03 | `03_scholarships.sql` | **scholarships** | *(None - Root Entity)* | Financial Aid |
| 04 | `04_careers.sql` | **careers** | *(None - Root Entity)* | Career Discovery |
| 05 | `05_categories.sql` | **categories** | *(None - Root Entity)* | Resource Taxonomy |
| 06 | `06_tags.sql` | **tags** | *(None - Root Entity)* | Resource Taxonomy |
| 07 | `07_institution_verification.sql` | **institution_verification** | `institutions`, `users` | Governance |
| 08 | `08_faculties.sql` | **faculties** | `institutions` | Academic Structure |
| 09 | `09_institution_scholarships.sql` | **institution_scholarships** | `institutions`, `scholarships` | Financial Aid |
| 10 | `10_facilities.sql` | **facilities** | `institutions` | Campus Infrastructure |
| 11 | `11_reviews.sql` | **reviews** | `institutions`, `users` | Student Community |
| 12 | `12_institution_news.sql` | **institution_news** | `institutions` | Communications |
| 13 | `13_academic_calendar.sql` | **academic_calendar** | `institutions` | Academic Operations |
| 14 | `14_saved_institutions.sql` | **saved_institutions** | `users`, `institutions` | User Personalization |
| 15 | `15_saved_scholarships.sql` | **saved_scholarships** | `users`, `scholarships` | User Personalization |
| 16 | `16_comparisons.sql` | **comparisons** | `users` | Decision Support |
| 17 | `17_ai_conversations.sql` | **ai_conversations** | `users`, `institutions` | AI Consultation |
| 18 | `18_audit_logs.sql` | **audit_logs** | `users` | Compliance & Audit |
| 19 | `19_authors.sql` | **authors** | `users` | Research Subsystem |
| 20 | `20_departments.sql` | **departments** | `faculties` | Academic Structure |
| 21 | `21_ai_messages.sql` | **ai_messages** | `ai_conversations` | AI Consultation |
| 22 | `22_programs.sql` | **programs** | `institutions`, `departments` | Academic Programs |
| 23 | `23_admissions.sql` | **admissions** | `institutions`, `programs` | Enrollment & Admissions |
| 24 | `24_tuition_fees.sql` | **tuition_fees** | `institutions`, `programs` | Financial Planning |
| 25 | `25_program_careers.sql` | **program_careers** | `programs`, `careers` | Career Pathways |
| 26 | `26_saved_programs.sql` | **saved_programs** | `users`, `programs` | User Personalization |
| 27 | `27_resources.sql` | **resources** | `users`, `institutions`, `faculties`, `departments`, `programs` | Resource Library |
| 28 | `28_research.sql` | **research** | `resources` | Research Subsystem |
| 29 | `29_resource_categories.sql` | **resource_categories** | `resources`, `categories` | Resource Library |
| 30 | `30_resource_tags.sql` | **resource_tags** | `resources`, `tags` | Resource Library |
| 31 | `31_resource_bookmarks.sql` | **resource_bookmarks** | `users`, `resources` | User Personalization |
| 32 | `32_resource_views.sql` | **resource_views** | `resources`, `users` | Analytics & Tracking |
| 33 | `33_resource_downloads.sql` | **resource_downloads** | `resources`, `users` | Analytics & Tracking |
| 34 | `34_resource_reports.sql` | **resource_reports** | `resources`, `users` | Content Moderation |
| 35 | `35_research_authors.sql` | **research_authors** | `research`, `authors` | Research Subsystem |

### Post-Table Execution
- `36_indexes.sql`: Performance, GIN full-text, GIN trigram, and composite filter indexes.
- `37_triggers.sql`: Timestamp automation triggers (`set_updated_at()`).
- `seed.sql`: Idempotent development and demo seed data.
- `verify.sql`: Comprehensive automated test suite.
