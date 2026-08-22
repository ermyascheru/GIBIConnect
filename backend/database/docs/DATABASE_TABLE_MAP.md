# GIBIConnect Database Table Map (All 35 Tables)

This document provides a comprehensive mapping and documentation for every single one of the **35 database tables** in the GIBIConnect PostgreSQL database.

## 1. `users`

- **Purpose**: Core authentication, identity, and role-based access control for system actors.
- **Primary Key**: `id`
- **Foreign Keys**: None
- **Parent Tables**: None
- **Child Tables**: institution_verification, reviews, saved_institutions, saved_programs, saved_scholarships, comparisons, ai_conversations, audit_logs, authors, resources, resource_bookmarks, resource_views, resource_downloads, resource_reports
- **Important Constraints**: CHECK (role <> 'guest'), email UNIQUE, NOT NULL on email, password_hash, full_name, role, status
- **Information Stored**: User identity, encrypted credentials, access roles, and account lifecycle status.
- **Columns**: id (UUID, PK), email (VARCHAR 255, UNIQUE), password_hash (VARCHAR 255), full_name (VARCHAR 150), role (user_role ENUM: user, moderator, admin), status (user_status ENUM: active, suspended, deleted), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ)
- **Backend Usage**: Auth middleware, UserRepository, AuthService, AuthController (/api/auth/register, /api/auth/login, /api/auth/me)
- **Frontend Usage**: Authentication context, login/register modals, user profile dashboard, admin user management
- **AI Relevance**: Provides user context and role verification for authenticated AI advisory sessions

---

## 2. `institutions`

- **Purpose**: Authoritative directory of Ethiopian higher education institutions (universities & colleges).
- **Primary Key**: `id`
- **Foreign Keys**: None
- **Parent Tables**: None
- **Child Tables**: institution_verification, faculties, programs, admissions, tuition_fees, institution_scholarships, facilities, reviews, institution_news, academic_calendar, saved_institutions, ai_conversations, resources
- **Important Constraints**: CHECK (latitude BETWEEN -90 AND 90), CHECK (longitude BETWEEN -180 AND 180), slug UNIQUE, NOT NULL on name, slug, type, ownership, city, region, status
- **Information Stored**: Campus directory profiles, geographical coordinates, ownership type, contact details, accreditation status, full-text search index.
- **Columns**: id (UUID, PK), name (VARCHAR 255), slug (VARCHAR 255, UNIQUE), description (TEXT), history (TEXT), type (institution_type ENUM), ownership (institution_ownership ENUM), logo_url (TEXT), cover_image_url (TEXT), website_url (TEXT), email (VARCHAR 255), phone (VARCHAR 50), address (VARCHAR 255), city (VARCHAR 120), region (VARCHAR 120), latitude (NUMERIC 9,6), longitude (NUMERIC 9,6), accreditation (VARCHAR 255), status (institution_status ENUM), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ), search_vector (tsvector, GENERATED STORED)
- **Backend Usage**: InstitutionRepository, InstitutionService, InstitutionController (/api/institutions, /api/institutions/:id, /api/institutions/:slug)
- **Frontend Usage**: Institutions list page, faceted filters (region, ownership, type), map view, Institution Details layout (Overview, Location)
- **AI Relevance**: Primary grounding context for institution recommendation, comparisons, and general queries

---

## 3. `scholarships`

- **Purpose**: Catalog of academic scholarships, grants, and financial aid opportunities.
- **Primary Key**: `id`
- **Foreign Keys**: None
- **Parent Tables**: None
- **Child Tables**: institution_scholarships, saved_scholarships
- **Important Constraints**: slug UNIQUE, NOT NULL on name, slug, status
- **Information Stored**: Financial support programs, eligibility requirements, application deadlines, external application URLs.
- **Columns**: id (UUID, PK), name (VARCHAR 255), slug (VARCHAR 255, UNIQUE), description (TEXT), eligibility (TEXT), deadline (DATE), funding (VARCHAR 255), application_url (TEXT), status (content_status ENUM), created_at (TIMESTAMPTZ)
- **Backend Usage**: ScholarshipRepository, ScholarshipService, ScholarshipController (/api/scholarships, /api/scholarships/:id)
- **Frontend Usage**: Scholarships discovery page, search/filter by funding and deadline, bookmark scholarship button
- **AI Relevance**: Enables AI advisor to answer financial aid and scholarship eligibility questions

---

## 4. `careers`

