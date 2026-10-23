-- 02_institutions.sql
CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  history TEXT,
  type institution_type NOT NULL,
  ownership institution_ownership NOT NULL,
  logo_url TEXT,
  cover_image_url TEXT,
  website_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  address VARCHAR(255),
  city VARCHAR(120) NOT NULL,
  region VARCHAR(120) NOT NULL,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  accreditation VARCHAR(255),
  status institution_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,'') || ' ' || coalesce(history,''))
  ) STORED,
  CHECK (latitude BETWEEN -90 AND 90),
  CHECK (longitude BETWEEN -180 AND 180)
);
