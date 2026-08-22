-- 13_academic_calendar.sql
CREATE TABLE IF NOT EXISTS academic_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
  title VARCHAR(255) NOT NULL,
  event_type calendar_event_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  CHECK (end_date IS NULL OR end_date >= start_date)
);
