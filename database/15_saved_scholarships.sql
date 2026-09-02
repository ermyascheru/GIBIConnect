-- 15_saved_scholarships.sql
CREATE TABLE IF NOT EXISTS saved_scholarships (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, scholarship_id)
);
