# GIBIConnect Resource & Research Database Architecture Specification

## 1. Architectural Overview
The GIBIConnect Resource & Research subsystem extends the relational foundation of GIBIConnect to provide a high-performance, normalized, and searchable repository for academic documents, multimedia learning resources, datasets, theses, dissertations, and peer-reviewed research papers.

The design adheres to strict non-destructive, additive PostgreSQL design principles, seamlessly integrating with existing institutions, faculties, departments, programs, and user accounts.

```
                    +--------------------+
                    |    institutions    |
                    +---------+----------+
                              |
                     +--------+--------+
                     |    faculties    |
                     +--------+--------+
                              |
                    +---------+----------+
                    |    departments     |
                    +---------+----------+
                              |
                      +-------+--------+
                      |    programs    |
                      +-------+--------+
                              |
+-------------+      +--------+---------+      +-------------------+
|    users    +----->|    resources    |<-----+    categories     |
+------+------+      +--------+---------+      +-------------------+
       |                      |
       |             +--------+--------+       +-------------------+
       |             |    research     |<------+       tags        |
       |             +--------+--------+       +-------------------+
       |                      |
       |             +--------+--------+
       +------------>| research_authors|
                     +--------+--------+
                              |
                     +--------+--------+
                     |     authors     |
                     +-----------------+
```

---

## 2. Table Specifications

### 2.1 `resources` (Central Catalog)
- **Purpose**: General catalog for all media and document types (PDF, DOCX, XLSX, PPTX, EPUB, MP4, WebM, MOV, MP3, WAV, M4A).
- **Primary Key**: `id UUID DEFAULT gen_random_uuid()`
- **Key Relationships**:
  - `uploaded_by` $\rightarrow$ `users(id) ON DELETE SET NULL`
  - `institution_id` $\rightarrow$ `institutions(id) ON DELETE RESTRICT`
  - `faculty_id` $\rightarrow$ `faculties(id) ON DELETE RESTRICT`
  - `department_id` $\rightarrow$ `departments(id) ON DELETE RESTRICT`
  - `program_id` $\rightarrow$ `programs(id) ON DELETE RESTRICT`
- **Search Capabilities**:
  - `search_vector`: Generated always `tsvector` storing weighted title, description, extracted text, and media transcript.
  - GIN indexed for sub-millisecond full-text retrieval.
  - Trigram indexed on `title` and `original_filename` for typo-tolerant fuzzy search.

### 2.2 `research` (Academic Research Extension)
- **Purpose**: 1-to-1 extension of `resources` storing specialized research attributes.
- **Foreign Key / Unique**: `resource_id UUID UNIQUE REFERENCES resources(id) ON DELETE CASCADE`
- **Attributes**: `abstract`, `research_type` (paper, thesis, dissertation, report, conference_paper, journal_article), `publication_date`, `publication_year`, `journal_name`, `conference_name`, `doi`, `keywords` (`TEXT[]`), `language`.
- **Search**: Independent `search_vector` generated from abstract, journal name, conference name, DOI, and keywords.

### 2.3 `authors` & `research_authors`
- **Purpose**: Normalized multi-author attribution supporting external academics and internal user accounts.
- **Ordering**: `research_authors(research_id, author_order)` with `UNIQUE` constraint and `author_order >= 1`.
- **Corresponding Author**: `is_corresponding BOOLEAN DEFAULT false`.

### 2.4 Categorization & Tagging
- `categories` / `resource_categories`: Structured subject taxonomy (Computer Science, Engineering, Medicine, Agriculture, Business).
- `tags` / `resource_tags`: Flexible folksonomy tagging (`machine-learning`, `curriculum-2026`, `thesis`).

### 2.5 User Interaction & Analytics
- `resource_bookmarks`: User-saved items with `PRIMARY KEY (user_id, resource_id)`.
- `resource_views`: View analytics with `ip_hash` for privacy-preserving count aggregation.
- `resource_downloads`: Download metrics tracking.
- `resource_reports`: Content moderation tickets with controlled `report_reason` and lifecycle `report_status`.

---

## 3. Supported File Types & MIME Types
The database strictly validates file extensions via `CHECK (file_extension IN (...))`:
- **Documents**: `pdf` (`application/pdf`), `doc` (`application/msword`), `docx` (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`)
- **Spreadsheets**: `xls` (`application/vnd.ms-excel`), `xlsx` (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)
- **Presentations**: `ppt` (`application/vnd.ms-powerpoint`), `pptx` (`application/vnd.openxmlformats-officedocument.presentationml.presentation`)
- **E-Books**: `epub` (`application/epub+zip`)
- **Video**: `mp4` (`video/mp4`), `webm` (`video/webm`), `mov` (`video/quicktime`)
- **Audio**: `mp3` (`audio/mpeg`), `wav` (`audio/wav`), `m4a` (`audio/mp4`)

---

## 4. Indexing Strategy Summary
1. **GIN Full-Text Indexes**:
   - `resources_search_idx` on `resources USING GIN(search_vector)`
   - `research_search_idx` on `research USING GIN(search_vector)`
2. **GIN Trigram Indexes**:
   - `resources_title_trgm_idx` on `resources USING GIN(title gin_trgm_ops)`
   - `resources_filename_trgm_idx` on `resources USING GIN(original_filename gin_trgm_ops)`
   - `research_journal_trgm_idx` on `research USING GIN(journal_name gin_trgm_ops)`
   - `authors_name_trgm_idx` on `authors USING GIN(full_name gin_trgm_ops)`
3. **B-Tree Foreign Key & Filter Indexes**:
   - `resources_institution_idx`, `resources_faculty_idx`, `resources_department_idx`, `resources_program_idx`, `resources_uploaded_by_idx`
   - `resources_filter_idx` on `(resource_type, status, visibility)`
   - `resources_approved_idx` (partial index) on `(institution_id, resource_type) WHERE status = 'approved' AND visibility = 'public'`
   - `research_pub_date_idx`, `research_doi_idx`, `research_authors_author_idx`
   - `resource_bookmarks_user_idx`, `resource_views_resource_idx`, `resource_downloads_resource_idx`, `resource_reports_resource_idx`
