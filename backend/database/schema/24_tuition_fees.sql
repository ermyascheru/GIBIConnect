-- 24_tuition_fees.sql
CREATE TABLE IF NOT EXISTS tuition_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  program_id UUID REFERENCES programs(id) ON DELETE RESTRICT,
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'ETB',
  period tuition_period NOT NULL,
  additional_fees NUMERIC(12,2) NOT NULL DEFAULT 0,
  effective_date DATE NOT NULL,
  last_verified_at TIMESTAMPTZ,
  source VARCHAR(255),
  CHECK (amount >= 0),
  CHECK (additional_fees >= 0)
);