- **Purpose**: Occupational dictionary and career pathways aligned with higher education programs.
- **Primary Key**: `id`
- **Foreign Keys**: None
- **Parent Tables**: None
- **Child Tables**: program_careers
- **Important Constraints**: slug UNIQUE, NOT NULL on name, slug
- **Information Stored**: Professional titles, job descriptions, and industry sector classifications.
- **Columns**: id (UUID, PK), name (VARCHAR 255), slug (VARCHAR 255, UNIQUE), description (TEXT)
- **Backend Usage**: CareerRepository, CareerService, CareerController (/api/careers)
- **Frontend Usage**: Career exploration widget, program details linked career tags
- **AI Relevance**: Assists AI advisor in career counseling and major/degree recommendations

---

## 5. `categories`

- **Purpose**: Structured taxonomic subject hierarchy for resources and educational materials.
- **Primary Key**: `id`
- **Foreign Keys**: None
- **Parent Tables**: None
- **Child Tables**: resource_categories
- **Important Constraints**: slug UNIQUE, NOT NULL on name, slug
- **Information Stored**: Academic categories (e.g. Computer Science, Engineering, Medicine, Agriculture).
- **Columns**: id (UUID, PK), name (VARCHAR 100), slug (VARCHAR 100, UNIQUE), description (TEXT), created_at (TIMESTAMPTZ)
- **Backend Usage**: CategoryRepository, CategoryService, CategoryController (/api/categories)
- **Frontend Usage**: Resource library category filters, sidebar navigation, browse by field of study
- **AI Relevance**: Subject classification grounding for resource filtering

---

## 6. `tags`

- **Purpose**: Folksonomy keyword tagging system for resources, research, and curricula.
- **Primary Key**: `id`
- **Foreign Keys**: None
- **Parent Tables**: None
- **Child Tables**: resource_tags
- **Important Constraints**: slug UNIQUE, NOT NULL on name, slug
- **Information Stored**: Descriptive keywords (e.g. machine-learning, artificial-intelligence, thesis, exam-prep).
- **Columns**: id (UUID, PK), name (VARCHAR 100), slug (VARCHAR 100, UNIQUE), created_at (TIMESTAMPTZ)
- **Backend Usage**: TagRepository, TagService, TagController (/api/tags)
- **Frontend Usage**: Tag pills, popular tags cloud, tag-based resource discovery
- **AI Relevance**: Keyword-based relevance scoring and topical discovery

---

## 7. `institution_verification`

- **Purpose**: Governance and official accreditation verification records for institutions.
- **Primary Key**: `id`
- **Foreign Keys**: institution_id -> institutions(id), verified_by -> users(id)
- **Parent Tables**: institutions, users
- **Child Tables**: None
- **Important Constraints**: institution_id UNIQUE, NOT NULL on institution_id, status
- **Information Stored**: Accreditation audits, verifying agency references, reviewer audit trail, renewal schedule.
- **Columns**: id (UUID, PK), institution_id (UUID, UNIQUE, FK), status (verification_status ENUM), source (VARCHAR 255), verified_by (UUID, FK), verified_at (TIMESTAMPTZ), next_review_at (TIMESTAMPTZ), notes (TEXT)
- **Backend Usage**: VerificationRepository, VerificationService, AdminController (/api/admin/verifications)
- **Frontend Usage**: Verified Institution badge on Institution Header, Admin verification queue
- **AI Relevance**: Ensures AI highlights institutional credibility and accredited status in answers

---

## 8. `faculties`

- **Purpose**: Academic divisions (colleges/faculties/schools) within an institution.
- **Primary Key**: `id`
- **Foreign Keys**: institution_id -> institutions(id)
- **Parent Tables**: institutions
- **Child Tables**: departments, resources
- **Important Constraints**: UNIQUE (institution_id, name), NOT NULL on institution_id, name
- **Information Stored**: Faculty names (e.g. Faculty of Informatics, College of Health Sciences) and descriptions.
- **Columns**: id (UUID, PK), institution_id (UUID, FK), name (VARCHAR 255), description (TEXT)
- **Backend Usage**: FacultyRepository, FacultyService, InstitutionController (/api/institutions/:id/faculties)
- **Frontend Usage**: Institution Details -> Departments/Faculties tab accordion
- **AI Relevance**: Hierarchical academic navigation for faculty-specific queries

---

## 9. `institution_scholarships`

