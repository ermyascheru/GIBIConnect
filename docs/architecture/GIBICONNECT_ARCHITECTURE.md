# GIBIConnect Master System Architecture Specification

## 1. System Overview

**GIBIConnect** is a comprehensive higher education platform for Ethiopian universities, colleges, academic programs, admissions, scholarships, digital resource libraries, scientific research publications, and AI-grounded academic advising.

The platform enforces a strict, layered architecture where **PostgreSQL is the single source of truth**:

```text
+-----------------------------------------------------------------------------------+
|                           REACT + VITE FRONTEND                                   |
|   Home | Institutions (List & Details) | Programs | Resources | Research | AI     |
+------------------------------------------+----------------------------------------+
                                           | HTTP / REST (JWT Auth)
                                           v
+-----------------------------------------------------------------------------------+
|                        NODE.JS + EXPRESS BACKEND                                  |
|   Routes  -->  Controllers  -->  Services  -->  Repositories (pg Pool)           |
+------------------------------------------+----------------------------------------+
                                           | Parameterized SQL / GIN Indexes
                                           v
+-----------------------------------------------------------------------------------+
|                     POSTGRESQL DATABASE (35 TABLES)                               |
|   Core Academic Directory | Resource Library | Research Hub | AI Logs             |
+-----------------------------------------------------------------------------------+
                                           ^
                                           | Grounded Context Query
+------------------------------------------+----------------------------------------+
|                     AI ACADEMIC CONSULTATION AGENT                                |
|   (Database is Ground Truth -- AI Never Replaces or Directly Mutates SQL)        |
+-----------------------------------------------------------------------------------+
```

---

## 2. PostgreSQL Database Architecture (35 Tables)

The database schema is organized into 35 strictly ordered tables:

1. **Identity & Governance**: `users`, `institution_verification`, `audit_logs`
2. **Institutional & Academic Directory**: `institutions`, `faculties`, `departments`, `programs`, `facilities`, `academic_calendar`, `institution_news`
3. **Enrollment & Finance**: `admissions`, `tuition_fees`, `scholarships`, `institution_scholarships`
4. **Student Community & Personalization**: `reviews`, `saved_institutions`, `saved_programs`, `saved_scholarships`, `comparisons`
5. **Careers**: `careers`, `program_careers`
6. **Resource Library**: `resources`, `categories`, `resource_categories`, `tags`, `resource_tags`, `resource_bookmarks`, `resource_views`, `resource_downloads`, `resource_reports`
7. **Research Subsystem**: `research`, `authors`, `research_authors`
8. **AI Context Telemetry**: `ai_conversations`, `ai_messages`

### Search & Indexing Engine:
- **Full-Text Search (`tsvector` + GIN)**: Stored generated columns on `institutions`, `programs`, `resources`, and `research` indexed with GIN for sub-millisecond full-text queries via `websearch_to_tsquery`.
- **Trigram Fuzzy Search (`pg_trgm` + GIN)**: Typo-tolerant search on institutional titles, original filenames, author names, and journal venues.

---

## 3. Node.js + Express Backend Architecture

The backend follows clean layered architecture:
- **Routes**: Define declarative endpoints and apply authentication/authorization middleware.
- **Controllers**: Handle HTTP request validation and serialization.
- **Services**: Execute domain business logic, transactional integrity, and data aggregation.
- **Repositories**: Execute raw parameterized SQL queries via the `pg.Pool` connection pool.

### Connection Management:
- Uses `pg` connection pool configured through environment variables (`DATABASE_URL`, `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`).
- Connection pooling guarantees high throughput and prevents connection starvation.

---

## 4. React + Vite Frontend Architecture

- **Engine**: React 18 / 19 with Vite for instant HMR and optimized production bundles.
- **Routing**: React Router with clear layout nesting.
- **Institution Structure**:
  - `/institutions`: Paginated list and faceted filters.
  - `/institutions/:id`: Master header with nested tabs: Overview, Departments, Programs, Admissions, Tuition, Scholarships, Resources, Research, Reviews.
- **Global Catalogs**:
  - `/resources`: Search all public documents, slides, audio/video lectures across Ethiopia.
  - `/research`: Search theses, dissertations, and peer-reviewed journal papers.
  - `/ai-consultation`: Interactive chat interface grounded in live database queries.

---

## 5. Grounded AI Architecture (Zero Hallucination)

1. **User Query**: User submits question (e.g. *"What are the tuition fees and admission deadlines for Computer Science at AAU?"*).
2. **Context Retrieval**: The backend parses the query, identifies entities, and queries the authoritative PostgreSQL database (`institutions`, `programs`, `admissions`, `tuition_fees`).
3. **Prompt Compilation**: The verified database rows are formatted as structured markdown context.
4. **AI Generation**: The LLM synthesizes an advisory response strictly using the provided verified database context.
5. **Response with Citations**: The frontend renders the response with direct links to the relevant database entity cards.
6. **Safety Rules**:
   - The AI never executes raw SQL directly.
   - The AI never invents institutional facts.
   - API keys are secured exclusively in backend environment variables.

---

## 6. Security & Verification Strategy

- **Parameterized Queries**: 100% of database queries use positional parameters (`$1, $2`) to eliminate SQL injection.
- **Role-Based Access Control**:
  - `user`: View public data, submit reviews, bookmark entities, upload personal draft resources.
  - `moderator`: Review community reports and triage resource submissions.
  - `admin`: Verify institutions, inspect audit logs, manage system configuration.
- **File Validation**: Strict CHECK constraints ensure only allowed file extensions (`pdf`, `docx`, `xlsx`, `pptx`, `epub`, `mp4`, `webm`, `mp3`, `wav`, `m4a`) and positive byte sizes are persisted.
