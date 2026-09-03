-- GIBIConnect PostgreSQL Master Schema and Seed Data
-- Full System: Institutional Core + Academic Directory + AI Context Logs + Resource & Research Library Subsystems
-- Run with: psql "$DATABASE_URL" -f gibiconnect.sql

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- ENUM TYPES
-- ============================================================================
CREATE TYPE institution_type AS ENUM ('university', 'college');
CREATE TYPE institution_ownership AS ENUM ('public', 'private');
CREATE TYPE institution_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE user_role AS ENUM ('guest', 'user', 'moderator', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'deleted');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified');
CREATE TYPE degree_level AS ENUM ('certificate', 'diploma', 'bachelor', 'master', 'phd');
CREATE TYPE study_mode AS ENUM ('full_time', 'part_time', 'online', 'hybrid');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE news_status AS ENUM ('draft', 'published');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE facility_type AS ENUM ('library', 'laboratory', 'computer_lab', 'research_center', 'student_housing', 'medical_services', 'sports_facility', 'other');
CREATE TYPE calendar_event_type AS ENUM ('registration', 'semester_start', 'semester_end', 'examination', 'holiday', 'other');
CREATE TYPE ai_message_role AS ENUM ('user', 'assistant');
CREATE TYPE tuition_period AS ENUM ('per_semester', 'per_year', 'per_program');

-- Resource & Research Subsystem ENUMs
CREATE TYPE resource_type AS ENUM ('document', 'spreadsheet', 'presentation', 'ebook', 'video', 'audio', 'research');
CREATE TYPE resource_status AS ENUM ('pending', 'approved', 'rejected', 'archived');
CREATE TYPE resource_visibility AS ENUM ('public', 'restricted', 'private');
CREATE TYPE processing_status AS ENUM ('pending', 'processing', 'processed', 'failed');
CREATE TYPE research_type AS ENUM ('paper', 'thesis', 'dissertation', 'report', 'conference_paper', 'journal_article', 'other');
CREATE TYPE report_reason AS ENUM ('copyright', 'incorrect_information', 'inappropriate_content', 'malware', 'duplicate', 'broken_file', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');

-- ============================================================================
-- HELPER & TRIGGER FUNCTIONS
-- ============================================================================
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION uuid_array_has_unique_elements(input UUID[]) RETURNS boolean
LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
  SELECT cardinality(input) = (SELECT count(DISTINCT value) FROM unnest(input) AS value);
$$;

CREATE OR REPLACE FUNCTION text_array_to_string_immutable(input TEXT[], delim TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
  SELECT array_to_string(input, delim);
$$;

-- ============================================================================
-- CORE TABLES (1 to 23)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  status user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (role <> 'guest')
);

CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  history TEXT,
  type institution_type NOT NULL,
  ownership institution_ownership NOT NULL,
  logo_url TEXT,
  cover_image_url TEXT,
  website_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  address VARCHAR(255),
  city VARCHAR(120) NOT NULL,
  region VARCHAR(120) NOT NULL,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  accreditation VARCHAR(255),
  status institution_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,'') || ' ' || coalesce(history,''))
  ) STORED,
  CHECK (latitude BETWEEN -90 AND 90),
  CHECK (longitude BETWEEN -180 AND 180)
);

CREATE TABLE IF NOT EXISTS institution_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID UNIQUE NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  status verification_status NOT NULL DEFAULT 'unverified',
  source VARCHAR(255),
  verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS faculties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  UNIQUE (institution_id, name)
);

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES faculties(id) ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  UNIQUE (faculty_id, name)
);

CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  degree_level degree_level NOT NULL,
  duration VARCHAR(50),
  study_mode study_mode NOT NULL,
  description TEXT,
  admission_requirements TEXT,
  status institution_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,'') || ' ' || coalesce(admission_requirements,''))
  ) STORED
);

