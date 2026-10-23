-- GIBIConnect Comprehensive Verification Suite
-- Validates Core System + Resource & Research Subsystems
\echo '======================================================'
\echo ' 1. VERIFYING ALL 35 PUBLIC TABLES'
\echo '======================================================'
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

\echo '======================================================'
\echo ' 2. TABLE ROW COUNTS'
\echo '======================================================'
SELECT table_name, (xpath('/row/cnt/text()', xml_count))[1]::text::int AS row_count
FROM (
  SELECT table_name, query_to_xml(format('SELECT count(*) AS cnt FROM %I', table_name), false, true, '') AS xml_count
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
) t ORDER BY table_name;

\echo '======================================================'
\echo ' 3. ENUM DATA TYPES'
\echo '======================================================'
SELECT typname 
FROM pg_type t 
JOIN pg_namespace n ON n.oid = t.typnamespace 
WHERE n.nspname = 'public' AND t.typtype = 'e' 
ORDER BY typname;

\echo '======================================================'
\echo ' 4. RESOURCE TYPES & SUPPORTED EXTENSIONS'
\echo '======================================================'
SELECT resource_type, file_extension, mime_type, count(*) AS count
FROM resources
GROUP BY resource_type, file_extension, mime_type
ORDER BY resource_type, file_extension;

\echo '======================================================'
\echo ' 5. FULL-TEXT SEARCH: "Machine Learning"'
\echo '======================================================'
SELECT id, title, resource_type, ts_rank_cd(search_vector, websearch_to_tsquery('english', 'machine learning')) AS rank
FROM resources
WHERE search_vector @@ websearch_to_tsquery('english', 'machine learning')
ORDER BY rank DESC;

\echo '======================================================'
\echo ' 6. FULL-TEXT SEARCH: "Amharic NLP Transformer"'
\echo '======================================================'
SELECT r.title, res.journal_name, res.doi, ts_rank_cd(res.search_vector, websearch_to_tsquery('english', 'amharic nlp transformer')) AS rank
FROM research res
JOIN resources r ON r.id = res.resource_id
WHERE res.search_vector @@ websearch_to_tsquery('english', 'amharic nlp transformer')
ORDER BY rank DESC;

\echo '======================================================'
\echo ' 7. TRIGRAM FUZZY SEARCH: "machne lerning" & "Introduction to Machne Learning"'
\echo '======================================================'
SELECT title, word_similarity('machne lerning', title) AS word_sim_score, similarity(title, 'Introduction to Machne Learning') AS title_sim_score
FROM resources
WHERE 'machne lerning' <% title OR title % 'Introduction to Machne Learning'
ORDER BY word_sim_score DESC;

\echo '======================================================'
\echo ' 8. RESEARCH WITH AUTHORS & INSTITUTIONS'
\echo '======================================================'
SELECT 
  r.title,
  i.name AS institution,
  res.research_type,
  res.publication_year,
  string_agg(a.full_name || ' (' || CASE WHEN ra.is_corresponding THEN 'Corresponding' ELSE 'Co-Author' END || ')', ', ' ORDER BY ra.author_order) AS authors
FROM research res
JOIN resources r ON r.id = res.resource_id
LEFT JOIN institutions i ON i.id = r.institution_id
JOIN research_authors ra ON ra.research_id = res.id
JOIN authors a ON a.id = ra.author_id
GROUP BY r.title, i.name, res.research_type, res.publication_year;

\echo '======================================================'
\echo ' 9. FACETED FILTER: Approved Public Resources at AAU'
\echo '======================================================'
SELECT r.title, r.resource_type, r.file_extension, c.name AS category
FROM resources r
JOIN institutions i ON i.id = r.institution_id
LEFT JOIN resource_categories rc ON rc.resource_id = r.id
LEFT JOIN categories c ON c.id = rc.category_id
WHERE i.slug = 'addis-ababa-university'
  AND r.status = 'approved'
  AND r.visibility = 'public'
ORDER BY r.title;

\echo '======================================================'
\echo ' 10. CONSTRAINT CHECK: Duplicate Bookmarks (Expected Failure)'
\echo '======================================================'
DO $$
BEGIN
  -- Attempt duplicate bookmark
  INSERT INTO resource_bookmarks (user_id, resource_id) 
  VALUES ('90000000-0000-4000-8000-000000000002', '70000000-0000-4000-8000-000000000001');
  RAISE EXCEPTION 'Constraint check failed: duplicate bookmark was allowed!';
EXCEPTION WHEN unique_violation THEN
  RAISE NOTICE 'SUCCESS: Duplicate bookmark correctly rejected by primary key constraint.';
END $$;

\echo '======================================================'
\echo ' 11. CONSTRAINT CHECK: Invalid Extension (Expected Failure)'
\echo '======================================================'
DO $$
BEGIN
  -- Attempt unsupported extension (e.g. .exe)
  INSERT INTO resources (
    title, resource_type, mime_type, file_extension, original_filename,
    file_size_bytes, storage_key
  ) VALUES (
    'Malicious Binary', 'document', 'application/x-msdownload', 'exe',
    'virus.exe', 1024, 'dev/resources/malicious.exe'
  );
  RAISE EXCEPTION 'Constraint check failed: unsupported extension was allowed!';
EXCEPTION WHEN check_violation THEN
  RAISE NOTICE 'SUCCESS: Invalid extension (.exe) correctly rejected by CHECK constraint.';
END $$;

\echo '======================================================'
\echo ' 12. GIBICONNECT BASELINE INTEGRITY VERIFICATION'
\echo '======================================================'
SELECT 
  (SELECT count(*) FROM institutions) AS institutions_count,
  (SELECT count(*) FROM faculties) AS faculties_count,
  (SELECT count(*) FROM departments) AS departments_count,
  (SELECT count(*) FROM programs) AS programs_count,
  (SELECT count(*) FROM resources) AS resources_count,
  (SELECT count(*) FROM research) AS research_count,
  (SELECT count(*) FROM authors) AS authors_count,
  (SELECT count(*) FROM categories) AS categories_count,
  (SELECT count(*) FROM tags) AS tags_count;

\echo '======================================================'
\echo ' ALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY'
\echo '======================================================'