- **Purpose**: Many-to-many junction associating specific institutions with supported scholarships.
- **Primary Key**: `(institution_id, scholarship_id)`
- **Foreign Keys**: institution_id -> institutions(id), scholarship_id -> scholarships(id)
- **Parent Tables**: institutions, scholarships
- **Child Tables**: None
- **Important Constraints**: Composite Primary Key
- **Information Stored**: Relationship mapping connecting campus profiles with institutional and partner aid.
- **Columns**: institution_id (UUID, PK, FK), scholarship_id (UUID, PK, FK)
- **Backend Usage**: ScholarshipRepository, InstitutionService (/api/institutions/:id/scholarships)
- **Frontend Usage**: Institution Details -> Scholarships tab
- **AI Relevance**: Answers "What scholarships are available at Addis Ababa University?"

---

## 10. `facilities`

- **Purpose**: Inventory of campus infrastructure, labs, libraries, and amenities.
- **Primary Key**: `id`
- **Foreign Keys**: institution_id -> institutions(id)
- **Parent Tables**: institutions
- **Child Tables**: None
- **Important Constraints**: NOT NULL on institution_id, name, type
- **Information Stored**: Campus facilities (libraries, computer labs, research centers, student housing, medical centers).
- **Columns**: id (UUID, PK), institution_id (UUID, FK), name (VARCHAR 255), type (facility_type ENUM), description (TEXT)
- **Backend Usage**: FacilityRepository, FacilityService, InstitutionController (/api/institutions/:id/facilities)
- **Frontend Usage**: Institution Details -> Overview -> Campus Facilities grid
- **AI Relevance**: Provides factual details on labs, libraries, and student amenities

---

## 11. `reviews`

- **Purpose**: Student and alumni community reviews and multidimensional campus ratings.
- **Primary Key**: `id`
- **Foreign Keys**: institution_id -> institutions(id), user_id -> users(id)
- **Parent Tables**: institutions, users
- **Child Tables**: None
- **Important Constraints**: UNIQUE (institution_id, user_id), CHECK ratings 1..5, NOT NULL on ratings, status
- **Information Stored**: Multidimensional ratings (1-5) on teaching, facilities, campus life, administration, and student comments.
- **Columns**: id (UUID, PK), institution_id (UUID, FK), user_id (UUID, FK), teaching_rating (SMALLINT), facility_rating (SMALLINT), campus_rating (SMALLINT), administration_rating (SMALLINT), comment (TEXT), status (review_status ENUM), created_at (TIMESTAMPTZ)
- **Backend Usage**: ReviewRepository, ReviewService, ReviewController (/api/institutions/:id/reviews)
- **Frontend Usage**: Institution Details -> Reviews section, star rating breakdown, submit review form
- **AI Relevance**: Provides sentiment and student satisfaction metrics for qualitative inquiries

---

## 12. `institution_news`

- **Purpose**: Official institutional announcements, press releases, and campus news updates.
- **Primary Key**: `id`
- **Foreign Keys**: institution_id -> institutions(id)
- **Parent Tables**: institutions
- **Child Tables**: None
- **Important Constraints**: NOT NULL on institution_id, title, content, status
- **Information Stored**: Campus updates, event announcements, press releases, publication dates, and cover images.
- **Columns**: id (UUID, PK), institution_id (UUID, FK), title (VARCHAR 255), content (TEXT), image_url (TEXT), published_at (TIMESTAMPTZ), source_url (TEXT), status (news_status ENUM)
- **Backend Usage**: NewsRepository, NewsService, InstitutionController (/api/institutions/:id/news)
- **Frontend Usage**: Institution Details -> News feed, home page latest updates cards
- **AI Relevance**: Enables AI to reference recent university news and announcements

---

## 13. `academic_calendar`

- **Purpose**: Institutional schedule of academic deadlines, terms, and milestone events.
- **Primary Key**: `id`
- **Foreign Keys**: institution_id -> institutions(id)
- **Parent Tables**: institutions
- **Child Tables**: None
- **Important Constraints**: CHECK (end_date IS NULL OR end_date >= start_date), NOT NULL on institution_id, title, event_type, start_date
- **Information Stored**: Academic key dates: registration windows, semester start/end, exam periods, and holidays.
- **Columns**: id (UUID, PK), institution_id (UUID, FK), title (VARCHAR 255), event_type (calendar_event_type ENUM), start_date (DATE), end_date (DATE), description (TEXT)
- **Backend Usage**: CalendarRepository, CalendarService, InstitutionController (/api/institutions/:id/calendar)
- **Frontend Usage**: Institution Details -> Academic Calendar timeline view
- **AI Relevance**: Answers "When does registration begin at Bahir Dar University?"