CREATE TABLE IF NOT EXISTS admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  program_id UUID REFERENCES programs(id) ON DELETE RESTRICT,
  degree_level degree_level NOT NULL,
  requirements TEXT,
  documents TEXT,
  application_process TEXT,
  application_start DATE,
  application_end DATE,
  application_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (application_end IS NULL OR application_start IS NULL OR application_end >= application_start)
);

CREATE TABLE IF NOT EXISTS tuition_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  program_id UUID REFERENCES programs(id) ON DELETE RESTRICT,
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'ETB',
  period tuition_period NOT NULL,
  additional_fees NUMERIC(12,2) NOT NULL DEFAULT 0,
  effective_date DATE NOT NULL,
  last_verified_at TIMESTAMPTZ,
  source VARCHAR(255),
  CHECK (amount >= 0),
  CHECK (additional_fees >= 0)
);

CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  eligibility TEXT,
  deadline DATE,
  funding VARCHAR(255),
  application_url TEXT,
  status content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS institution_scholarships (
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE RESTRICT,
  PRIMARY KEY (institution_id, scholarship_id)
);

CREATE TABLE IF NOT EXISTS facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  type facility_type NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  teaching_rating SMALLINT NOT NULL,
  facility_rating SMALLINT NOT NULL,
  campus_rating SMALLINT NOT NULL,
  administration_rating SMALLINT NOT NULL,
  comment TEXT,
  status review_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (institution_id, user_id),
  CHECK (teaching_rating BETWEEN 1 AND 5),
  CHECK (facility_rating BETWEEN 1 AND 5),
  CHECK (campus_rating BETWEEN 1 AND 5),
  CHECK (administration_rating BETWEEN 1 AND 5)
);

CREATE TABLE IF NOT EXISTS institution_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  published_at TIMESTAMPTZ,
  source_url TEXT,
  status news_status NOT NULL DEFAULT 'draft'
);

CREATE TABLE IF NOT EXISTS academic_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  title VARCHAR(255) NOT NULL,
  event_type calendar_event_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS program_careers (
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE RESTRICT,
  PRIMARY KEY (program_id, career_id)
);

CREATE TABLE IF NOT EXISTS saved_institutions (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, institution_id)
);

CREATE TABLE IF NOT EXISTS saved_programs (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, program_id)
);

CREATE TABLE IF NOT EXISTS saved_scholarships (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, scholarship_id)
);

CREATE TABLE IF NOT EXISTS comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution_ids UUID[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (cardinality(institution_ids) BETWEEN 2 AND 4),
  CHECK (uuid_array_has_unique_elements(institution_ids))
);

CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  institution_context_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
  title VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role ai_message_role NOT NULL,
  content TEXT NOT NULL,
  retrieved_context JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  changes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- RESOURCE & RESEARCH TABLES (24 to 35)
