-- Migration 002: Add Resource Library and Research Subsystems
BEGIN;

DO $$ BEGIN
  CREATE TYPE resource_type AS ENUM ('document', 'spreadsheet', 'presentation', 'ebook', 'video', 'audio', 'research');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE resource_status AS ENUM ('pending', 'approved', 'rejected', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE resource_visibility AS ENUM ('public', 'restricted', 'private');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE processing_status AS ENUM ('pending', 'processing', 'processed', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE research_type AS ENUM ('paper', 'thesis', 'dissertation', 'report', 'conference_paper', 'journal_article', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE report_reason AS ENUM ('copyright', 'incorrect_information', 'inappropriate_content', 'malware', 'duplicate', 'broken_file', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE OR REPLACE FUNCTION text_array_to_string_immutable(input TEXT[], delim TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
  SELECT array_to_string(input, delim);
$$;

CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  resource_type resource_type NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  file_extension VARCHAR(20) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  storage_provider VARCHAR(50) NOT NULL DEFAULT 'local',
  storage_bucket VARCHAR(100),
  storage_key VARCHAR(500) NOT NULL,
  checksum VARCHAR(64),
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  institution_id UUID REFERENCES institutions(id) ON DELETE RESTRICT,
  faculty_id UUID REFERENCES faculties(id) ON DELETE RESTRICT,
  department_id UUID REFERENCES departments(id) ON DELETE RESTRICT,
  program_id UUID REFERENCES programs(id) ON DELETE RESTRICT,
  publication_year SMALLINT,
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  status resource_status NOT NULL DEFAULT 'pending',
  visibility resource_visibility NOT NULL DEFAULT 'public',
  extracted_text TEXT,
  transcript TEXT,
  processing_status processing_status NOT NULL DEFAULT 'pending',
  processing_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', 
      coalesce(title, '') || ' ' || 
      coalesce(description, '') || ' ' || 
      coalesce(extracted_text, '') || ' ' || 
      coalesce(transcript, '')
    )
  ) STORED,
  CHECK (file_size_bytes >= 0),
  CHECK (publication_year IS NULL OR (publication_year BETWEEN 1800 AND 2100)),
  CHECK (file_extension IN ('pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'epub', 'mp4', 'webm', 'mov', 'mp3', 'wav', 'm4a'))
);

CREATE TABLE IF NOT EXISTS research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID UNIQUE NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  abstract TEXT,
  research_type research_type NOT NULL DEFAULT 'paper',
  publication_date DATE,
  publication_year SMALLINT,
  journal_name VARCHAR(255),
  conference_name VARCHAR(255),
  doi VARCHAR(100),
  keywords TEXT[],
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', 
      coalesce(abstract, '') || ' ' || 
      coalesce(journal_name, '') || ' ' || 
      coalesce(conference_name, '') || ' ' || 
      coalesce(doi, '') || ' ' || 
      coalesce(text_array_to_string_immutable(keywords, ' '), '')
    )
  ) STORED,
  CHECK (publication_year IS NULL OR (publication_year BETWEEN 1800 AND 2100))
);

CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255),
  affiliation VARCHAR(255),
  orcid VARCHAR(30),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_authors (
  research_id UUID NOT NULL REFERENCES research(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES authors(id) ON DELETE RESTRICT,
  author_order SMALLINT NOT NULL DEFAULT 1,
  is_corresponding BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (research_id, author_id),
  UNIQUE (research_id, author_order),
  CHECK (author_order >= 1)
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resource_categories (
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (resource_id, category_id)
);

CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resource_tags (
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (resource_id, tag_id)
);

CREATE TABLE IF NOT EXISTS resource_bookmarks (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, resource_id)
);

CREATE TABLE IF NOT EXISTS resource_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_hash VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resource_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_hash VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resource_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reason report_reason NOT NULL,
  description TEXT,
  status report_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$ BEGIN
  CREATE TRIGGER resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER research_updated_at BEFORE UPDATE ON research FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER authors_updated_at BEFORE UPDATE ON authors FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER resource_reports_updated_at BEFORE UPDATE ON resource_reports FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS resources_institution_idx ON resources(institution_id);
CREATE INDEX IF NOT EXISTS resources_faculty_idx ON resources(faculty_id);
CREATE INDEX IF NOT EXISTS resources_department_idx ON resources(department_id);
CREATE INDEX IF NOT EXISTS resources_program_idx ON resources(program_id);
CREATE INDEX IF NOT EXISTS resources_uploaded_by_idx ON resources(uploaded_by);
CREATE INDEX IF NOT EXISTS resources_filter_idx ON resources(resource_type, status, visibility);
CREATE INDEX IF NOT EXISTS resources_approved_idx ON resources(institution_id, resource_type) WHERE status = 'approved' AND visibility = 'public';
CREATE INDEX IF NOT EXISTS resources_pub_year_idx ON resources(publication_year DESC);
CREATE INDEX IF NOT EXISTS resources_search_idx ON resources USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS resources_title_trgm_idx ON resources USING GIN(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS resources_filename_trgm_idx ON resources USING GIN(original_filename gin_trgm_ops);

CREATE INDEX IF NOT EXISTS research_resource_idx ON research(resource_id);
CREATE INDEX IF NOT EXISTS research_type_idx ON research(research_type);
CREATE INDEX IF NOT EXISTS research_pub_date_idx ON research(publication_date DESC);
CREATE INDEX IF NOT EXISTS research_doi_idx ON research(doi) WHERE doi IS NOT NULL;
CREATE INDEX IF NOT EXISTS research_search_idx ON research USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS research_journal_trgm_idx ON research USING GIN(journal_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS authors_user_idx ON authors(user_id);
CREATE INDEX IF NOT EXISTS authors_name_trgm_idx ON authors USING GIN(full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS research_authors_author_idx ON research_authors(author_id);

CREATE INDEX IF NOT EXISTS resource_categories_category_idx ON resource_categories(category_id);
CREATE INDEX IF NOT EXISTS resource_tags_tag_idx ON resource_tags(tag_id);
CREATE INDEX IF NOT EXISTS resource_bookmarks_user_idx ON resource_bookmarks(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS resource_views_resource_idx ON resource_views(resource_id, created_at DESC);
CREATE INDEX IF NOT EXISTS resource_downloads_resource_idx ON resource_downloads(resource_id, created_at DESC);
CREATE INDEX IF NOT EXISTS resource_reports_resource_idx ON resource_reports(resource_id, status);

COMMIT;