---

## 14. `saved_institutions`

- **Purpose**: Personalized user bookmarks for institutions.
- **Primary Key**: `(user_id, institution_id)`
- **Foreign Keys**: user_id -> users(id) ON DELETE CASCADE, institution_id -> institutions(id)
- **Parent Tables**: users, institutions
- **Child Tables**: None
- **Important Constraints**: Composite Primary Key
- **Information Stored**: User bookmarks for quick access to favored university profiles.
- **Columns**: user_id (UUID, PK, FK), institution_id (UUID, PK, FK), created_at (TIMESTAMPTZ)
- **Backend Usage**: SavedRepository, SavedService, UserController (/api/users/me/saved-institutions)
- **Frontend Usage**: Bookmark button on Institution cards, User Profile -> Saved Institutions
- **AI Relevance**: Personalizes recommendations based on user interests

---

## 15. `saved_scholarships`

- **Purpose**: Personalized user bookmarks for scholarship opportunities.
- **Primary Key**: `(user_id, scholarship_id)`
- **Foreign Keys**: user_id -> users(id) ON DELETE CASCADE, scholarship_id -> scholarships(id)
- **Parent Tables**: users, scholarships
- **Child Tables**: None
- **Important Constraints**: Composite Primary Key
- **Information Stored**: User watchlist for scholarship deadlines and funding opportunities.
- **Columns**: user_id (UUID, PK, FK), scholarship_id (UUID, PK, FK), created_at (TIMESTAMPTZ)
- **Backend Usage**: SavedRepository, SavedService, UserController (/api/users/me/saved-scholarships)
- **Frontend Usage**: Bookmark button on Scholarship cards, User Profile -> Saved Scholarships
- **AI Relevance**: Alerts user to approaching deadlines in AI consultation

---

## 16. `comparisons`

- **Purpose**: User-curated side-by-side comparison sets of 2 to 4 institutions.
- **Primary Key**: `id`
- **Foreign Keys**: user_id -> users(id) ON DELETE CASCADE
- **Parent Tables**: users
- **Child Tables**: None
- **Important Constraints**: CHECK (cardinality(institution_ids) BETWEEN 2 AND 4), CHECK unique array elements
- **Information Stored**: Saved comparison sessions comparing tuition, programs, facilities, and ratings.
- **Columns**: id (UUID, PK), user_id (UUID, FK), institution_ids (UUID[]), created_at (TIMESTAMPTZ)
- **Backend Usage**: ComparisonRepository, ComparisonService, ComparisonController (/api/comparisons)
- **Frontend Usage**: Comparison tool modal/page, side-by-side table matrix
- **AI Relevance**: Directly powers AI side-by-side comparative analysis of selected universities

---

## 17. `ai_conversations`

- **Purpose**: Persistent chat sessions for the GIBIConnect AI Academic Advisor.
- **Primary Key**: `id`
- **Foreign Keys**: user_id -> users(id) ON DELETE SET NULL, institution_context_id -> institutions(id) ON DELETE SET NULL
- **Parent Tables**: users, institutions
- **Child Tables**: ai_messages
- **Important Constraints**: None
- **Information Stored**: Chat thread headers, session title, user association, and optional institution focus context.
- **Columns**: id (UUID, PK), user_id (UUID, FK), institution_context_id (UUID, FK), title (VARCHAR 255), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ)
- **Backend Usage**: AIConversationRepository, AIService, AIController (/api/ai/conversations)
- **Frontend Usage**: AI Consultation chat interface, conversation history sidebar
- **AI Relevance**: Context container for stateful, multi-turn AI consultation

---

## 18. `audit_logs`

- **Purpose**: Compliance and security audit trail for administrative mutations.
- **Primary Key**: `id`
- **Foreign Keys**: user_id -> users(id)
- **Parent Tables**: users
- **Child Tables**: None
- **Important Constraints**: NOT NULL on user_id, action, entity_type, entity_id
- **Information Stored**: Administrative actions, entity edits, before/after JSON diffs, actor audit trail.
- **Columns**: id (UUID, PK), user_id (UUID, FK), action (VARCHAR 100), entity_type (VARCHAR 100), entity_id (UUID), changes (JSONB), created_at (TIMESTAMPTZ)
- **Backend Usage**: AuditRepository, AuditService, AdminController (/api/admin/audit-logs)
- **Frontend Usage**: Admin Dashboard -> System Audit Log view
- **AI Relevance**: None (administrative compliance)

