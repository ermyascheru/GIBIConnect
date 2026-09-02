-- Admin Dashboard Database Schema
-- Run this migration to set up the admin dashboard tables

BEGIN;

-- Admin Files Table
CREATE TABLE IF NOT EXISTS admin_files (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  size BIGINT,
  file_path VARCHAR(500) NOT NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Activity Log Table
CREATE TABLE IF NOT EXISTS admin_activity (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Backups Table
CREATE TABLE IF NOT EXISTS admin_backups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP,
  file_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Settings Table
CREATE TABLE IF NOT EXISTS admin_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_files_uploaded_by ON admin_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_admin_files_uploaded_at ON admin_files(uploaded_at);
CREATE INDEX IF NOT EXISTS idx_admin_activity_user_id ON admin_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_timestamp ON admin_activity(timestamp);
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(key);

-- Insert default settings
INSERT INTO admin_settings (key, value) VALUES 
  ('appName', 'GIBIConnect'),
  ('environment', 'development'),
  ('enableMFA', 'false'),
  ('enableAudit', 'true')
ON CONFLICT (key) DO NOTHING;

COMMIT;
