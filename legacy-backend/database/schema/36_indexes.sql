-- 36_indexes.sql
-- Indexes for Core Academic, Institutional, AI, and Resource/Research tables.

-- Core Table Indexes
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
CREATE INDEX IF NOT EXISTS institutions_filter_idx ON institutions(type, region, city, ownership);
CREATE INDEX IF NOT EXISTS institutions_published_idx ON institutions(region, city, type) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS institutions_search_idx ON institutions USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS institutions_name_trgm_idx ON institutions USING GIN(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS institutions_slug_trgm_idx ON institutions USING GIN(slug gin_trgm_ops);
CREATE INDEX IF NOT EXISTS verification_next_review_idx ON institution_verification(next_review_at);
CREATE INDEX IF NOT EXISTS faculties_institution_idx ON faculties(institution_id);
CREATE INDEX IF NOT EXISTS departments_faculty_idx ON departments(faculty_id);
CREATE INDEX IF NOT EXISTS programs_institution_degree_idx ON programs(institution_id, degree_level);
CREATE INDEX IF NOT EXISTS programs_published_idx ON programs(institution_id, degree_level) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS programs_search_idx ON programs USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS programs_name_trgm_idx ON programs USING GIN(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS programs_slug_trgm_idx ON programs USING GIN(slug gin_trgm_ops);
CREATE INDEX IF NOT EXISTS admissions_institution_degree_idx ON admissions(institution_id, degree_level);
CREATE INDEX IF NOT EXISTS tuition_institution_program_idx ON tuition_fees(institution_id, program_id);
CREATE INDEX IF NOT EXISTS scholarship_institution_reverse_idx ON institution_scholarships(scholarship_id);
CREATE INDEX IF NOT EXISTS facilities_institution_type_idx ON facilities(institution_id, type);
CREATE INDEX IF NOT EXISTS reviews_institution_status_idx ON reviews(institution_id, status);
CREATE INDEX IF NOT EXISTS news_institution_published_idx ON institution_news(institution_id, published_at DESC);
CREATE INDEX IF NOT EXISTS calendar_institution_start_idx ON academic_calendar(institution_id, start_date);
CREATE INDEX IF NOT EXISTS program_careers_career_idx ON program_careers(career_id);
CREATE INDEX IF NOT EXISTS conversations_user_recent_idx ON ai_conversations(user_id, updated_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS conversations_institution_recent_idx ON ai_conversations(institution_context_id, updated_at DESC) WHERE institution_context_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS messages_conversation_created_idx ON ai_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS audit_entity_created_idx ON audit_logs(entity_type, entity_id, created_at);

-- Resource & Research Indexes
CREATE INDEX IF NOT EXISTS resources_institution_idx ON resources(institution_id);
CREATE INDEX IF NOT EXISTS resources_faculty_idx ON resources(faculty_id);
CREATE INDEX IF NOT EXISTS resources_department_idx ON resources(department_id);
CREATE INDEX IF NOT EXISTS resources_program_idx ON resources(program_id);
CREATE INDEX IF NOT EXISTS resources_uploaded_by_idx ON resources(uploaded_by);
CREATE INDEX IF NOT EXISTS resources_filter_idx ON resources(resource_type, status, visibility);
CREATE INDEX IF NOT EXISTS resources_approved_idx ON resources(institution_id, resource_type) WHERE status = 'approved' AND visibility = 'public';
CREATE INDEX IF NOT EXISTS resources_pub_year_idx ON resources(publication_year DESC);
CREATE INDEX IF NOT EXISTS resources_search_idx ON resources USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS resources_title_trgm_idx ON resources USING GIN(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS resources_filename_trgm_idx ON resources USING GIN(original_filename gin_trgm_ops);

CREATE INDEX IF NOT EXISTS research_resource_idx ON research(resource_id);
CREATE INDEX IF NOT EXISTS research_type_idx ON research(research_type);
CREATE INDEX IF NOT EXISTS research_pub_date_idx ON research(publication_date DESC);
CREATE INDEX IF NOT EXISTS research_doi_idx ON research(doi) WHERE doi IS NOT NULL;
CREATE INDEX IF NOT EXISTS research_search_idx ON research USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS research_journal_trgm_idx ON research USING GIN(journal_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS authors_user_idx ON authors(user_id);
CREATE INDEX IF NOT EXISTS authors_name_trgm_idx ON authors USING GIN(full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS research_authors_author_idx ON research_authors(author_id);

CREATE INDEX IF NOT EXISTS resource_categories_category_idx ON resource_categories(category_id);
CREATE INDEX IF NOT EXISTS resource_tags_tag_idx ON resource_tags(tag_id);
CREATE INDEX IF NOT EXISTS resource_bookmarks_user_idx ON resource_bookmarks(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS resource_views_resource_idx ON resource_views(resource_id, created_at DESC);
CREATE INDEX IF NOT EXISTS resource_downloads_resource_idx ON resource_downloads(resource_id, created_at DESC);
CREATE INDEX IF NOT EXISTS resource_reports_resource_idx ON resource_reports(resource_id, status);