---

## 19. `authors`

- **Purpose**: Academic and scientific author profiles for research attribution.
- **Primary Key**: `id`
- **Foreign Keys**: user_id -> users(id) ON DELETE SET NULL
- **Parent Tables**: users
- **Child Tables**: research_authors
- **Important Constraints**: NOT NULL on full_name
- **Information Stored**: Author names, university affiliations, ORCID researcher identifiers, email contact.
- **Columns**: id (UUID, PK), user_id (UUID, FK), full_name (VARCHAR 150), email (VARCHAR 255), affiliation (VARCHAR 255), orcid (VARCHAR 30), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ)
- **Backend Usage**: AuthorRepository, AuthorService, ResearchController (/api/research/authors)
- **Frontend Usage**: Research paper author details, author profile links, ORCID badges
- **AI Relevance**: Author attribution, publication history, and expert matching queries

---

## 20. `departments`

- **Purpose**: Academic departments operating within specific faculties.
- **Primary Key**: `id`
- **Foreign Keys**: faculty_id -> faculties(id)
- **Parent Tables**: faculties
- **Child Tables**: programs, resources
- **Important Constraints**: UNIQUE (faculty_id, name), NOT NULL on faculty_id, name
- **Information Stored**: Department titles (e.g. Department of Computer Science, Civil Engineering) and descriptions.
- **Columns**: id (UUID, PK), faculty_id (UUID, FK), name (VARCHAR 255), description (TEXT)
- **Backend Usage**: DepartmentRepository, DepartmentService, InstitutionController (/api/institutions/:id/departments)
- **Frontend Usage**: Institution Details -> Departments list, department program filter
- **AI Relevance**: Grounding for queries about specific academic departments and faculties

---

## 21. `ai_messages`

- **Purpose**: Individual message turns and retrieved grounding context in AI conversations.
- **Primary Key**: `id`
- **Foreign Keys**: conversation_id -> ai_conversations(id) ON DELETE CASCADE
- **Parent Tables**: ai_conversations
- **Child Tables**: None
- **Important Constraints**: NOT NULL on conversation_id, role, content
- **Information Stored**: User prompts, AI responses, timestamps, and JSONB audit of verified database context retrieved.
- **Columns**: id (UUID, PK), conversation_id (UUID, FK), role (ai_message_role ENUM: user, assistant), content (TEXT), retrieved_context (JSONB), created_at (TIMESTAMPTZ)
- **Backend Usage**: AIMessageRepository, AIService, AIController (/api/ai/conversations/:id/messages)
- **Frontend Usage**: AI Chat window bubbles, message streaming, source reference citations
- **AI Relevance**: Core dialog history and transparent context attribution for hallucination prevention

---

## 22. `programs`

- **Purpose**: Degree programs, majors, and curricula offered by institutions.
- **Primary Key**: `id`
- **Foreign Keys**: institution_id -> institutions(id), department_id -> departments(id)
- **Parent Tables**: institutions, departments
- **Child Tables**: admissions, tuition_fees, program_careers, saved_programs, resources
- **Important Constraints**: slug UNIQUE, NOT NULL on institution_id, department_id, name, slug, degree_level, study_mode, status
- **Information Stored**: Program title, degree level (bachelor, master, phd), study mode (full-time, online), duration, requirements.
- **Columns**: id (UUID, PK), institution_id (UUID, FK), department_id (UUID, FK), name (VARCHAR 255), slug (VARCHAR 255, UNIQUE), degree_level (degree_level ENUM), duration (VARCHAR 50), study_mode (study_mode ENUM), description (TEXT), admission_requirements (TEXT), status (institution_status ENUM), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ), search_vector (tsvector, GENERATED STORED)
- **Backend Usage**: ProgramRepository, ProgramService, ProgramController (/api/programs, /api/programs/:id)
- **Frontend Usage**: Programs discovery page, Institution Details -> Programs tab, Program Details modal
- **AI Relevance**: Answers "What undergraduate Computer Science degrees are offered in Addis Ababa?"

---

## 23. `admissions`