-- ============================================================================
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
  user_id REFERENCES users(id) ON DELETE SET NULL,
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

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER institutions_updated_at BEFORE UPDATE ON institutions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER admissions_updated_at BEFORE UPDATE ON admissions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER ai_conversations_updated_at BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER research_updated_at BEFORE UPDATE ON research FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER authors_updated_at BEFORE UPDATE ON authors FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER resource_reports_updated_at BEFORE UPDATE ON resource_reports FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX users_role_idx ON users(role);
CREATE INDEX institutions_filter_idx ON institutions(type, region, city, ownership);
CREATE INDEX institutions_published_idx ON institutions(region, city, type) WHERE status = 'published';
CREATE INDEX institutions_search_idx ON institutions USING GIN(search_vector);
CREATE INDEX institutions_name_trgm_idx ON institutions USING GIN(name gin_trgm_ops);
CREATE INDEX institutions_slug_trgm_idx ON institutions USING GIN(slug gin_trgm_ops);
CREATE INDEX verification_next_review_idx ON institution_verification(next_review_at);
CREATE INDEX faculties_institution_idx ON faculties(institution_id);
CREATE INDEX departments_faculty_idx ON departments(faculty_id);
CREATE INDEX programs_institution_degree_idx ON programs(institution_id, degree_level);
CREATE INDEX programs_published_idx ON programs(institution_id, degree_level) WHERE status = 'published';
CREATE INDEX programs_search_idx ON programs USING GIN(search_vector);
CREATE INDEX programs_name_trgm_idx ON programs USING GIN(name gin_trgm_ops);
CREATE INDEX programs_slug_trgm_idx ON programs USING GIN(slug gin_trgm_ops);
CREATE INDEX admissions_institution_degree_idx ON admissions(institution_id, degree_level);
CREATE INDEX tuition_institution_program_idx ON tuition_fees(institution_id, program_id);
CREATE INDEX scholarship_institution_reverse_idx ON institution_scholarships(scholarship_id);
CREATE INDEX facilities_institution_type_idx ON facilities(institution_id, type);
CREATE INDEX reviews_institution_status_idx ON reviews(institution_id, status);
CREATE INDEX news_institution_published_idx ON institution_news(institution_id, published_at DESC);
CREATE INDEX calendar_institution_start_idx ON academic_calendar(institution_id, start_date);
CREATE INDEX program_careers_career_idx ON program_careers(career_id);
CREATE INDEX conversations_user_recent_idx ON ai_conversations(user_id, updated_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX conversations_institution_recent_idx ON ai_conversations(institution_context_id, updated_at DESC) WHERE institution_context_id IS NOT NULL;
CREATE INDEX messages_conversation_created_idx ON ai_messages(conversation_id, created_at);
CREATE INDEX audit_entity_created_idx ON audit_logs(entity_type, entity_id, created_at);

-- Resource & Research Indexes
CREATE INDEX resources_institution_idx ON resources(institution_id);
CREATE INDEX resources_faculty_idx ON resources(faculty_id);
CREATE INDEX resources_department_idx ON resources(department_id);
CREATE INDEX resources_program_idx ON resources(program_id);
CREATE INDEX resources_uploaded_by_idx ON resources(uploaded_by);
CREATE INDEX resources_filter_idx ON resources(resource_type, status, visibility);
CREATE INDEX resources_approved_idx ON resources(institution_id, resource_type) WHERE status = 'approved' AND visibility = 'public';
CREATE INDEX resources_pub_year_idx ON resources(publication_year DESC);
CREATE INDEX resources_search_idx ON resources USING GIN(search_vector);
CREATE INDEX resources_title_trgm_idx ON resources USING GIN(title gin_trgm_ops);
CREATE INDEX resources_filename_trgm_idx ON resources USING GIN(original_filename gin_trgm_ops);

CREATE INDEX research_resource_idx ON research(resource_id);
CREATE INDEX research_type_idx ON research(research_type);
CREATE INDEX research_pub_date_idx ON research(publication_date DESC);
CREATE INDEX research_doi_idx ON research(doi) WHERE doi IS NOT NULL;
CREATE INDEX research_search_idx ON research USING GIN(search_vector);
CREATE INDEX research_journal_trgm_idx ON research USING GIN(journal_name gin_trgm_ops);

CREATE INDEX authors_user_idx ON authors(user_id);
CREATE INDEX authors_name_trgm_idx ON authors USING GIN(full_name gin_trgm_ops);
CREATE INDEX research_authors_author_idx ON research_authors(author_id);

CREATE INDEX resource_categories_category_idx ON resource_categories(category_id);
CREATE INDEX resource_tags_tag_idx ON resource_tags(tag_id);
CREATE INDEX resource_bookmarks_user_idx ON resource_bookmarks(user_id, created_at DESC);
CREATE INDEX resource_views_resource_idx ON resource_views(resource_id, created_at DESC);
CREATE INDEX resource_downloads_resource_idx ON resource_downloads(resource_id, created_at DESC);
CREATE INDEX resource_reports_resource_idx ON resource_reports(resource_id, status);

COMMIT;
