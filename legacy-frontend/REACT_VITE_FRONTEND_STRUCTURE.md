# GIBIConnect React + Vite Frontend Page Hierarchy & Structure

## 1. Page Hierarchy Architecture

```text
React + Vite Application
│
├── / (Home) [Supported by database: featured institutions, stats, news, search bar]
│
├── /institutions (Institutions Directory) [Supported by database]
│   │
│   ├── /institutions (Institution List) [Faceted filters: region, type, ownership]
│   │
│   └── /institutions/:institutionIdOrSlug (Institution Details Header & Navigation)
│       │
│       ├── Overview (/institutions/:id) [Description, accreditation, facilities, contact]
│       ├── Departments (/institutions/:id/departments) [Faculties & departments]
│       ├── Programs (/institutions/:id/programs) [Degree programs & study modes]
│       ├── Admissions (/institutions/:id/admissions) [Intake dates, requirements, links]
│       ├── Tuition (/institutions/:id/tuition) [Fee schedule & period amounts]
│       ├── Scholarships (/institutions/:id/scholarships) [Institutional scholarships]
│       ├── Resources (/institutions/:id/resources) [Institution-specific resources]
│       ├── Research (/institutions/:id/research) [Institution-specific research papers]
│       └── Reviews (/institutions/:id/reviews) [Ratings & student community reviews]
│
├── /programs (Academic Programs Catalog) [Supported by database: degree level, study mode filters]
├── /admissions (Admissions & Deadlines Hub) [Supported by database: upcoming deadlines, requirements]
├── /scholarships (Scholarships Directory) [Supported by database: funding types, deadlines]
│
├── /resources (Global Resource Library) [Supported by database: PDF, DOCX, Video, Audio, E-Books]
├── /research (Global Research & Publications) [Supported by database: theses, dissertations, papers]
│
├── /search (Unified Multi-Entity Search) [Supported by database: pg_trgm & tsvector search]
├── /ai-consultation (AI Academic Advisor) [Supported by database: grounded RAG consultation]
│
├── /profile (User Profile & Saved Entities) [Supported by database: bookmarks & comparisons]
└── /admin (Admin & Moderation Console) [Supported by database: verification, reports, audit logs]
```

---

## 2. Distinction: Global vs. Institution-Specific Resources & Research

### 2.1 Resources
- **Global Resources (`/resources`)**: Allows users to search and discover all public educational documents, lecture slides, datasets, e-books, and video tutorials across all universities in Ethiopia.
- **Institution-Specific Resources (`/institutions/:id/resources`)**: Embedded inside **Institution Details**, displaying learning materials, syllabus documents, and exam resources specifically uploaded under that institution.

### 2.2 Research
- **Global Research (`/research`)**: Comprehensive academic catalog to discover research papers, theses, dissertations, conference papers, and journal articles nationwide with DOI lookups and author attributions.
- **Institution-Specific Research (`/institutions/:id/research`)**: Embedded inside **Institution Details**, highlighting the research output, faculty publications, and academic theses produced by scholars at that specific university.

---

## 3. Database Support Matrix

| Route | Page | Database Support Status | Primary Tables |
|---|---|---|---|
| `/` | Home | **Supported by database** | `institutions`, `programs`, `resources`, `research`, `institution_news` |
| `/institutions` | Institution List | **Supported by database** | `institutions`, `institution_verification` |
| `/institutions/:id` | Institution Overview | **Supported by database** | `institutions`, `institution_verification`, `facilities` |
| `/institutions/:id/departments` | Institution Departments | **Supported by database** | `faculties`, `departments` |
| `/institutions/:id/programs` | Institution Programs | **Supported by database** | `programs`, `departments` |
| `/institutions/:id/admissions` | Institution Admissions | **Supported by database** | `admissions`, `programs` |
| `/institutions/:id/tuition` | Institution Tuition | **Supported by database** | `tuition_fees`, `programs` |
| `/institutions/:id/scholarships` | Institution Scholarships | **Supported by database** | `institution_scholarships`, `scholarships` |
| `/institutions/:id/resources` | Institution Resources | **Supported by database** | `resources`, `categories`, `tags` |
| `/institutions/:id/research` | Institution Research | **Supported by database** | `research`, `resources`, `research_authors`, `authors` |
| `/institutions/:id/reviews` | Institution Reviews | **Supported by database** | `reviews`, `users` |
| `/programs` | Programs Discovery | **Supported by database** | `programs`, `institutions`, `departments` |
| `/admissions` | Admissions Hub | **Supported by database** | `admissions`, `institutions`, `programs` |
| `/scholarships` | Scholarships Discovery | **Supported by database** | `scholarships`, `institutions` |
| `/resources` | Global Resource Library | **Supported by database** | `resources`, `categories`, `tags`, `institutions` |
| `/research` | Global Research Discovery | **Supported by database** | `research`, `resources`, `authors`, `institutions` |
| `/search` | Unified Search | **Supported by database** | `institutions`, `programs`, `resources`, `research` |
| `/ai-consultation` | AI Academic Advisor | **Supported by database** | `ai_conversations`, `ai_messages`, database-grounded context |
| `/profile` | User Profile & Bookmarks | **Supported by database** | `users`, `saved_institutions`, `saved_programs`, `resource_bookmarks` |
| `/admin` | Admin & Moderation | **Supported by database** | `institution_verification`, `resource_reports`, `audit_logs` |