- **Purpose**: Application requirements, criteria, deadlines, and intake schedules for programs.
- **Primary Key**: `id`
- **Foreign Keys**: institution_id -> institutions(id), program_id -> programs(id)
- **Parent Tables**: institutions, programs
- **Child Tables**: None
- **Important Constraints**: CHECK (application_end IS NULL OR application_start IS NULL OR application_end >= application_start), NOT NULL on institution_id, degree_level
- **Information Stored**: Admission criteria, required documentation, portal URLs, application intake date windows.
- **Columns**: id (UUID, PK), institution_id (UUID, FK), program_id (UUID, FK), degree_level (degree_level ENUM), requirements (TEXT), documents (TEXT), application_process (TEXT), application_start (DATE), application_end (DATE), application_url (TEXT), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ)
- **Backend Usage**: AdmissionRepository, AdmissionService, AdmissionController (/api/admissions)
- **Frontend Usage**: Admissions discovery page, Institution Details -> Admissions tab
- **AI Relevance**: Key grounding data for admission eligibility, required documents, and deadline questions

---

## 24. `tuition_fees`

- **Purpose**: Tuition fee structures, payment intervals, and mandatory institutional fees.
- **Primary Key**: `id`
- **Foreign Keys**: institution_id -> institutions(id), program_id -> programs(id)
- **Parent Tables**: institutions, programs
- **Child Tables**: None
- **Important Constraints**: CHECK (amount >= 0), CHECK (additional_fees >= 0), NOT NULL on institution_id, amount, currency, period, effective_date
- **Information Stored**: Cost per semester/year/program, currency (ETB/USD), registration fees, verification sources.
- **Columns**: id (UUID, PK), institution_id (UUID, FK), program_id (UUID, FK), amount (NUMERIC 12,2), currency (VARCHAR 10), period (tuition_period ENUM), additional_fees (NUMERIC 12,2), effective_date (DATE), last_verified_at (TIMESTAMPTZ), source (VARCHAR 255)
- **Backend Usage**: TuitionRepository, TuitionService, TuitionController (/api/institutions/:id/tuition)
- **Frontend Usage**: Institution Details -> Tuition tab, cost breakdown calculator
- **AI Relevance**: Provides verified financial grounding for tuition and cost estimation inquiries

---

## 25. `program_careers`

- **Purpose**: Many-to-many junction linking academic degree programs to career outcomes.
- **Primary Key**: `(program_id, career_id)`
- **Foreign Keys**: program_id -> programs(id) ON DELETE CASCADE, career_id -> careers(id)
- **Parent Tables**: programs, careers
- **Child Tables**: None
- **Important Constraints**: Composite Primary Key
- **Information Stored**: Career pathways enabled by completing specific degree curricula.
- **Columns**: program_id (UUID, PK, FK), career_id (UUID, PK, FK)
- **Backend Usage**: ProgramRepository, CareerService (/api/programs/:id/careers)
- **Frontend Usage**: Program Details -> Career Opportunities list
- **AI Relevance**: Links degrees to job opportunities in AI advisory responses

---

## 26. `saved_programs`

- **Purpose**: Personalized user bookmarks for academic programs.
- **Primary Key**: `(user_id, program_id)`
- **Foreign Keys**: user_id -> users(id) ON DELETE CASCADE, program_id -> programs(id)
- **Parent Tables**: users, programs
- **Child Tables**: None
- **Important Constraints**: Composite Primary Key
- **Information Stored**: User bookmarks for degree programs of interest.
- **Columns**: user_id (UUID, PK, FK), program_id (UUID, PK, FK), created_at (TIMESTAMPTZ)
- **Backend Usage**: SavedRepository, SavedService, UserController (/api/users/me/saved-programs)
- **Frontend Usage**: Bookmark button on Program cards, User Profile -> Saved Programs
- **AI Relevance**: Powers personalized major recommendation workflows

---

## 27. `resources`

