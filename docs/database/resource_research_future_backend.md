# GIBIConnect Resource & Research — Future Backend Integration Blueprint

## 1. Overview
This document outlines the architectural boundaries and future backend requirements for integrating Node.js / Express services with the newly established PostgreSQL `resources` and `research` database subsystems.

No backend code was modified in this database-only phase. This reference serves as a contract for future backend and API engineering.

---

## 2. Storage Abstraction Boundary
The database stores only metadata and storage coordinates:
- `storage_provider`: e.g. `'local'`, `'s3'`, `'supabase'`, `'gcs'`
- `storage_bucket`: Storage container identifier
- `storage_key`: Object key path (e.g. `resources/institutions/aau/thesis/2026/cs-thesis.pdf`)
- `checksum`: SHA-256 hash calculated during upload for file integrity validation

### Future Backend Upload Flow:
1. Client initiates upload request with metadata $\rightarrow$ Backend generates presigned URL or receives multipart chunk.
2. Backend uploads binary to object storage $\rightarrow$ Computes SHA-256 checksum and extracts file size.
3. Backend performs atomic SQL insert into `resources` with `processing_status = 'pending'`.
4. Asynchronous worker queue is notified for text extraction / media transcription.

---

## 3. Asynchronous Content Processing Workflow
- **Documents (PDF, DOCX, EPUB)**:
  - Background worker extracts plaintext $\rightarrow$ updates `resources.extracted_text`.
  - Sets `resources.processing_status = 'processed'`.
  - Automatically updates `resources.search_vector` via stored generated column.
- **Multimedia (MP4, WebM, MP3, WAV, M4A)**:
  - Audio extraction $\rightarrow$ Speech-to-Text transcription $\rightarrow$ updates `resources.transcript`.
  - Sets `resources.processing_status = 'processed'`.

---

## 4. Repository & Query Patterns

### 4.1 Filtered Search Query
```sql
SELECT 
  r.id, r.title, r.resource_type, r.file_extension, r.file_size_bytes,
  i.name AS institution_name, p.name AS program_name,
  ts_rank_cd(r.search_vector, websearch_to_tsquery('english', $1)) AS search_rank
FROM resources r
LEFT JOIN institutions i ON i.id = r.institution_id
LEFT JOIN programs p ON p.id = r.program_id
WHERE r.status = 'approved' 
  AND r.visibility = 'public'
  AND ($1 = '' OR r.search_vector @@ websearch_to_tsquery('english', $1))
  AND ($2::uuid IS NULL OR r.institution_id = $2)
  AND ($3::resource_type IS NULL OR r.resource_type = $3)
ORDER BY search_rank DESC, r.created_at DESC
LIMIT $4 OFFSET $5;
```

### 4.2 Research Query with Ordered Authors
```sql
SELECT 
  res.id AS research_id,
  r.title, r.storage_key, r.file_size_bytes,
  res.abstract, res.research_type, res.publication_year, res.journal_name, res.doi,
  json_agg(json_build_object(
    'author_id', a.id,
    'full_name', a.full_name,
    'affiliation', a.affiliation,
    'orcid', a.orcid,
    'is_corresponding', ra.is_corresponding,
    'order', ra.author_order
  ) ORDER BY ra.author_order) AS authors
FROM research res
JOIN resources r ON r.id = res.resource_id
JOIN research_authors ra ON ra.research_id = res.id
JOIN authors a ON a.id = ra.author_id
WHERE res.id = $1
GROUP BY res.id, r.title, r.storage_key, r.file_size_bytes, res.abstract, res.research_type, res.publication_year, res.journal_name, res.doi;
```

---

## 5. Security & Access Control Policies
1. **Public Resources**: Accessible anonymously when `status = 'approved'` AND `visibility = 'public'`.
2. **Restricted Resources**: Require authenticated user with active enrollment / institution affiliation.
3. **Private / Draft Resources**: Accessible only by `uploaded_by` user or users with `role IN ('moderator', 'admin')`.
4. **Moderation Queue**: Reports query `resource_reports WHERE status = 'pending'` accessible only by moderators/admins.
