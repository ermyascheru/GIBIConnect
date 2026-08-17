-- 28_research.sql
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
