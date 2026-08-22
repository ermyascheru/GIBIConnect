-- 29_resource_categories.sql
CREATE TABLE IF NOT EXISTS resource_categories (
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (resource_id, category_id)
);
