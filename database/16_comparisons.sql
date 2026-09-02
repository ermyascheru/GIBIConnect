-- 16_comparisons.sql
CREATE TABLE IF NOT EXISTS comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution_ids UUID[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (cardinality(institution_ids) BETWEEN 2 AND 4),
  CHECK (uuid_array_has_unique_elements(institution_ids))
);
