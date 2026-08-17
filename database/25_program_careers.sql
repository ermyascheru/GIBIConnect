-- 25_program_careers.sql
CREATE TABLE IF NOT EXISTS program_careers (
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE RESTRICT,
  PRIMARY KEY (program_id, career_id)
);
