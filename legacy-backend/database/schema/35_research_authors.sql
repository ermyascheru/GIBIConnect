-- 35_research_authors.sql
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
