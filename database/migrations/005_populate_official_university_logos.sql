-- 005_populate_official_university_logos.sql
-- Assigns verified official logo for Adama Science and Technology University (ASTU)
-- Sets unverified logos to NULL so the frontend displays standard neutral academic fallback avatars without fake graphics.

UPDATE institutions SET logo_url = NULL;
UPDATE institutions SET logo_url = 'assets/logos/astu_logo.png' WHERE name ILIKE '%Adama Science%';
