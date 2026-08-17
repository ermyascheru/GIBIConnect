-- 27_resources.sql
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
