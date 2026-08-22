-- 09_institution_scholarships.sql
CREATE TABLE IF NOT EXISTS institution_scholarships (
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE RESTRICT,
  PRIMARY KEY (institution_id, scholarship_id)
);
