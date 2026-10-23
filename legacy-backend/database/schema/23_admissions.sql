-- 23_admissions.sql
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