- **Purpose**: Central digital repository metadata catalog for documents, multimedia, and research.
- **Primary Key**: `id`
- **Foreign Keys**: uploaded_by -> users(id), institution_id -> institutions(id), faculty_id -> faculties(id), department_id -> departments(id), program_id -> programs(id)
- **Parent Tables**: users, institutions, faculties, departments, programs
- **Child Tables**: research, resource_categories, resource_tags, resource_bookmarks, resource_views, resource_downloads, resource_reports
- **Important Constraints**: CHECK (file_size_bytes >= 0), CHECK (publication_year BETWEEN 1800 AND 2100), CHECK file_extension IN (pdf, doc, docx, xls, xlsx, ppt, pptx, epub, mp4, webm, mov, mp3, wav, m4a), NOT NULL on title, resource_type, mime_type, file_extension, original_filename, file_size_bytes, storage_key, status, visibility
- **Information Stored**: File metadata, supported formats (PDF, DOCX, XLSX, PPTX, EPUB, MP4, WebM, MP3, etc.), storage keys, extracted text, media transcripts, full-text search index.
- **Columns**: id (UUID, PK), title (VARCHAR 255), description (TEXT), resource_type (resource_type ENUM), mime_type (VARCHAR 120), file_extension (VARCHAR 20), original_filename (VARCHAR 255), file_size_bytes (BIGINT), storage_provider (VARCHAR 50), storage_bucket (VARCHAR 100), storage_key (VARCHAR 500), checksum (VARCHAR 64), uploaded_by (UUID, FK), institution_id (UUID, FK), faculty_id (UUID, FK), department_id (UUID, FK), program_id (UUID, FK), publication_year (SMALLINT), language (VARCHAR 10), status (resource_status ENUM), visibility (resource_visibility ENUM), extracted_text (TEXT), transcript (TEXT), processing_status (processing_status ENUM), processing_error (TEXT), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ), search_vector (tsvector, GENERATED STORED)
- **Backend Usage**: ResourceRepository, ResourceService, ResourceController (/api/resources, /api/resources/:id, /api/resources/:id/download)
- **Frontend Usage**: Resources catalog page (/resources), Institution Details -> Resources tab (/institutions/:id/resources), Resource details modal, download action
- **AI Relevance**: Grounding knowledge base for syllabus, lecture materials, and academic guides

---

## 28. `research`

- **Purpose**: 1-to-1 extension table holding scientific and academic research attributes.
- **Primary Key**: `id`
- **Foreign Keys**: resource_id -> resources(id) ON DELETE CASCADE
- **Parent Tables**: resources
- **Child Tables**: research_authors
- **Important Constraints**: resource_id UNIQUE, CHECK (publication_year BETWEEN 1800 AND 2100), NOT NULL on resource_id, research_type
- **Information Stored**: Research abstracts, publication dates, journal/conference venues, DOI links, keywords array, dedicated full-text search index.
- **Columns**: id (UUID, PK), resource_id (UUID, UNIQUE, FK), abstract (TEXT), research_type (research_type ENUM), publication_date (DATE), publication_year (SMALLINT), journal_name (VARCHAR 255), conference_name (VARCHAR 255), doi (VARCHAR 100), keywords (TEXT[]), language (VARCHAR 10), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ), search_vector (tsvector, GENERATED STORED)
- **Backend Usage**: ResearchRepository, ResearchService, ResearchController (/api/research, /api/research/:id)
- **Frontend Usage**: Research discovery page (/research), Institution Details -> Research tab (/institutions/:id/research), Paper citation modal
- **AI Relevance**: Grounding context for academic research, university publications, and literature inquiries

---

## 29. `resource_categories`

- **Purpose**: Many-to-many junction linking resources to subject categories.
- **Primary Key**: `(resource_id, category_id)`
- **Foreign Keys**: resource_id -> resources(id) ON DELETE CASCADE, category_id -> categories(id)
- **Parent Tables**: resources, categories
- **Child Tables**: None
- **Important Constraints**: Composite Primary Key
- **Information Stored**: Taxonomic subject tagging for educational files.
- **Columns**: resource_id (UUID, PK, FK), category_id (UUID, PK, FK), created_at (TIMESTAMPTZ)
- **Backend Usage**: ResourceRepository, CategoryService (/api/resources?category=slug)
- **Frontend Usage**: Category filtering badges on resource cards
- **AI Relevance**: Enables topical filtering of resources

---

## 30. `resource_tags`

- **Purpose**: Many-to-many junction linking resources to keyword tags.
- **Primary Key**: `(resource_id, tag_id)`
- **Foreign Keys**: resource_id -> resources(id) ON DELETE CASCADE, tag_id -> tags(id)
- **Parent Tables**: resources, tags
- **Child Tables**: None
- **Important Constraints**: Composite Primary Key
- **Information Stored**: Keyword associations for resources.
- **Columns**: resource_id (UUID, PK, FK), tag_id (UUID, PK, FK), created_at (TIMESTAMPTZ)
- **Backend Usage**: ResourceRepository, TagService (/api/resources?tag=slug)
- **Frontend Usage**: Tag badges on resource listings
- **AI Relevance**: Topical relevance matching

---

## 31. `resource_bookmarks`

