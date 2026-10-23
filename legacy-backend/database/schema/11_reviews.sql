-- 11_reviews.sql
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
