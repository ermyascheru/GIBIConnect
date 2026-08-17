-- 07_institution_verification.sql
CREATE TABLE IF NOT EXISTS institution_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID UNIQUE NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  status verification_status NOT NULL DEFAULT 'unverified',
  source VARCHAR(255),
  verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  notes TEXT
);