- **Purpose**: User saved resources and study materials repository.
- **Primary Key**: `(user_id, resource_id)`
- **Foreign Keys**: user_id -> users(id) ON DELETE CASCADE, resource_id -> resources(id) ON DELETE CASCADE
- **Parent Tables**: users, resources
- **Child Tables**: None
- **Important Constraints**: Composite Primary Key
- **Information Stored**: Personalized user bookmarks for learning materials.
- **Columns**: user_id (UUID, PK, FK), resource_id (UUID, PK, FK), created_at (TIMESTAMPTZ)
- **Backend Usage**: SavedRepository, ResourceService, UserController (/api/users/me/saved-resources)
- **Frontend Usage**: Bookmark resource icon, User Profile -> Saved Resources
- **AI Relevance**: Personalizes learning recommendations

---

## 32. `resource_views`

- **Purpose**: View analytics and engagement logging for resources.
- **Primary Key**: `id`
- **Foreign Keys**: resource_id -> resources(id) ON DELETE CASCADE, user_id -> users(id) ON DELETE SET NULL
- **Parent Tables**: resources, users
- **Child Tables**: None
- **Important Constraints**: NOT NULL on resource_id
- **Information Stored**: Resource view counts, unique viewer telemetry with hashed IP addresses.
- **Columns**: id (UUID, PK), resource_id (UUID, FK), user_id (UUID, FK), ip_hash (VARCHAR 64), created_at (TIMESTAMPTZ)
- **Backend Usage**: ResourceRepository, ResourceService (/api/resources/:id/view)
- **Frontend Usage**: View counter on resource detail pages
- **AI Relevance**: Trending resource identification

---

## 33. `resource_downloads`

- **Purpose**: Download metrics and file retrieval telemetry.
- **Primary Key**: `id`
- **Foreign Keys**: resource_id -> resources(id) ON DELETE CASCADE, user_id -> users(id) ON DELETE SET NULL
- **Parent Tables**: resources, users
- **Child Tables**: None
- **Important Constraints**: NOT NULL on resource_id
- **Information Stored**: Download counts and engagement tracking.
- **Columns**: id (UUID, PK), resource_id (UUID, FK), user_id (UUID, FK), ip_hash (VARCHAR 64), created_at (TIMESTAMPTZ)
- **Backend Usage**: ResourceRepository, ResourceService (/api/resources/:id/download)
- **Frontend Usage**: Download counter on resource cards
- **AI Relevance**: Relevance and popularity metrics

---

## 34. `resource_reports`

- **Purpose**: Content moderation tickets and community reporting for resources.
- **Primary Key**: `id`
- **Foreign Keys**: resource_id -> resources(id) ON DELETE CASCADE, reporter_id -> users(id) ON DELETE SET NULL, reviewed_by -> users(id) ON DELETE SET NULL
- **Parent Tables**: resources, users
- **Child Tables**: None
- **Important Constraints**: NOT NULL on resource_id, reason, status
- **Information Stored**: Content flags (copyright, broken file, inappropriate content), admin review workflow.
- **Columns**: id (UUID, PK), resource_id (UUID, FK), reporter_id (UUID, FK), reason (report_reason ENUM), description (TEXT), status (report_status ENUM), reviewed_by (UUID, FK), reviewed_at (TIMESTAMPTZ), notes (TEXT), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ)
- **Backend Usage**: ReportRepository, ReportService, AdminController (/api/resources/:id/report, /api/admin/reports)
- **Frontend Usage**: Report resource dialog button, Admin moderation queue
- **AI Relevance**: Excludes flagged/unapproved resources from AI grounding responses

---

## 35. `research_authors`

- **Purpose**: Ordered authorship association junction linking research papers to author profiles.
- **Primary Key**: `(research_id, author_id)`
- **Foreign Keys**: research_id -> research(id) ON DELETE CASCADE, author_id -> authors(id)
- **Parent Tables**: research, authors
- **Child Tables**: None
- **Important Constraints**: Composite Primary Key, UNIQUE (research_id, author_order), CHECK (author_order >= 1), NOT NULL on author_order, is_corresponding
- **Information Stored**: Academic attribution order (1st author, 2nd author), corresponding author indicator.
- **Columns**: research_id (UUID, PK, FK), author_id (UUID, PK, FK), author_order (SMALLINT), is_corresponding (BOOLEAN), created_at (TIMESTAMPTZ)
- **Backend Usage**: ResearchRepository, AuthorService (/api/research/:id/authors)
- **Frontend Usage**: Paper citation header, corresponding author badges
- **AI Relevance**: Author attribution and collaboration graph analysis

---

