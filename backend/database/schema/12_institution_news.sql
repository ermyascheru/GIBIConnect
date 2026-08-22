-- 12_institution_news.sql
CREATE TABLE IF NOT EXISTS institution_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  published_at TIMESTAMPTZ,
  source_url TEXT,
  status news_status NOT NULL DEFAULT 'draft'
);
