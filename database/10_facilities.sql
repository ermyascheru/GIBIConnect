-- 10_facilities.sql
CREATE TABLE IF NOT EXISTS facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  type facility_type NOT NULL,
  description TEXT
);
