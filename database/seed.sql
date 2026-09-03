-- GIBIConnect Development & Demonstration Seed Data
-- Expanded 2026-08-21: institutions, faculties, departments, programs,
-- admissions, tuition, scholarships, facilities, calendar, careers,
-- users, categories/tags, authors, resources, research, and AI test
-- conversations added on top of the original seed (IDs preserved).
-- All ENUM values, VARCHAR limits, CHECK constraints, and UNIQUE
-- constraints below were validated against the actual GIBIConnect
-- schema (00_prerequisites.sql .. 37_triggers.sql).
BEGIN;

-- 1. Core Institutions
INSERT INTO institutions (id,name,slug,description,type,ownership,website_url,city,region,status) VALUES
('00000000-0000-4000-8000-000000000001','Addis Ababa University','addis-ababa-university','Public research university in Ethiopia.','university','public','https://www.aau.edu.et','Addis Ababa','Addis Ababa','published'),
('00000000-0000-4000-8000-000000000002','Bahir Dar University','bahir-dar-university','Public university in Bahir Dar.','university','public','https://www.bdu.edu.et','Bahir Dar','Amhara','published'),
('00000000-0000-4000-8000-000000000003','University of Gondar','university-of-gondar','Public university in Gondar.','university','public','https://www.uog.edu.et','Gondar','Amhara','published'),
('00000000-0000-4000-8000-000000000004','Jimma University','jimma-university','Public university in Jimma.','university','public','https://www.ju.edu.et','Jimma','Oromia','published'),
('00000000-0000-4000-8000-000000000005','Hawassa University','hawassa-university','Public university in Hawassa.','university','public','https://www.hu.edu.et','Hawassa','Sidama','published'),
('00000000-0000-4000-8000-000000000006','Mekelle University','mekelle-university','Public university in Mekelle.','university','public','https://www.mu.edu.et','Mekelle','Tigray','published'),
('00000000-0000-4000-8000-000000000007','Arba Minch University','arba-minch-university','Public university in Arba Minch.','university','public','https://www.amu.edu.et','Arba Minch','South Ethiopia','published'),
('00000000-0000-4000-8000-000000000008','Adama Science and Technology University','adama-science-and-technology-university','Public science and technology university.','university','public','https://www.astu.edu.et','Adama','Oromia','published'),
('00000000-0000-4000-8000-000000000009','St. Mary''s University','st-marys-university','Private higher education institution.','university','private','https://www.smuc.edu.et','Addis Ababa','Addis Ababa','published'),
('00000000-0000-4000-8000-000000000010','Addis Ababa Medical and Business College','addis-ababa-medical-and-business-college','Private higher education institution.','college','private',NULL,'Addis Ababa','Addis Ababa','published')
ON CONFLICT (id) DO NOTHING;

-- 2. Institution Verification
INSERT INTO institution_verification (institution_id,status,source,verified_at)
SELECT id, 'pending', 'development seed', now() FROM institutions
ON CONFLICT (institution_id) DO NOTHING;

-- 3. Faculties
INSERT INTO faculties (id,institution_id,name,description) VALUES
('10000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001','College of Natural and Computational Sciences','Demo faculty'),
('10000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000002','Faculty of Computing','Demo faculty')
ON CONFLICT (id) DO NOTHING;

-- 4. Departments
INSERT INTO departments (id,faculty_id,name,description) VALUES
('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Computer Science','Demo department'),
('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','Software Engineering','Demo department')
ON CONFLICT (id) DO NOTHING;

-- 5. Programs
INSERT INTO programs (id,institution_id,department_id,name,slug,degree_level,duration,study_mode,description,admission_requirements,status) VALUES
('30000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','Bachelor of Science in Computer Science','aau-bsc-computer-science','bachelor','4 years','full_time','Demo computer science program.','National admission requirements apply.','published'),
('30000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000002','Bachelor of Science in Software Engineering','bdu-bsc-software-engineering','bachelor','4 years','full_time','Demo software engineering program.','National admission requirements apply.','published')
ON CONFLICT (id) DO NOTHING;

-- 6. Admissions
INSERT INTO admissions (institution_id,program_id,degree_level,requirements,documents,application_process,application_start,application_end) VALUES
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001','bachelor','Ethiopian university entrance qualification.','Academic records and identification.','Apply through the official process.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000002','bachelor','Ethiopian university entrance qualification.','Academic records and identification.','Apply through the official process.','2026-06-01','2026-08-31')
ON CONFLICT DO NOTHING;

-- 7. Tuition Fees
INSERT INTO tuition_fees (institution_id,program_id,amount,period,effective_date,source) VALUES
('00000000-0000-4000-8000-000000000009',NULL,24000,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000010',NULL,30000,'per_year','2026-01-01','development estimate')
ON CONFLICT DO NOTHING;

-- 8. Scholarships
INSERT INTO scholarships (id,name,slug,description,eligibility,funding,status) VALUES
('40000000-0000-4000-8000-000000000001','GIBI Merit Scholarship','gibi-merit-scholarship','Development scholarship record.','Merit-based; verify criteria.','Partial tuition support','published'),
('40000000-0000-4000-8000-000000000002','STEM Access Scholarship','stem-access-scholarship','Development scholarship record.','STEM applicants; verify criteria.','Tuition contribution','published')
ON CONFLICT (id) DO NOTHING;

-- 9. Institution Scholarships
INSERT INTO institution_scholarships VALUES
('00000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001'),
('00000000-0000-4000-8000-000000000002','40000000-0000-4000-8000-000000000002')
ON CONFLICT DO NOTHING;

-- 10. Facilities
INSERT INTO facilities (institution_id,name,type,description) VALUES
('00000000-0000-4000-8000-000000000001','Main Library','library','Development facility record.'),
('00000000-0000-4000-8000-000000000001','Computer Laboratory','computer_lab','Development facility record.'),
('00000000-0000-4000-8000-000000000002','Engineering Laboratory','laboratory','Development facility record.')
ON CONFLICT DO NOTHING;

-- 11. Academic Calendar
INSERT INTO academic_calendar (institution_id,title,event_type,start_date,end_date,description) VALUES
('00000000-0000-4000-8000-000000000001','First semester registration','registration','2026-09-01','2026-09-10','Development calendar entry.'),
('00000000-0000-4000-8000-000000000002','First semester begins','semester_start','2026-09-15',NULL,'Development calendar entry.')
ON CONFLICT DO NOTHING;

-- 12. Careers & Program Careers
INSERT INTO careers (id,name,slug,description) VALUES
('50000000-0000-4000-8000-000000000001','Software Developer','software-developer','Builds and maintains software.'),
('50000000-0000-4000-8000-000000000002','Data Analyst','data-analyst','Analyzes data for decisions.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO program_careers VALUES
('30000000-0000-4000-8000-000000000001','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000001','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000002','50000000-0000-4000-8000-000000000001')
ON CONFLICT DO NOTHING;

-- 13. Users (Demo Accounts)
INSERT INTO users (id, email, password_hash, full_name, role, status) VALUES
('90000000-0000-4000-8000-000000000001', 'admin@gibiconnect.edu.et', '$2a$12$e8Y5t1o5e9f8A5y.demoHashForAdminGibiConnect2026', 'Dr. Ermias Girma', 'admin', 'active'),
('90000000-0000-4000-8000-000000000002', 'abebe.bikila@aau.edu.et', '$2a$12$e8Y5t1o5e9f8A5y.demoHashForStudentAbebeAAU2026', 'Abebe Bikila', 'user', 'active'),
('90000000-0000-4000-8000-000000000003', 'sara.hailu@bdu.edu.et', '$2a$12$e8Y5t1o5e9f8A5y.demoHashForResearcherSaraBDU26', 'Dr. Sara Hailu', 'moderator', 'active')
ON CONFLICT (id) DO NOTHING;

-- 14. Categories
INSERT INTO categories (id, name, slug, description) VALUES
('ca000000-0000-4000-8000-000000000001', 'Computer Science & Informatics', 'computer-science-informatics', 'Core computing, artificial intelligence, data structures, and theory.'),
('ca000000-0000-4000-8000-000000000002', 'Software Engineering & DevOps', 'software-engineering-devops', 'Software architecture, agile development, testing, and infrastructure.'),
('ca000000-0000-4000-8000-000000000003', 'Engineering & Technology', 'engineering-technology', 'Electrical, mechanical, civil, and renewable energy engineering.'),
('ca000000-0000-4000-8000-000000000004', 'Medicine & Health Sciences', 'medicine-health-sciences', 'Clinical medicine, public health, pharmacy, and nursing.'),
('ca000000-0000-4000-8000-000000000005', 'Agriculture & Environmental Science', 'agriculture-environmental-science', 'Crop science, soil management, forestry, and sustainable development.')
ON CONFLICT (id) DO NOTHING;

-- 15. Tags
INSERT INTO tags (id, name, slug) VALUES
('ba000000-0000-4000-8000-000000000001', 'Machine Learning', 'machine-learning'),
('ba000000-0000-4000-8000-000000000002', 'Artificial Intelligence', 'artificial-intelligence'),
('ba000000-0000-4000-8000-000000000003', 'Lecture Notes', 'lecture-notes'),
('ba000000-0000-4000-8000-000000000004', 'Master Thesis', 'master-thesis'),
('ba000000-0000-4000-8000-000000000005', 'PhD Dissertation', 'phd-dissertation'),
('ba000000-0000-4000-8000-000000000006', 'Conference Paper', 'conference-paper'),
('ba000000-0000-4000-8000-000000000007', 'Curriculum 2026', 'curriculum-2026'),
('ba000000-0000-4000-8000-000000000008', 'Ethiopian Education', 'ethiopian-education')
ON CONFLICT (id) DO NOTHING;

-- 16. Authors
INSERT INTO authors (id, user_id, full_name, email, affiliation, orcid) VALUES
('aa000000-0000-4000-8000-000000000001', '90000000-0000-4000-8000-000000000001', 'Dr. Ermias Girma', 'admin@gibiconnect.edu.et', 'Addis Ababa University, Department of Computer Science', '0000-0002-1825-0097'),
('aa000000-0000-4000-8000-000000000002', '90000000-0000-4000-8000-000000000003', 'Dr. Sara Hailu', 'sara.hailu@bdu.edu.et', 'Bahir Dar University, Faculty of Computing', '0000-0003-4921-8812'),
('aa000000-0000-4000-8000-000000000003', NULL, 'Prof. Kebede Tadesse', 'kebede.tadesse@aau.edu.et', 'Addis Ababa University, Natural and Computational Sciences', '0000-0001-9023-4411'),
('aa000000-0000-4000-8000-000000000004', NULL, 'Dr. Almaz Tefera', 'almaz.tefera@astu.edu.et', 'Adama Science and Technology University', '0000-0002-7712-3309')
ON CONFLICT (id) DO NOTHING;

-- 17. Resources (Covering PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, EPUB, MP4, WebM, MOV, MP3, WAV, M4A, Research)
INSERT INTO resources (
  id, title, description, resource_type, mime_type, file_extension,
  original_filename, file_size_bytes, storage_provider, storage_bucket, storage_key,
  checksum, uploaded_by, institution_id, faculty_id, department_id, program_id,
  publication_year, language, status, visibility, extracted_text, transcript,
  processing_status
) VALUES
-- R1: PDF (Lecture Notes - Computer Science)
(
  '70000000-0000-4000-8000-000000000001',
  'Introduction to Machine Learning Lecture Notes',
  'Comprehensive lecture notes covering supervised learning, linear regression, decision trees, and neural networks for undergraduate computer science.',
  'document', 'application/pdf', 'pdf',
  'cs301_intro_machine_learning_notes.pdf', 3845120, 'local', 'educational-resources', 'dev/resources/aau/cs/cs301_intro_machine_learning_notes.pdf',
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  '90000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001',
  2026, 'en', 'approved', 'public',
  'Lecture 1: Foundations of Machine Learning. Supervised learning algorithms map inputs to continuous or discrete outputs. Gradient descent optimization minimizes cost functions.', NULL,
  'processed'
),
-- R2: DOCX (Project Guidelines - Software Engineering)
(
  '70000000-0000-4000-8000-000000000002',
  'Software Engineering Capstone Project Guidelines 2026',
  'Official department guide and template for final year software engineering capstone design projects, software testing requirements, and architecture diagrams.',
  'document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx',
  'bdu_se_capstone_guidelines_2026.docx', 1245000, 'local', 'educational-resources', 'dev/resources/bdu/se/bdu_se_capstone_guidelines_2026.docx',
  'a2c1d88927fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b123',
  '90000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002',
  2026, 'en', 'approved', 'public',
  'Capstone Guidelines: All projects must follow Agile Scrum methodologies. Deliverables include architecture specification, database relational diagram, automated test suites, and deployment containerization.', NULL,
  'processed'
),
-- R3: XLSX (Higher Education Statistics)
(
  '70000000-0000-4000-8000-000000000003',
  '2026 Ethiopian Higher Education Enrollment and Graduation Dataset',
  'Aggregated multi-sheet spreadsheet dataset providing national university enrollment metrics, STEM gender distribution, and graduate employment tracking.',
  'spreadsheet', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx',
  'ethiopia_higher_education_stats_2026.xlsx', 4892000, 'local', 'educational-resources', 'dev/resources/stats/ethiopia_higher_education_stats_2026.xlsx',
  '99b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b777',
  '90000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001', NULL, NULL, NULL,
  2026, 'en', 'approved', 'public',
  'Table 1: Addis Ababa University, Bahir Dar University, Jimma University total enrollment. Total public university undergraduate admissions 2026: 145,000 students.', NULL,
  'processed'
),
-- R4: PPTX (Distributed Systems Presentation)
(
  '70000000-0000-4000-8000-000000000004',
  'Advanced Distributed Systems and Consensus Presentation Slides',
  'Classroom presentation slides on Paxos, Raft consensus algorithm, vector clocks, CAP theorem, and distributed transaction semantics.',
  'presentation', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'pptx',
  'distributed_systems_consensus_slides.pptx', 9520000, 'local', 'educational-resources', 'dev/resources/aau/cs/distributed_systems_consensus_slides.pptx',
  '81b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b888',
  '90000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001',
  2026, 'en', 'approved', 'public',
  'Slide 1: Distributed Systems. Slide 2: The CAP Theorem - Consistency, Availability, Partition Tolerance. Slide 3: Raft Consensus Leader Election and Log Replication.', NULL,
  'processed'
),
-- R5: EPUB (Handbook)
(
  '70000000-0000-4000-8000-000000000005',
  'Principles of Data Science and Big Data Handbook',
  'Digital textbook and reader ebook covering probability, linear algebra for data science, exploratory data analysis, and scalable pipelines.',
  'ebook', 'application/epub+zip', 'epub',
  'principles_data_science_handbook.epub', 6450000, 'local', 'educational-resources', 'dev/resources/ebooks/principles_data_science_handbook.epub',
  '77b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b999',
  '90000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001', NULL, NULL, NULL,
  2025, 'en', 'approved', 'public',
  'Chapter 1: Foundational Statistics. Chapter 2: Data Wrangling with Python and SQL. Chapter 3: Feature Engineering and Model Evaluation.', NULL,
  'processed'
),
-- R6: MP4 (Video Lecture)
(
  '70000000-0000-4000-8000-000000000006',
  'Video Lecture: Algorithm Design and Asymptotic Analysis',
  'Recorded university lecture demonstrating divide-and-conquer recurrences, Master Theorem, dynamic programming, and graph traversals.',
  'video', 'video/mp4', 'mp4',
  'algo_lecture_asymptotic_analysis.mp4', 185000000, 'local', 'educational-resources', 'dev/resources/bdu/se/algo_lecture_asymptotic_analysis.mp4',
  '66b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b666',
  '90000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002',
  2026, 'en', 'approved', 'public',
  NULL,
  'Speaker: Welcome students. Today we analyze algorithm complexity using Big O, Big Theta, and Big Omega notation. Let us write down the recurrence relation T(n) = 2T(n/2) + O(n).',
  'processed'
),
-- R7: MP3 (Audio Seminar)
(
  '70000000-0000-4000-8000-000000000007',
  'Audio Seminar: Natural Language Processing for Low-Resource African Languages',
  'Panel discussion and academic seminar exploring transformer architectures, morphological analysis, and tokenization for Amharic, Afaan Oromoo, and Tigrinya.',
  'audio', 'audio/mpeg', 'mp3',
  'nlp_african_languages_seminar.mp3', 42000000, 'local', 'educational-resources', 'dev/resources/aau/seminars/nlp_african_languages_seminar.mp3',
  '55b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b555',
  '90000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', NULL,
  2026, 'en', 'approved', 'public',
  NULL,
  'Moderator: Welcome to the Addis Ababa University NLP colloquium. Our panelists discuss pre-trained language models and Ge''ez script tokenization benchmarks.',
  'processed'
),
-- R8: Research Paper (PDF)
(
  '70000000-0000-4000-8000-000000000008',
  'Deep Learning for Amharic Natural Language Processing: A Benchmark Study',
  'Peer-reviewed journal paper establishing comprehensive benchmarks for Amharic sentiment analysis, named entity recognition, and question answering.',
  'research', 'application/pdf', 'pdf',
  'deep_learning_amharic_nlp_benchmark.pdf', 2950000, 'local', 'educational-resources', 'dev/resources/research/deep_learning_amharic_nlp_benchmark.pdf',
  '44b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b444',
  '90000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001',
  2026, 'en', 'approved', 'public',
  'Abstract: We present the first large-scale benchmark evaluation for Amharic NLP. Our fine-tuned models achieve 92.4% accuracy in named entity recognition.', NULL,
  'processed'
),
-- R9: Master's Thesis (PDF)
(
  '70000000-0000-4000-8000-000000000009',
  'Automated Crop Disease Detection Using Convolutional Neural Networks in Ethiopian Agriculture',
  'Master of Science thesis investigating lightweight computer vision architectures for identifying coffee leaf rust and teff blight in smallholder farms.',
  'research', 'application/pdf', 'pdf',
  'crop_disease_cnn_ethiopia_thesis.pdf', 8410000, 'local', 'educational-resources', 'dev/resources/theses/crop_disease_cnn_ethiopia_thesis.pdf',
  '33b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b333',
  '90000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002',
  2025, 'en', 'approved', 'public',
  'Thesis Abstract: Early diagnosis of foliar diseases in coffee and teff is vital to national food security. We develop a mobile-friendly CNN pipeline achieving 94.8% field classification accuracy.', NULL,
  'processed'
),
-- R10: PhD Dissertation (PDF)
(
  '70000000-0000-4000-8000-000000000010',
  'Decentralized Microgrid Optimization for Rural Electrification in East Africa',
  'Doctor of Philosophy dissertation detailing algorithmic optimization models for solar-battery hybrid microgrid deployment in off-grid rural communities.',
  'research', 'application/pdf', 'pdf',
  'microgrid_optimization_rural_dissertation.pdf', 15200000, 'local', 'educational-resources', 'dev/resources/dissertations/microgrid_optimization_rural_dissertation.pdf',
  '22b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b222',
  '90000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', NULL, NULL,
  2026, 'en', 'approved', 'public',
  'Dissertation Abstract: Rural electrification in East Africa demands robust, decentralized dispatch architectures. This work formulates mixed-integer linear programs to optimize storage degradation and solar utilization.', NULL,
  'processed'
),
-- R11: Conference Paper (PDF)
(
  '70000000-0000-4000-8000-000000000011',
  'Scalable Cloud Architecture for Digital Academic Registries in Developing Countries',
  'International conference paper proposing multi-tenant educational database architectures with fault tolerance over intermittent network connectivity.',
  'research', 'application/pdf', 'pdf',
  'cloud_academic_registries_conf_paper.pdf', 2100000, 'local', 'educational-resources', 'dev/resources/conferences/cloud_academic_registries_conf_paper.pdf',
  '11b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b111',
  '90000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001',
  2026, 'en', 'approved', 'public',
  'Conference Abstract: Higher education institutions in emerging economies require resilient registration architectures. We evaluate partitioned relational models and asynchronous sync.', NULL,
  'processed'
),
-- R12: WebM (Video Tutorial)
(
  '70000000-0000-4000-8000-000000000012',
  'Web Development Tutorial: PostgreSQL Indexing and Query Optimization',
  'Technical tutorial demonstrating EXPLAIN ANALYZE, GIN index construction, and full-text search optimization.',
  'video', 'video/webm', 'webm',
  'postgres_indexing_optimization_tutorial.webm', 95000000, 'local', 'educational-resources', 'dev/resources/videos/postgres_indexing_optimization_tutorial.webm',
  '00b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b000',
  '90000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001',
  2026, 'en', 'approved', 'public',
  NULL,
  'Instructor: In this session we examine how GIN and B-Tree indexes change query plans in PostgreSQL 16. Let us inspect the execution timing before and after indexing.',
  'processed'
),
-- R13: WAV (Audio Recording)
(
  '70000000-0000-4000-8000-000000000013',
  'Keynote Address: Ethiopian National Higher Education Research Summit 2026',
  'High-fidelity uncompressed master audio recording of the opening plenary address at the National Higher Education Summit.',
  'audio', 'audio/wav', 'wav',
  'keynote_education_summit_2026.wav', 120000000, 'local', 'educational-resources', 'dev/resources/audio/keynote_education_summit_2026.wav',
  'fa00c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852bfa0',
  '90000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001', NULL, NULL, NULL,
  2026, 'en', 'approved', 'public',
  NULL,
  'Keynote Speaker: Digital platforms, shared open research libraries, and cross-university collaboration will transform Ethiopian academia in this decade.',
  'processed'
),
-- R14: M4A (Audio Podcast)
(
  '70000000-0000-4000-8000-000000000014',
  'Podcast: Academic Accreditation, Quality Assurance, and Curriculum Standards',
  'Educational podcast discussion on institutional accreditation standards, faculty development, and international degree equivalence in Ethiopia.',
  'audio', 'audio/mp4', 'm4a',
  'podcast_academic_accreditation_standards.m4a', 31000000, 'local', 'educational-resources', 'dev/resources/audio/podcast_academic_accreditation_standards.m4a',
  'fb00c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852bfb0',
  '90000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', NULL, NULL,
  2026, 'en', 'approved', 'public',
  NULL,
  'Host: Today we sit down with academic leaders to discuss the criteria for program accreditation across public and private universities in Ethiopia.',
  'processed'
)
ON CONFLICT (id) DO NOTHING;

-- 18. Research Metadata
INSERT INTO research (
  id, resource_id, abstract, research_type, publication_date, publication_year,
  journal_name, conference_name, doi, keywords, language
) VALUES
(
  '80000000-0000-4000-8000-000000000001',
  '70000000-0000-4000-8000-000000000008',
  'We present a comprehensive empirical benchmark of modern deep learning architectures applied to Amharic natural language processing. Using curated corpora from news archives and social discourse, our transformer models achieve state-of-the-art results across text classification, named entity recognition, and question answering.',
  'journal_article', '2026-03-15', 2026,
  'Ethiopian Journal of Science and Computing', NULL, '10.1016/j.ejsc.2026.03.011',
  ARRAY['amharic-nlp', 'deep-learning', 'transformers', 'named-entity-recognition', 'ethiopian-languages'],
  'en'
),
(
  '80000000-0000-4000-8000-000000000002',
  '70000000-0000-4000-8000-000000000009',
  'This master''s thesis investigates the application of convolutional neural networks (CNNs) for real-time mobile diagnosis of foliar diseases in coffee and teff crops in Northern and Western Ethiopia. Field-tested with 12,000 leaf images, the proposed model runs efficiently on edge mobile devices.',
  'thesis', '2025-11-20', 2025,
  NULL, NULL, NULL,
  ARRAY['computer-vision', 'crop-disease', 'agriculture', 'cnn', 'coffee-leaf-rust'],
  'en'
),
(
  '80000000-0000-4000-8000-000000000003',
  '70000000-0000-4000-8000-000000000010',
  'This doctoral dissertation develops a comprehensive mathematical framework and metaheuristic optimization algorithms for autonomous solar photovoltaic and battery storage microgrids. Field validations across rural Ethiopian communities show a 34% cost reduction over traditional diesel generators.',
  'dissertation', '2026-01-10', 2026,
  NULL, NULL, '10.1109/diss.2026.1042',
  ARRAY['microgrids', 'renewable-energy', 'optimization', 'rural-electrification', 'solar-pv'],
  'en'
),
(
  '80000000-0000-4000-8000-000000000004',
  '70000000-0000-4000-8000-000000000011',
  'Higher education institutions in developing regions frequently face severe bandwidth constraints. We propose a lightweight, distributed multi-tenant database synchronization protocol designed for academic student registries, providing resilient offline-first capabilities.',
  'conference_paper', '2026-05-04', 2026,
  NULL, 'IEEE International Conference on Educational Technologies 2026', '10.1109/icet.2026.0094',
  ARRAY['cloud-architecture', 'database-systems', 'offline-first', 'academic-registries'],
  'en'
)
ON CONFLICT (id) DO NOTHING;

-- 19. Research Authors Links
INSERT INTO research_authors (research_id, author_id, author_order, is_corresponding) VALUES
('80000000-0000-4000-8000-000000000001', 'aa000000-0000-4000-8000-000000000001', 1, true),
('80000000-0000-4000-8000-000000000001', 'aa000000-0000-4000-8000-000000000003', 2, false),
('80000000-0000-4000-8000-000000000002', 'aa000000-0000-4000-8000-000000000002', 1, true),
('80000000-0000-4000-8000-000000000003', 'aa000000-0000-4000-8000-000000000004', 1, true),
('80000000-0000-4000-8000-000000000004', 'aa000000-0000-4000-8000-000000000001', 1, true),
('80000000-0000-4000-8000-000000000004', 'aa000000-0000-4000-8000-000000000002', 2, false)
ON CONFLICT DO NOTHING;

-- 20. Resource Categories Links
INSERT INTO resource_categories (resource_id, category_id) VALUES
('70000000-0000-4000-8000-000000000001', 'ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000002', 'ca000000-0000-4000-8000-000000000002'),
('70000000-0000-4000-8000-000000000003', 'ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000004', 'ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000005', 'ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000006', 'ca000000-0000-4000-8000-000000000002'),
('70000000-0000-4000-8000-000000000007', 'ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000008', 'ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000009', 'ca000000-0000-4000-8000-000000000005'),
('70000000-0000-4000-8000-000000000010', 'ca000000-0000-4000-8000-000000000003'),
('70000000-0000-4000-8000-000000000011', 'ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000012', 'ca000000-0000-4000-8000-000000000002'),
('70000000-0000-4000-8000-000000000013', 'ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000014', 'ca000000-0000-4000-8000-000000000001')
ON CONFLICT DO NOTHING;

-- 21. Resource Tags Links
INSERT INTO resource_tags (resource_id, tag_id) VALUES
('70000000-0000-4000-8000-000000000001', 'ba000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000001', 'ba000000-0000-4000-8000-000000000003'),
('70000000-0000-4000-8000-000000000002', 'ba000000-0000-4000-8000-000000000007'),
('70000000-0000-4000-8000-000000000008', 'ba000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000008', 'ba000000-0000-4000-8000-000000000002'),
('70000000-0000-4000-8000-000000000009', 'ba000000-0000-4000-8000-000000000004'),
('70000000-0000-4000-8000-000000000010', 'ba000000-0000-4000-8000-000000000005'),
('70000000-0000-4000-8000-000000000011', 'ba000000-0000-4000-8000-000000000006'),
('70000000-0000-4000-8000-000000000013', 'ba000000-0000-4000-8000-000000000008')
ON CONFLICT DO NOTHING;

-- 22. Resource Bookmarks (User Saves)
INSERT INTO resource_bookmarks (user_id, resource_id) VALUES
('90000000-0000-4000-8000-000000000002', '70000000-0000-4000-8000-000000000001'),
('90000000-0000-4000-8000-000000000002', '70000000-0000-4000-8000-000000000008'),
('90000000-0000-4000-8000-000000000003', '70000000-0000-4000-8000-000000000009')
ON CONFLICT DO NOTHING;

-- 23. Resource Views & Downloads (Analytics)
INSERT INTO resource_views (resource_id, user_id, ip_hash) VALUES
('70000000-0000-4000-8000-000000000001', '90000000-0000-4000-8000-000000000002', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
('70000000-0000-4000-8000-000000000008', '90000000-0000-4000-8000-000000000002', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
('70000000-0000-4000-8000-000000000008', '90000000-0000-4000-8000-000000000003', 'a1b2c3d498fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852ba1b');

INSERT INTO resource_downloads (resource_id, user_id, ip_hash) VALUES
('70000000-0000-4000-8000-000000000001', '90000000-0000-4000-8000-000000000002', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
('70000000-0000-4000-8000-000000000008', '90000000-0000-4000-8000-000000000003', 'a1b2c3d498fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852ba1b');

-- 24. Resource Reports (Moderation Ticket)
INSERT INTO resource_reports (
  id, resource_id, reporter_id, reason, description, status, reviewed_by, reviewed_at, notes
) VALUES
(
  '60000000-0000-4000-8000-000000000001',
  '70000000-0000-4000-8000-000000000003',
  '90000000-0000-4000-8000-000000000002',
  'incorrect_information',
  'Please verify sheet 3 enrollment figures for 2026 freshman batch.',
  'reviewed',
  '90000000-0000-4000-8000-000000000001',
  now(),
  'Verified against official MoE statistics release.'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- EXPANSION SECTION
-- New institutions, faculties, departments, programs,
-- admissions, tuition, scholarships, facilities, calendar,
-- careers, users, categories/tags, authors, resources,
-- research, and resource relationships.
-- ============================================================

-- E1. Additional Institutions
INSERT INTO institutions (id,name,slug,description,type,ownership,website_url,city,region,status) VALUES
('00000000-0000-4000-8000-000000000011','Haramaya University','haramaya-university','Public university in eastern Ethiopia known for agriculture and veterinary medicine.','university','public','https://www.haramaya.edu.et','Haramaya','Oromia','published'),
('00000000-0000-4000-8000-000000000012','Wolaita Sodo University','wolaita-sodo-university','Public university in southern Ethiopia.','university','public','https://www.wsu.edu.et','Sodo','South Ethiopia','published'),
('00000000-0000-4000-8000-000000000013','Debre Berhan University','debre-berhan-university','Public university in Debre Berhan.','university','public','https://www.dbu.edu.et','Debre Berhan','Amhara','published'),
('00000000-0000-4000-8000-000000000014','Debre Markos University','debre-markos-university','Public university in Debre Markos.','university','public','https://www.dmu.edu.et','Debre Markos','Amhara','published'),
('00000000-0000-4000-8000-000000000015','Dire Dawa University','dire-dawa-university','Public university focused on engineering and technology.','university','public','https://www.ddu.edu.et','Dire Dawa','Dire Dawa','published'),
('00000000-0000-4000-8000-000000000016','Dilla University','dilla-university','Public university in Dilla.','university','public','https://www.du.edu.et','Dilla','South Ethiopia','published'),
('00000000-0000-4000-8000-000000000017','Ambo University','ambo-university','Public university in Ambo.','university','public','https://www.ambou.edu.et','Ambo','Oromia','published'),
('00000000-0000-4000-8000-000000000018','Wolkite University','wolkite-university','Public university in Wolkite.','university','public','https://www.wku.edu.et','Wolkite','South Ethiopia','published')
ON CONFLICT (id) DO NOTHING;

-- E2. Verification rows for newly added institutions
INSERT INTO institution_verification (institution_id,status,source,verified_at)
SELECT id, 'pending', 'development seed', now() FROM institutions
WHERE id NOT IN (SELECT institution_id FROM institution_verification)
ON CONFLICT (institution_id) DO NOTHING;

-- E3. Additional Faculties/Schools
INSERT INTO faculties (id,institution_id,name,description) VALUES
('10000000-0000-4000-8000-000000000003','00000000-0000-4000-8000-000000000001','College of Engineering','Engineering education and applied research across major engineering disciplines.'),
('10000000-0000-4000-8000-000000000004','00000000-0000-4000-8000-000000000001','College of Business and Economics','Business, management, and economics education for the Ethiopian labor market.'),
('10000000-0000-4000-8000-000000000005','00000000-0000-4000-8000-000000000001','College of Health Sciences','Clinical and public-health training for Ethiopia''s health workforce.'),
('10000000-0000-4000-8000-000000000006','00000000-0000-4000-8000-000000000001','School of Law','Legal education preparing graduates for the Ethiopian legal system.'),
('10000000-0000-4000-8000-000000000007','00000000-0000-4000-8000-000000000002','College of Engineering','Engineering education and applied research across major engineering disciplines.'),
('10000000-0000-4000-8000-000000000008','00000000-0000-4000-8000-000000000002','College of Business and Economics','Business, management, and economics education for the Ethiopian labor market.'),
('10000000-0000-4000-8000-000000000009','00000000-0000-4000-8000-000000000002','College of Agriculture and Environmental Sciences','Agricultural science, crop production, and natural resource management programs.'),
('10000000-0000-4000-8000-000000000010','00000000-0000-4000-8000-000000000003','College of Health Sciences','Clinical and public-health training for Ethiopia''s health workforce.'),
('10000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000003','College of Natural and Computational Sciences','Undergraduate and graduate programs in the core natural and computational sciences.'),
('10000000-0000-4000-8000-000000000012','00000000-0000-4000-8000-000000000003','College of Business and Economics','Business, management, and economics education for the Ethiopian labor market.'),
('10000000-0000-4000-8000-000000000013','00000000-0000-4000-8000-000000000004','College of Health Sciences','Clinical and public-health training for Ethiopia''s health workforce.'),
('10000000-0000-4000-8000-000000000014','00000000-0000-4000-8000-000000000004','College of Agriculture and Environmental Sciences','Agricultural science, crop production, and natural resource management programs.'),
('10000000-0000-4000-8000-000000000015','00000000-0000-4000-8000-000000000004','College of Natural and Computational Sciences','Undergraduate and graduate programs in the core natural and computational sciences.'),
('10000000-0000-4000-8000-000000000016','00000000-0000-4000-8000-000000000004','College of Business and Economics','Business, management, and economics education for the Ethiopian labor market.'),
('10000000-0000-4000-8000-000000000017','00000000-0000-4000-8000-000000000005','College of Natural and Computational Sciences','Undergraduate and graduate programs in the core natural and computational sciences.'),
('10000000-0000-4000-8000-000000000018','00000000-0000-4000-8000-000000000005','College of Agriculture and Environmental Sciences','Agricultural science, crop production, and natural resource management programs.'),
('10000000-0000-4000-8000-000000000019','00000000-0000-4000-8000-000000000005','College of Business and Economics','Business, management, and economics education for the Ethiopian labor market.'),
('10000000-0000-4000-8000-000000000020','00000000-0000-4000-8000-000000000006','College of Engineering','Engineering education and applied research across major engineering disciplines.'),
('10000000-0000-4000-8000-000000000021','00000000-0000-4000-8000-000000000006','College of Business and Economics','Business, management, and economics education for the Ethiopian labor market.'),
('10000000-0000-4000-8000-000000000022','00000000-0000-4000-8000-000000000006','College of Natural and Computational Sciences','Undergraduate and graduate programs in the core natural and computational sciences.'),
('10000000-0000-4000-8000-000000000023','00000000-0000-4000-8000-000000000007','College of Engineering','Engineering education and applied research across major engineering disciplines.'),
('10000000-0000-4000-8000-000000000024','00000000-0000-4000-8000-000000000007','College of Natural and Computational Sciences','Undergraduate and graduate programs in the core natural and computational sciences.'),
('10000000-0000-4000-8000-000000000025','00000000-0000-4000-8000-000000000008','School of Computing and Informatics','Dedicated computing school covering software, data, and information systems.'),
('10000000-0000-4000-8000-000000000026','00000000-0000-4000-8000-000000000008','College of Engineering','Engineering education and applied research across major engineering disciplines.'),
('10000000-0000-4000-8000-000000000027','00000000-0000-4000-8000-000000000009','College of Business and Economics','Business, management, and economics education for the Ethiopian labor market.'),
('10000000-0000-4000-8000-000000000028','00000000-0000-4000-8000-000000000009','School of Computing and Informatics','Dedicated computing school covering software, data, and information systems.'),
('10000000-0000-4000-8000-000000000029','00000000-0000-4000-8000-000000000010','College of Health Sciences','Clinical and public-health training for Ethiopia''s health workforce.'),
('10000000-0000-4000-8000-000000000030','00000000-0000-4000-8000-000000000010','College of Business and Economics','Business, management, and economics education for the Ethiopian labor market.'),
('10000000-0000-4000-8000-000000000031','00000000-0000-4000-8000-000000000011','College of Agriculture and Environmental Sciences','Agricultural science, crop production, and natural resource management programs.'),
('10000000-0000-4000-8000-000000000032','00000000-0000-4000-8000-000000000011','College of Natural and Computational Sciences','Undergraduate and graduate programs in the core natural and computational sciences.'),
('10000000-0000-4000-8000-000000000033','00000000-0000-4000-8000-000000000011','College of Business and Economics','Business, management, and economics education for the Ethiopian labor market.'),
('10000000-0000-4000-8000-000000000034','00000000-0000-4000-8000-000000000012','College of Natural and Computational Sciences','Undergraduate and graduate programs in the core natural and computational sciences.'),
('10000000-0000-4000-8000-000000000035','00000000-0000-4000-8000-000000000012','College of Business and Economics','Business, management, and economics education for the Ethiopian labor market.'),
('10000000-0000-4000-8000-000000000036','00000000-0000-4000-8000-000000000013','College of Natural and Computational Sciences','Undergraduate and graduate programs in the core natural and computational sciences.'),
('10000000-0000-4000-8000-000000000037','00000000-0000-4000-8000-000000000013','College of Business and Economics','Business, management, and economics education for the Ethiopian labor market.'),
('10000000-0000-4000-8000-000000000038','00000000-0000-4000-8000-000000000014','College of Natural and Computational Sciences','Undergraduate and graduate programs in the core natural and computational sciences.'),
('10000000-0000-4000-8000-000000000039','00000000-0000-4000-8000-000000000014','College of Agriculture and Environmental Sciences','Agricultural science, crop production, and natural resource management programs.'),
('10000000-0000-4000-8000-000000000040','00000000-0000-4000-8000-000000000015','College of Engineering','Engineering education and applied research across major engineering disciplines.'),
('10000000-0000-4000-8000-000000000041','00000000-0000-4000-8000-000000000015','School of Computing and Informatics','Dedicated computing school covering software, data, and information systems.'),
('10000000-0000-4000-8000-000000000042','00000000-0000-4000-8000-000000000016','College of Natural and Computational Sciences','Undergraduate and graduate programs in the core natural and computational sciences.'),
('10000000-0000-4000-8000-000000000043','00000000-0000-4000-8000-000000000016','College of Business and Economics','Business, management, and economics education for the Ethiopian labor market.'),
('10000000-0000-4000-8000-000000000044','00000000-0000-4000-8000-000000000017','College of Agriculture and Environmental Sciences','Agricultural science, crop production, and natural resource management programs.'),
('10000000-0000-4000-8000-000000000045','00000000-0000-4000-8000-000000000017','College of Natural and Computational Sciences','Undergraduate and graduate programs in the core natural and computational sciences.'),
('10000000-0000-4000-8000-000000000046','00000000-0000-4000-8000-000000000018','College of Natural and Computational Sciences','Undergraduate and graduate programs in the core natural and computational sciences.'),
('10000000-0000-4000-8000-000000000047','00000000-0000-4000-8000-000000000018','College of Business and Economics','Business, management, and economics education for the Ethiopian labor market.')
ON CONFLICT (id) DO NOTHING;

-- E4. Additional Departments
INSERT INTO departments (id,faculty_id,name,description) VALUES
('20000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000001','Mathematics','Department of Mathematics at Addis Ababa University.'),
('20000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000001','Physics','Department of Physics at Addis Ababa University.'),
('20000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000003','Civil Engineering','Department of Civil Engineering at Addis Ababa University.'),
('20000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000003','Electrical Engineering','Department of Electrical Engineering at Addis Ababa University.'),
('20000000-0000-4000-8000-000000000007','10000000-0000-4000-8000-000000000004','Accounting','Department of Accounting at Addis Ababa University.'),
('20000000-0000-4000-8000-000000000008','10000000-0000-4000-8000-000000000004','Management','Department of Management at Addis Ababa University.'),
('20000000-0000-4000-8000-000000000009','10000000-0000-4000-8000-000000000005','Medicine','Department of Medicine at Addis Ababa University.'),
('20000000-0000-4000-8000-000000000010','10000000-0000-4000-8000-000000000005','Nursing','Department of Nursing at Addis Ababa University.'),
('20000000-0000-4000-8000-000000000011','10000000-0000-4000-8000-000000000006','Law','Department of Law at Addis Ababa University.'),
('20000000-0000-4000-8000-000000000012','10000000-0000-4000-8000-000000000002','Computer Science','Department of Computer Science at Bahir Dar University.'),
('20000000-0000-4000-8000-000000000013','10000000-0000-4000-8000-000000000002','Information Technology','Department of Information Technology at Bahir Dar University.'),
('20000000-0000-4000-8000-000000000014','10000000-0000-4000-8000-000000000007','Civil Engineering','Department of Civil Engineering at Bahir Dar University.'),
('20000000-0000-4000-8000-000000000015','10000000-0000-4000-8000-000000000007','Electrical Engineering','Department of Electrical Engineering at Bahir Dar University.'),
('20000000-0000-4000-8000-000000000016','10000000-0000-4000-8000-000000000008','Accounting','Department of Accounting at Bahir Dar University.'),
('20000000-0000-4000-8000-000000000017','10000000-0000-4000-8000-000000000008','Management','Department of Management at Bahir Dar University.'),
('20000000-0000-4000-8000-000000000018','10000000-0000-4000-8000-000000000009','Plant Science','Department of Plant Science at Bahir Dar University.'),
('20000000-0000-4000-8000-000000000019','10000000-0000-4000-8000-000000000009','Animal Science','Department of Animal Science at Bahir Dar University.'),
('20000000-0000-4000-8000-000000000020','10000000-0000-4000-8000-000000000010','Medicine','Department of Medicine at University of Gondar.'),
('20000000-0000-4000-8000-000000000021','10000000-0000-4000-8000-000000000010','Nursing','Department of Nursing at University of Gondar.'),
('20000000-0000-4000-8000-000000000022','10000000-0000-4000-8000-000000000011','Computer Science','Department of Computer Science at University of Gondar.'),
('20000000-0000-4000-8000-000000000023','10000000-0000-4000-8000-000000000011','Mathematics','Department of Mathematics at University of Gondar.'),
('20000000-0000-4000-8000-000000000024','10000000-0000-4000-8000-000000000011','Statistics','Department of Statistics at University of Gondar.'),
('20000000-0000-4000-8000-000000000025','10000000-0000-4000-8000-000000000012','Accounting','Department of Accounting at University of Gondar.'),
('20000000-0000-4000-8000-000000000026','10000000-0000-4000-8000-000000000012','Management','Department of Management at University of Gondar.'),
('20000000-0000-4000-8000-000000000027','10000000-0000-4000-8000-000000000013','Medicine','Department of Medicine at Jimma University.'),
('20000000-0000-4000-8000-000000000028','10000000-0000-4000-8000-000000000013','Nursing','Department of Nursing at Jimma University.'),
('20000000-0000-4000-8000-000000000029','10000000-0000-4000-8000-000000000014','Plant Science','Department of Plant Science at Jimma University.'),
('20000000-0000-4000-8000-000000000030','10000000-0000-4000-8000-000000000014','Animal Science','Department of Animal Science at Jimma University.'),
('20000000-0000-4000-8000-000000000031','10000000-0000-4000-8000-000000000015','Computer Science','Department of Computer Science at Jimma University.'),
('20000000-0000-4000-8000-000000000032','10000000-0000-4000-8000-000000000015','Mathematics','Department of Mathematics at Jimma University.'),
('20000000-0000-4000-8000-000000000033','10000000-0000-4000-8000-000000000015','Statistics','Department of Statistics at Jimma University.'),
('20000000-0000-4000-8000-000000000034','10000000-0000-4000-8000-000000000016','Accounting','Department of Accounting at Jimma University.'),
('20000000-0000-4000-8000-000000000035','10000000-0000-4000-8000-000000000016','Management','Department of Management at Jimma University.'),
('20000000-0000-4000-8000-000000000036','10000000-0000-4000-8000-000000000017','Computer Science','Department of Computer Science at Hawassa University.'),
('20000000-0000-4000-8000-000000000037','10000000-0000-4000-8000-000000000017','Mathematics','Department of Mathematics at Hawassa University.'),
('20000000-0000-4000-8000-000000000038','10000000-0000-4000-8000-000000000017','Statistics','Department of Statistics at Hawassa University.'),
('20000000-0000-4000-8000-000000000039','10000000-0000-4000-8000-000000000018','Plant Science','Department of Plant Science at Hawassa University.'),
('20000000-0000-4000-8000-000000000040','10000000-0000-4000-8000-000000000018','Animal Science','Department of Animal Science at Hawassa University.'),
('20000000-0000-4000-8000-000000000041','10000000-0000-4000-8000-000000000019','Accounting','Department of Accounting at Hawassa University.'),
('20000000-0000-4000-8000-000000000042','10000000-0000-4000-8000-000000000019','Management','Department of Management at Hawassa University.'),
('20000000-0000-4000-8000-000000000043','10000000-0000-4000-8000-000000000020','Civil Engineering','Department of Civil Engineering at Mekelle University.'),
('20000000-0000-4000-8000-000000000044','10000000-0000-4000-8000-000000000020','Electrical Engineering','Department of Electrical Engineering at Mekelle University.'),
('20000000-0000-4000-8000-000000000045','10000000-0000-4000-8000-000000000021','Accounting','Department of Accounting at Mekelle University.'),
('20000000-0000-4000-8000-000000000046','10000000-0000-4000-8000-000000000021','Management','Department of Management at Mekelle University.'),
('20000000-0000-4000-8000-000000000047','10000000-0000-4000-8000-000000000022','Computer Science','Department of Computer Science at Mekelle University.'),
('20000000-0000-4000-8000-000000000048','10000000-0000-4000-8000-000000000022','Mathematics','Department of Mathematics at Mekelle University.'),
('20000000-0000-4000-8000-000000000049','10000000-0000-4000-8000-000000000022','Statistics','Department of Statistics at Mekelle University.'),
('20000000-0000-4000-8000-000000000050','10000000-0000-4000-8000-000000000023','Civil Engineering','Department of Civil Engineering at Arba Minch University.'),
('20000000-0000-4000-8000-000000000051','10000000-0000-4000-8000-000000000023','Electrical Engineering','Department of Electrical Engineering at Arba Minch University.'),
('20000000-0000-4000-8000-000000000052','10000000-0000-4000-8000-000000000024','Computer Science','Department of Computer Science at Arba Minch University.'),
('20000000-0000-4000-8000-000000000053','10000000-0000-4000-8000-000000000024','Mathematics','Department of Mathematics at Arba Minch University.'),
('20000000-0000-4000-8000-000000000054','10000000-0000-4000-8000-000000000024','Statistics','Department of Statistics at Arba Minch University.'),
('20000000-0000-4000-8000-000000000055','10000000-0000-4000-8000-000000000025','Computer Science','Department of Computer Science at Adama Science and Technology University.'),
('20000000-0000-4000-8000-000000000056','10000000-0000-4000-8000-000000000025','Information Technology','Department of Information Technology at Adama Science and Technology University.'),
('20000000-0000-4000-8000-000000000057','10000000-0000-4000-8000-000000000025','Software Engineering','Department of Software Engineering at Adama Science and Technology University.'),
('20000000-0000-4000-8000-000000000058','10000000-0000-4000-8000-000000000026','Civil Engineering','Department of Civil Engineering at Adama Science and Technology University.'),
('20000000-0000-4000-8000-000000000059','10000000-0000-4000-8000-000000000026','Electrical Engineering','Department of Electrical Engineering at Adama Science and Technology University.'),
('20000000-0000-4000-8000-000000000060','10000000-0000-4000-8000-000000000027','Accounting','Department of Accounting at St. Mary''s University.'),
('20000000-0000-4000-8000-000000000061','10000000-0000-4000-8000-000000000027','Management','Department of Management at St. Mary''s University.'),
('20000000-0000-4000-8000-000000000062','10000000-0000-4000-8000-000000000028','Computer Science','Department of Computer Science at St. Mary''s University.'),
('20000000-0000-4000-8000-000000000063','10000000-0000-4000-8000-000000000028','Information Technology','Department of Information Technology at St. Mary''s University.'),
('20000000-0000-4000-8000-000000000064','10000000-0000-4000-8000-000000000028','Software Engineering','Department of Software Engineering at St. Mary''s University.'),
('20000000-0000-4000-8000-000000000065','10000000-0000-4000-8000-000000000029','Medicine','Department of Medicine at Addis Ababa Medical and Business College.'),
('20000000-0000-4000-8000-000000000066','10000000-0000-4000-8000-000000000029','Nursing','Department of Nursing at Addis Ababa Medical and Business College.'),
('20000000-0000-4000-8000-000000000067','10000000-0000-4000-8000-000000000030','Accounting','Department of Accounting at Addis Ababa Medical and Business College.'),
('20000000-0000-4000-8000-000000000068','10000000-0000-4000-8000-000000000030','Management','Department of Management at Addis Ababa Medical and Business College.'),
('20000000-0000-4000-8000-000000000069','10000000-0000-4000-8000-000000000031','Plant Science','Department of Plant Science at Haramaya University.'),
('20000000-0000-4000-8000-000000000070','10000000-0000-4000-8000-000000000031','Animal Science','Department of Animal Science at Haramaya University.'),
('20000000-0000-4000-8000-000000000071','10000000-0000-4000-8000-000000000032','Computer Science','Department of Computer Science at Haramaya University.'),
('20000000-0000-4000-8000-000000000072','10000000-0000-4000-8000-000000000032','Mathematics','Department of Mathematics at Haramaya University.'),
('20000000-0000-4000-8000-000000000073','10000000-0000-4000-8000-000000000032','Statistics','Department of Statistics at Haramaya University.'),
('20000000-0000-4000-8000-000000000074','10000000-0000-4000-8000-000000000033','Accounting','Department of Accounting at Haramaya University.'),
('20000000-0000-4000-8000-000000000075','10000000-0000-4000-8000-000000000033','Management','Department of Management at Haramaya University.'),
('20000000-0000-4000-8000-000000000076','10000000-0000-4000-8000-000000000034','Computer Science','Department of Computer Science at Wolaita Sodo University.'),
('20000000-0000-4000-8000-000000000077','10000000-0000-4000-8000-000000000034','Mathematics','Department of Mathematics at Wolaita Sodo University.'),
('20000000-0000-4000-8000-000000000078','10000000-0000-4000-8000-000000000034','Statistics','Department of Statistics at Wolaita Sodo University.'),
('20000000-0000-4000-8000-000000000079','10000000-0000-4000-8000-000000000035','Accounting','Department of Accounting at Wolaita Sodo University.'),
('20000000-0000-4000-8000-000000000080','10000000-0000-4000-8000-000000000035','Management','Department of Management at Wolaita Sodo University.'),
('20000000-0000-4000-8000-000000000081','10000000-0000-4000-8000-000000000036','Computer Science','Department of Computer Science at Debre Berhan University.'),
('20000000-0000-4000-8000-000000000082','10000000-0000-4000-8000-000000000036','Mathematics','Department of Mathematics at Debre Berhan University.'),
('20000000-0000-4000-8000-000000000083','10000000-0000-4000-8000-000000000036','Statistics','Department of Statistics at Debre Berhan University.'),
('20000000-0000-4000-8000-000000000084','10000000-0000-4000-8000-000000000037','Accounting','Department of Accounting at Debre Berhan University.'),
('20000000-0000-4000-8000-000000000085','10000000-0000-4000-8000-000000000037','Management','Department of Management at Debre Berhan University.'),
('20000000-0000-4000-8000-000000000086','10000000-0000-4000-8000-000000000038','Computer Science','Department of Computer Science at Debre Markos University.'),
('20000000-0000-4000-8000-000000000087','10000000-0000-4000-8000-000000000038','Mathematics','Department of Mathematics at Debre Markos University.'),
('20000000-0000-4000-8000-000000000088','10000000-0000-4000-8000-000000000038','Statistics','Department of Statistics at Debre Markos University.'),
('20000000-0000-4000-8000-000000000089','10000000-0000-4000-8000-000000000039','Plant Science','Department of Plant Science at Debre Markos University.'),
('20000000-0000-4000-8000-000000000090','10000000-0000-4000-8000-000000000039','Animal Science','Department of Animal Science at Debre Markos University.'),
('20000000-0000-4000-8000-000000000091','10000000-0000-4000-8000-000000000040','Civil Engineering','Department of Civil Engineering at Dire Dawa University.'),
('20000000-0000-4000-8000-000000000092','10000000-0000-4000-8000-000000000040','Electrical Engineering','Department of Electrical Engineering at Dire Dawa University.'),
('20000000-0000-4000-8000-000000000093','10000000-0000-4000-8000-000000000041','Computer Science','Department of Computer Science at Dire Dawa University.'),
('20000000-0000-4000-8000-000000000094','10000000-0000-4000-8000-000000000041','Information Technology','Department of Information Technology at Dire Dawa University.'),
('20000000-0000-4000-8000-000000000095','10000000-0000-4000-8000-000000000041','Software Engineering','Department of Software Engineering at Dire Dawa University.'),
('20000000-0000-4000-8000-000000000096','10000000-0000-4000-8000-000000000042','Computer Science','Department of Computer Science at Dilla University.'),
('20000000-0000-4000-8000-000000000097','10000000-0000-4000-8000-000000000042','Mathematics','Department of Mathematics at Dilla University.'),
('20000000-0000-4000-8000-000000000098','10000000-0000-4000-8000-000000000042','Statistics','Department of Statistics at Dilla University.'),
('20000000-0000-4000-8000-000000000099','10000000-0000-4000-8000-000000000043','Accounting','Department of Accounting at Dilla University.'),
('20000000-0000-4000-8000-000000000100','10000000-0000-4000-8000-000000000043','Management','Department of Management at Dilla University.'),
('20000000-0000-4000-8000-000000000101','10000000-0000-4000-8000-000000000044','Plant Science','Department of Plant Science at Ambo University.'),
('20000000-0000-4000-8000-000000000102','10000000-0000-4000-8000-000000000044','Animal Science','Department of Animal Science at Ambo University.'),
('20000000-0000-4000-8000-000000000103','10000000-0000-4000-8000-000000000045','Computer Science','Department of Computer Science at Ambo University.'),
('20000000-0000-4000-8000-000000000104','10000000-0000-4000-8000-000000000045','Mathematics','Department of Mathematics at Ambo University.'),
('20000000-0000-4000-8000-000000000105','10000000-0000-4000-8000-000000000045','Statistics','Department of Statistics at Ambo University.'),
('20000000-0000-4000-8000-000000000106','10000000-0000-4000-8000-000000000046','Computer Science','Department of Computer Science at Wolkite University.'),
('20000000-0000-4000-8000-000000000107','10000000-0000-4000-8000-000000000046','Mathematics','Department of Mathematics at Wolkite University.'),
('20000000-0000-4000-8000-000000000108','10000000-0000-4000-8000-000000000046','Statistics','Department of Statistics at Wolkite University.'),
('20000000-0000-4000-8000-000000000109','10000000-0000-4000-8000-000000000047','Accounting','Department of Accounting at Wolkite University.'),
('20000000-0000-4000-8000-000000000110','10000000-0000-4000-8000-000000000047','Management','Department of Management at Wolkite University.')
ON CONFLICT (id) DO NOTHING;

-- E5. Additional Academic Programs
INSERT INTO programs (id,institution_id,department_id,name,slug,degree_level,duration,study_mode,description,admission_requirements,status) VALUES
('30000000-0000-4000-8000-000000000003','00000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000003','Bachelor of Science in Mathematics','aau-bac-mathematics','bachelor','4 years','full_time','Bachelor program in Mathematics offered by the Mathematics department at Addis Ababa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000004','00000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000004','Bachelor of Science in Physics','aau-bac-physics','bachelor','4 years','full_time','Bachelor program in Physics offered by the Physics department at Addis Ababa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000005','00000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000005','Bachelor of Science in Civil Engineering','aau-bac-civil-engineering','bachelor','4 years','full_time','Bachelor program in Civil Engineering offered by the Civil Engineering department at Addis Ababa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000006','00000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000006','Bachelor of Science in Electrical and Computer Engineering','aau-bac-electrical-and-computer-engineering','bachelor','4 years','full_time','Bachelor program in Electrical and Computer Engineering offered by the Electrical Engineering department at Addis Ababa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000007','00000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000007','Bachelor of Science in Accounting and Finance','aau-bac-accounting-and-finance','bachelor','4 years','full_time','Bachelor program in Accounting and Finance offered by the Accounting department at Addis Ababa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000008','00000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000008','Bachelor of Science in Management','aau-bac-management','bachelor','4 years','full_time','Bachelor program in Management offered by the Management department at Addis Ababa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000009','00000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000009','Doctor of Medicine in Medicine','aau-phd-medicine','phd','4 years','full_time','Phd program in Medicine offered by the Medicine department at Addis Ababa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000010','00000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000010','Bachelor of Science in Nursing','aau-bac-nursing','bachelor','4 years','full_time','Bachelor program in Nursing offered by the Nursing department at Addis Ababa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000011','Bachelor of Laws (LL.B.) in Law','aau-bac-law','bachelor','4 years','full_time','Bachelor program in Law offered by the Law department at Addis Ababa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000012','00000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000012','Bachelor of Science in Computer Science','bdu-bac-computer-science','bachelor','4 years','full_time','Bachelor program in Computer Science offered by the Computer Science department at Bahir Dar University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000013','00000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000013','Bachelor of Science in Information Technology','bdu-bac-information-technology','bachelor','4 years','full_time','Bachelor program in Information Technology offered by the Information Technology department at Bahir Dar University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000014','00000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000014','Bachelor of Science in Civil Engineering','bdu-bac-civil-engineering','bachelor','4 years','full_time','Bachelor program in Civil Engineering offered by the Civil Engineering department at Bahir Dar University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000015','00000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000015','Bachelor of Science in Electrical and Computer Engineering','bdu-bac-electrical-and-computer-engineering','bachelor','4 years','full_time','Bachelor program in Electrical and Computer Engineering offered by the Electrical Engineering department at Bahir Dar University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000016','00000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000016','Bachelor of Science in Accounting and Finance','bdu-bac-accounting-and-finance','bachelor','4 years','full_time','Bachelor program in Accounting and Finance offered by the Accounting department at Bahir Dar University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000017','00000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000017','Bachelor of Science in Management','bdu-bac-management','bachelor','4 years','full_time','Bachelor program in Management offered by the Management department at Bahir Dar University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000018','00000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000018','Bachelor of Science in Plant Science','bdu-bac-plant-science','bachelor','4 years','full_time','Bachelor program in Plant Science offered by the Plant Science department at Bahir Dar University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000019','00000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000019','Bachelor of Science in Animal Science','bdu-bac-animal-science','bachelor','4 years','full_time','Bachelor program in Animal Science offered by the Animal Science department at Bahir Dar University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000020','00000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000020','Doctor of Medicine in Medicine','uog-phd-medicine','phd','4 years','full_time','Phd program in Medicine offered by the Medicine department at University of Gondar.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000021','00000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000021','Bachelor of Science in Nursing','uog-bac-nursing','bachelor','4 years','full_time','Bachelor program in Nursing offered by the Nursing department at University of Gondar.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000022','00000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000022','Bachelor of Science in Computer Science','uog-bac-computer-science','bachelor','4 years','full_time','Bachelor program in Computer Science offered by the Computer Science department at University of Gondar.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000023','00000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000023','Bachelor of Science in Mathematics','uog-bac-mathematics','bachelor','4 years','full_time','Bachelor program in Mathematics offered by the Mathematics department at University of Gondar.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000024','00000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000024','Bachelor of Science in Statistics','uog-bac-statistics','bachelor','4 years','full_time','Bachelor program in Statistics offered by the Statistics department at University of Gondar.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000025','00000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000025','Bachelor of Science in Accounting and Finance','uog-bac-accounting-and-finance','bachelor','4 years','full_time','Bachelor program in Accounting and Finance offered by the Accounting department at University of Gondar.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000026','00000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000026','Bachelor of Science in Management','uog-bac-management','bachelor','4 years','full_time','Bachelor program in Management offered by the Management department at University of Gondar.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000027','00000000-0000-4000-8000-000000000004','20000000-0000-4000-8000-000000000027','Doctor of Medicine in Medicine','ju-phd-medicine','phd','4 years','full_time','Phd program in Medicine offered by the Medicine department at Jimma University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000028','00000000-0000-4000-8000-000000000004','20000000-0000-4000-8000-000000000028','Bachelor of Science in Nursing','ju-bac-nursing','bachelor','4 years','full_time','Bachelor program in Nursing offered by the Nursing department at Jimma University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000029','00000000-0000-4000-8000-000000000004','20000000-0000-4000-8000-000000000029','Bachelor of Science in Plant Science','ju-bac-plant-science','bachelor','4 years','full_time','Bachelor program in Plant Science offered by the Plant Science department at Jimma University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000030','00000000-0000-4000-8000-000000000004','20000000-0000-4000-8000-000000000030','Bachelor of Science in Animal Science','ju-bac-animal-science','bachelor','4 years','full_time','Bachelor program in Animal Science offered by the Animal Science department at Jimma University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000031','00000000-0000-4000-8000-000000000004','20000000-0000-4000-8000-000000000031','Bachelor of Science in Computer Science','ju-bac-computer-science','bachelor','4 years','full_time','Bachelor program in Computer Science offered by the Computer Science department at Jimma University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000032','00000000-0000-4000-8000-000000000004','20000000-0000-4000-8000-000000000032','Bachelor of Science in Mathematics','ju-bac-mathematics','bachelor','4 years','full_time','Bachelor program in Mathematics offered by the Mathematics department at Jimma University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000033','00000000-0000-4000-8000-000000000004','20000000-0000-4000-8000-000000000033','Bachelor of Science in Statistics','ju-bac-statistics','bachelor','4 years','full_time','Bachelor program in Statistics offered by the Statistics department at Jimma University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000034','00000000-0000-4000-8000-000000000004','20000000-0000-4000-8000-000000000034','Bachelor of Science in Accounting and Finance','ju-bac-accounting-and-finance','bachelor','4 years','full_time','Bachelor program in Accounting and Finance offered by the Accounting department at Jimma University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000035','00000000-0000-4000-8000-000000000004','20000000-0000-4000-8000-000000000035','Bachelor of Science in Management','ju-bac-management','bachelor','4 years','full_time','Bachelor program in Management offered by the Management department at Jimma University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000036','00000000-0000-4000-8000-000000000005','20000000-0000-4000-8000-000000000036','Bachelor of Science in Computer Science','hu-bac-computer-science','bachelor','4 years','full_time','Bachelor program in Computer Science offered by the Computer Science department at Hawassa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000037','00000000-0000-4000-8000-000000000005','20000000-0000-4000-8000-000000000037','Bachelor of Science in Mathematics','hu-bac-mathematics','bachelor','4 years','full_time','Bachelor program in Mathematics offered by the Mathematics department at Hawassa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000038','00000000-0000-4000-8000-000000000005','20000000-0000-4000-8000-000000000038','Bachelor of Science in Statistics','hu-bac-statistics','bachelor','4 years','full_time','Bachelor program in Statistics offered by the Statistics department at Hawassa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000039','00000000-0000-4000-8000-000000000005','20000000-0000-4000-8000-000000000039','Bachelor of Science in Plant Science','hu-bac-plant-science','bachelor','4 years','full_time','Bachelor program in Plant Science offered by the Plant Science department at Hawassa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000040','00000000-0000-4000-8000-000000000005','20000000-0000-4000-8000-000000000040','Bachelor of Science in Animal Science','hu-bac-animal-science','bachelor','4 years','full_time','Bachelor program in Animal Science offered by the Animal Science department at Hawassa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000041','00000000-0000-4000-8000-000000000005','20000000-0000-4000-8000-000000000041','Bachelor of Science in Accounting and Finance','hu-bac-accounting-and-finance','bachelor','4 years','full_time','Bachelor program in Accounting and Finance offered by the Accounting department at Hawassa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000042','00000000-0000-4000-8000-000000000005','20000000-0000-4000-8000-000000000042','Bachelor of Science in Management','hu-bac-management','bachelor','4 years','full_time','Bachelor program in Management offered by the Management department at Hawassa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000043','00000000-0000-4000-8000-000000000006','20000000-0000-4000-8000-000000000043','Bachelor of Science in Civil Engineering','mu-bac-civil-engineering','bachelor','4 years','full_time','Bachelor program in Civil Engineering offered by the Civil Engineering department at Mekelle University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000044','00000000-0000-4000-8000-000000000006','20000000-0000-4000-8000-000000000044','Bachelor of Science in Electrical and Computer Engineering','mu-bac-electrical-and-computer-engineering','bachelor','4 years','full_time','Bachelor program in Electrical and Computer Engineering offered by the Electrical Engineering department at Mekelle University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000045','00000000-0000-4000-8000-000000000006','20000000-0000-4000-8000-000000000045','Bachelor of Science in Accounting and Finance','mu-bac-accounting-and-finance','bachelor','4 years','full_time','Bachelor program in Accounting and Finance offered by the Accounting department at Mekelle University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000046','00000000-0000-4000-8000-000000000006','20000000-0000-4000-8000-000000000046','Bachelor of Science in Management','mu-bac-management','bachelor','4 years','full_time','Bachelor program in Management offered by the Management department at Mekelle University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000047','00000000-0000-4000-8000-000000000006','20000000-0000-4000-8000-000000000047','Bachelor of Science in Computer Science','mu-bac-computer-science','bachelor','4 years','full_time','Bachelor program in Computer Science offered by the Computer Science department at Mekelle University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000048','00000000-0000-4000-8000-000000000006','20000000-0000-4000-8000-000000000048','Bachelor of Science in Mathematics','mu-bac-mathematics','bachelor','4 years','full_time','Bachelor program in Mathematics offered by the Mathematics department at Mekelle University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000049','00000000-0000-4000-8000-000000000006','20000000-0000-4000-8000-000000000049','Bachelor of Science in Statistics','mu-bac-statistics','bachelor','4 years','full_time','Bachelor program in Statistics offered by the Statistics department at Mekelle University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000050','00000000-0000-4000-8000-000000000007','20000000-0000-4000-8000-000000000050','Bachelor of Science in Civil Engineering','amu-bac-civil-engineering','bachelor','4 years','full_time','Bachelor program in Civil Engineering offered by the Civil Engineering department at Arba Minch University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000051','00000000-0000-4000-8000-000000000007','20000000-0000-4000-8000-000000000051','Bachelor of Science in Electrical and Computer Engineering','amu-bac-electrical-and-computer-engineering','bachelor','4 years','full_time','Bachelor program in Electrical and Computer Engineering offered by the Electrical Engineering department at Arba Minch University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000052','00000000-0000-4000-8000-000000000007','20000000-0000-4000-8000-000000000052','Bachelor of Science in Computer Science','amu-bac-computer-science','bachelor','4 years','full_time','Bachelor program in Computer Science offered by the Computer Science department at Arba Minch University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000053','00000000-0000-4000-8000-000000000007','20000000-0000-4000-8000-000000000053','Bachelor of Science in Mathematics','amu-bac-mathematics','bachelor','4 years','full_time','Bachelor program in Mathematics offered by the Mathematics department at Arba Minch University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000054','00000000-0000-4000-8000-000000000007','20000000-0000-4000-8000-000000000054','Bachelor of Science in Statistics','amu-bac-statistics','bachelor','4 years','full_time','Bachelor program in Statistics offered by the Statistics department at Arba Minch University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000055','00000000-0000-4000-8000-000000000008','20000000-0000-4000-8000-000000000055','Bachelor of Science in Computer Science','astu-bac-computer-science','bachelor','4 years','full_time','Bachelor program in Computer Science offered by the Computer Science department at Adama Science and Technology University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000056','00000000-0000-4000-8000-000000000008','20000000-0000-4000-8000-000000000056','Bachelor of Science in Information Technology','astu-bac-information-technology','bachelor','4 years','full_time','Bachelor program in Information Technology offered by the Information Technology department at Adama Science and Technology University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000057','00000000-0000-4000-8000-000000000008','20000000-0000-4000-8000-000000000057','Bachelor of Science in Software Engineering','astu-bac-software-engineering','bachelor','4 years','full_time','Bachelor program in Software Engineering offered by the Software Engineering department at Adama Science and Technology University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000058','00000000-0000-4000-8000-000000000008','20000000-0000-4000-8000-000000000058','Bachelor of Science in Civil Engineering','astu-bac-civil-engineering','bachelor','4 years','full_time','Bachelor program in Civil Engineering offered by the Civil Engineering department at Adama Science and Technology University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000059','00000000-0000-4000-8000-000000000008','20000000-0000-4000-8000-000000000059','Bachelor of Science in Electrical and Computer Engineering','astu-bac-electrical-and-computer-engineering','bachelor','4 years','full_time','Bachelor program in Electrical and Computer Engineering offered by the Electrical Engineering department at Adama Science and Technology University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000060','00000000-0000-4000-8000-000000000009','20000000-0000-4000-8000-000000000060','Bachelor of Science in Accounting and Finance','smu-bac-accounting-and-finance','bachelor','4 years','full_time','Bachelor program in Accounting and Finance offered by the Accounting department at St. Mary''s University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000061','00000000-0000-4000-8000-000000000009','20000000-0000-4000-8000-000000000061','Bachelor of Science in Management','smu-bac-management','bachelor','4 years','full_time','Bachelor program in Management offered by the Management department at St. Mary''s University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000062','00000000-0000-4000-8000-000000000009','20000000-0000-4000-8000-000000000062','Bachelor of Science in Computer Science','smu-bac-computer-science','bachelor','4 years','full_time','Bachelor program in Computer Science offered by the Computer Science department at St. Mary''s University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000063','00000000-0000-4000-8000-000000000009','20000000-0000-4000-8000-000000000063','Bachelor of Science in Information Technology','smu-bac-information-technology','bachelor','4 years','full_time','Bachelor program in Information Technology offered by the Information Technology department at St. Mary''s University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000064','00000000-0000-4000-8000-000000000009','20000000-0000-4000-8000-000000000064','Bachelor of Science in Software Engineering','smu-bac-software-engineering','bachelor','4 years','full_time','Bachelor program in Software Engineering offered by the Software Engineering department at St. Mary''s University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000065','00000000-0000-4000-8000-000000000010','20000000-0000-4000-8000-000000000065','Doctor of Medicine in Medicine','aambc-phd-medicine','phd','4 years','full_time','Phd program in Medicine offered by the Medicine department at Addis Ababa Medical and Business College.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000066','00000000-0000-4000-8000-000000000010','20000000-0000-4000-8000-000000000066','Bachelor of Science in Nursing','aambc-bac-nursing','bachelor','4 years','full_time','Bachelor program in Nursing offered by the Nursing department at Addis Ababa Medical and Business College.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000067','00000000-0000-4000-8000-000000000010','20000000-0000-4000-8000-000000000067','Bachelor of Science in Accounting and Finance','aambc-bac-accounting-and-finance','bachelor','4 years','full_time','Bachelor program in Accounting and Finance offered by the Accounting department at Addis Ababa Medical and Business College.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000068','00000000-0000-4000-8000-000000000010','20000000-0000-4000-8000-000000000068','Bachelor of Science in Management','aambc-bac-management','bachelor','4 years','full_time','Bachelor program in Management offered by the Management department at Addis Ababa Medical and Business College.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000069','00000000-0000-4000-8000-000000000011','20000000-0000-4000-8000-000000000069','Bachelor of Science in Plant Science','haramaya-bac-plant-science','bachelor','4 years','full_time','Bachelor program in Plant Science offered by the Plant Science department at Haramaya University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000070','00000000-0000-4000-8000-000000000011','20000000-0000-4000-8000-000000000070','Bachelor of Science in Animal Science','haramaya-bac-animal-science','bachelor','4 years','full_time','Bachelor program in Animal Science offered by the Animal Science department at Haramaya University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000071','00000000-0000-4000-8000-000000000011','20000000-0000-4000-8000-000000000071','Bachelor of Science in Computer Science','haramaya-bac-computer-science','bachelor','4 years','full_time','Bachelor program in Computer Science offered by the Computer Science department at Haramaya University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000072','00000000-0000-4000-8000-000000000011','20000000-0000-4000-8000-000000000072','Bachelor of Science in Mathematics','haramaya-bac-mathematics','bachelor','4 years','full_time','Bachelor program in Mathematics offered by the Mathematics department at Haramaya University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000073','00000000-0000-4000-8000-000000000011','20000000-0000-4000-8000-000000000073','Bachelor of Science in Statistics','haramaya-bac-statistics','bachelor','4 years','full_time','Bachelor program in Statistics offered by the Statistics department at Haramaya University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000074','00000000-0000-4000-8000-000000000011','20000000-0000-4000-8000-000000000074','Bachelor of Science in Accounting and Finance','haramaya-bac-accounting-and-finance','bachelor','4 years','full_time','Bachelor program in Accounting and Finance offered by the Accounting department at Haramaya University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000075','00000000-0000-4000-8000-000000000011','20000000-0000-4000-8000-000000000075','Bachelor of Science in Management','haramaya-bac-management','bachelor','4 years','full_time','Bachelor program in Management offered by the Management department at Haramaya University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000076','00000000-0000-4000-8000-000000000012','20000000-0000-4000-8000-000000000076','Bachelor of Science in Computer Science','wsu-bac-computer-science','bachelor','4 years','full_time','Bachelor program in Computer Science offered by the Computer Science department at Wolaita Sodo University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000077','00000000-0000-4000-8000-000000000012','20000000-0000-4000-8000-000000000077','Bachelor of Science in Mathematics','wsu-bac-mathematics','bachelor','4 years','full_time','Bachelor program in Mathematics offered by the Mathematics department at Wolaita Sodo University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000078','00000000-0000-4000-8000-000000000012','20000000-0000-4000-8000-000000000078','Bachelor of Science in Statistics','wsu-bac-statistics','bachelor','4 years','full_time','Bachelor program in Statistics offered by the Statistics department at Wolaita Sodo University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000079','00000000-0000-4000-8000-000000000012','20000000-0000-4000-8000-000000000079','Bachelor of Science in Accounting and Finance','wsu-bac-accounting-and-finance','bachelor','4 years','full_time','Bachelor program in Accounting and Finance offered by the Accounting department at Wolaita Sodo University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000080','00000000-0000-4000-8000-000000000012','20000000-0000-4000-8000-000000000080','Bachelor of Science in Management','wsu-bac-management','bachelor','4 years','full_time','Bachelor program in Management offered by the Management department at Wolaita Sodo University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000081','00000000-0000-4000-8000-000000000013','20000000-0000-4000-8000-000000000081','Bachelor of Science in Computer Science','dbu-bac-computer-science','bachelor','4 years','full_time','Bachelor program in Computer Science offered by the Computer Science department at Debre Berhan University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000082','00000000-0000-4000-8000-000000000013','20000000-0000-4000-8000-000000000082','Bachelor of Science in Mathematics','dbu-bac-mathematics','bachelor','4 years','full_time','Bachelor program in Mathematics offered by the Mathematics department at Debre Berhan University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000083','00000000-0000-4000-8000-000000000013','20000000-0000-4000-8000-000000000083','Bachelor of Science in Statistics','dbu-bac-statistics','bachelor','4 years','full_time','Bachelor program in Statistics offered by the Statistics department at Debre Berhan University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000084','00000000-0000-4000-8000-000000000013','20000000-0000-4000-8000-000000000084','Bachelor of Science in Accounting and Finance','dbu-bac-accounting-and-finance','bachelor','4 years','full_time','Bachelor program in Accounting and Finance offered by the Accounting department at Debre Berhan University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000085','00000000-0000-4000-8000-000000000013','20000000-0000-4000-8000-000000000085','Bachelor of Science in Management','dbu-bac-management','bachelor','4 years','full_time','Bachelor program in Management offered by the Management department at Debre Berhan University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000086','00000000-0000-4000-8000-000000000014','20000000-0000-4000-8000-000000000086','Bachelor of Science in Computer Science','dmu-bac-computer-science','bachelor','4 years','full_time','Bachelor program in Computer Science offered by the Computer Science department at Debre Markos University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000087','00000000-0000-4000-8000-000000000014','20000000-0000-4000-8000-000000000087','Bachelor of Science in Mathematics','dmu-bac-mathematics','bachelor','4 years','full_time','Bachelor program in Mathematics offered by the Mathematics department at Debre Markos University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000088','00000000-0000-4000-8000-000000000014','20000000-0000-4000-8000-000000000088','Bachelor of Science in Statistics','dmu-bac-statistics','bachelor','4 years','full_time','Bachelor program in Statistics offered by the Statistics department at Debre Markos University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000089','00000000-0000-4000-8000-000000000014','20000000-0000-4000-8000-000000000089','Bachelor of Science in Plant Science','dmu-bac-plant-science','bachelor','4 years','full_time','Bachelor program in Plant Science offered by the Plant Science department at Debre Markos University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000090','00000000-0000-4000-8000-000000000014','20000000-0000-4000-8000-000000000090','Bachelor of Science in Animal Science','dmu-bac-animal-science','bachelor','4 years','full_time','Bachelor program in Animal Science offered by the Animal Science department at Debre Markos University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000091','00000000-0000-4000-8000-000000000015','20000000-0000-4000-8000-000000000091','Bachelor of Science in Civil Engineering','ddu-bac-civil-engineering','bachelor','4 years','full_time','Bachelor program in Civil Engineering offered by the Civil Engineering department at Dire Dawa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000092','00000000-0000-4000-8000-000000000015','20000000-0000-4000-8000-000000000092','Bachelor of Science in Electrical and Computer Engineering','ddu-bac-electrical-and-computer-engineering','bachelor','4 years','full_time','Bachelor program in Electrical and Computer Engineering offered by the Electrical Engineering department at Dire Dawa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000093','00000000-0000-4000-8000-000000000015','20000000-0000-4000-8000-000000000093','Bachelor of Science in Computer Science','ddu-bac-computer-science','bachelor','4 years','full_time','Bachelor program in Computer Science offered by the Computer Science department at Dire Dawa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000094','00000000-0000-4000-8000-000000000015','20000000-0000-4000-8000-000000000094','Bachelor of Science in Information Technology','ddu-bac-information-technology','bachelor','4 years','full_time','Bachelor program in Information Technology offered by the Information Technology department at Dire Dawa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000095','00000000-0000-4000-8000-000000000015','20000000-0000-4000-8000-000000000095','Bachelor of Science in Software Engineering','ddu-bac-software-engineering','bachelor','4 years','full_time','Bachelor program in Software Engineering offered by the Software Engineering department at Dire Dawa University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000096','00000000-0000-4000-8000-000000000016','20000000-0000-4000-8000-000000000096','Bachelor of Science in Computer Science','dilla-bac-computer-science','bachelor','4 years','full_time','Bachelor program in Computer Science offered by the Computer Science department at Dilla University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000097','00000000-0000-4000-8000-000000000016','20000000-0000-4000-8000-000000000097','Bachelor of Science in Mathematics','dilla-bac-mathematics','bachelor','4 years','full_time','Bachelor program in Mathematics offered by the Mathematics department at Dilla University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000098','00000000-0000-4000-8000-000000000016','20000000-0000-4000-8000-000000000098','Bachelor of Science in Statistics','dilla-bac-statistics','bachelor','4 years','full_time','Bachelor program in Statistics offered by the Statistics department at Dilla University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000099','00000000-0000-4000-8000-000000000016','20000000-0000-4000-8000-000000000099','Bachelor of Science in Accounting and Finance','dilla-bac-accounting-and-finance','bachelor','4 years','full_time','Bachelor program in Accounting and Finance offered by the Accounting department at Dilla University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000100','00000000-0000-4000-8000-000000000016','20000000-0000-4000-8000-000000000100','Bachelor of Science in Management','dilla-bac-management','bachelor','4 years','full_time','Bachelor program in Management offered by the Management department at Dilla University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000101','00000000-0000-4000-8000-000000000017','20000000-0000-4000-8000-000000000101','Bachelor of Science in Plant Science','ambo-bac-plant-science','bachelor','4 years','full_time','Bachelor program in Plant Science offered by the Plant Science department at Ambo University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000102','00000000-0000-4000-8000-000000000017','20000000-0000-4000-8000-000000000102','Bachelor of Science in Animal Science','ambo-bac-animal-science','bachelor','4 years','full_time','Bachelor program in Animal Science offered by the Animal Science department at Ambo University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000103','00000000-0000-4000-8000-000000000017','20000000-0000-4000-8000-000000000103','Bachelor of Science in Computer Science','ambo-bac-computer-science','bachelor','4 years','full_time','Bachelor program in Computer Science offered by the Computer Science department at Ambo University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000104','00000000-0000-4000-8000-000000000017','20000000-0000-4000-8000-000000000104','Bachelor of Science in Mathematics','ambo-bac-mathematics','bachelor','4 years','full_time','Bachelor program in Mathematics offered by the Mathematics department at Ambo University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000105','00000000-0000-4000-8000-000000000017','20000000-0000-4000-8000-000000000105','Bachelor of Science in Statistics','ambo-bac-statistics','bachelor','4 years','full_time','Bachelor program in Statistics offered by the Statistics department at Ambo University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000106','00000000-0000-4000-8000-000000000018','20000000-0000-4000-8000-000000000106','Bachelor of Science in Computer Science','wku-bac-computer-science','bachelor','4 years','full_time','Bachelor program in Computer Science offered by the Computer Science department at Wolkite University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000107','00000000-0000-4000-8000-000000000018','20000000-0000-4000-8000-000000000107','Bachelor of Science in Mathematics','wku-bac-mathematics','bachelor','4 years','full_time','Bachelor program in Mathematics offered by the Mathematics department at Wolkite University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000108','00000000-0000-4000-8000-000000000018','20000000-0000-4000-8000-000000000108','Bachelor of Science in Statistics','wku-bac-statistics','bachelor','4 years','full_time','Bachelor program in Statistics offered by the Statistics department at Wolkite University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000109','00000000-0000-4000-8000-000000000018','20000000-0000-4000-8000-000000000109','Bachelor of Science in Accounting and Finance','wku-bac-accounting-and-finance','bachelor','4 years','full_time','Bachelor program in Accounting and Finance offered by the Accounting department at Wolkite University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000110','00000000-0000-4000-8000-000000000018','20000000-0000-4000-8000-000000000110','Bachelor of Science in Management','wku-bac-management','bachelor','4 years','full_time','Bachelor program in Management offered by the Management department at Wolkite University.','Ethiopian higher education entrance qualification and department-specific prerequisites apply.','published'),
('30000000-0000-4000-8000-000000000111','00000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','Master of Science in Computer Science','aau-mas-computer-science','master','2 years','full_time','Master program in Computer Science for advanced study and research at Addis Ababa University.','Relevant bachelor''s degree (or master''s for PhD study) with a satisfactory CGPA; entrance exam/interview may apply.','published'),
('30000000-0000-4000-8000-000000000112','00000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','Doctor of Philosophy in Computer Science','aau-phd-computer-science','phd','4 years','full_time','Phd program in Computer Science for advanced study and research at Addis Ababa University.','Relevant bachelor''s degree (or master''s for PhD study) with a satisfactory CGPA; entrance exam/interview may apply.','published'),
('30000000-0000-4000-8000-000000000113','00000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000002','Master of Science in Software Engineering','bdu-mas-software-engineering','master','2 years','full_time','Master program in Software Engineering for advanced study and research at Bahir Dar University.','Relevant bachelor''s degree (or master''s for PhD study) with a satisfactory CGPA; entrance exam/interview may apply.','published'),
('30000000-0000-4000-8000-000000000114','00000000-0000-4000-8000-000000000006','20000000-0000-4000-8000-000000000043','Master of Science in Civil Engineering','mu-mas-civil-engineering','master','2 years','full_time','Master program in Civil Engineering for advanced study and research at Mekelle University.','Relevant bachelor''s degree (or master''s for PhD study) with a satisfactory CGPA; entrance exam/interview may apply.','published')
ON CONFLICT (id) DO NOTHING;

-- E6. Additional Admissions
INSERT INTO admissions (institution_id,program_id,degree_level,requirements,documents,application_process,application_start,application_end) VALUES
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000003','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000004','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000005','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000006','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000007','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000008','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000009','phd','Relevant undergraduate degree, national licensing examination eligibility where applicable, and satisfactory academic standing.','Degree certificate, transcript, professional references, medical fitness certificate where applicable.','Apply through the institution''s specialized/graduate admissions office; interview and entrance assessment required.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000010','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000011','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000012','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000013','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000014','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000015','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000016','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000017','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000018','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000019','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000020','phd','Relevant undergraduate degree, national licensing examination eligibility where applicable, and satisfactory academic standing.','Degree certificate, transcript, professional references, medical fitness certificate where applicable.','Apply through the institution''s specialized/graduate admissions office; interview and entrance assessment required.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000021','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000022','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000023','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000024','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000025','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000026','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000027','phd','Relevant undergraduate degree, national licensing examination eligibility where applicable, and satisfactory academic standing.','Degree certificate, transcript, professional references, medical fitness certificate where applicable.','Apply through the institution''s specialized/graduate admissions office; interview and entrance assessment required.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000028','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000029','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000030','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000031','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000032','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000033','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000034','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000035','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000036','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000037','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000038','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000039','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000040','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000041','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000042','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000043','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000044','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000045','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000046','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000047','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000048','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000049','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000007','30000000-0000-4000-8000-000000000050','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000007','30000000-0000-4000-8000-000000000051','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000007','30000000-0000-4000-8000-000000000052','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000007','30000000-0000-4000-8000-000000000053','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000007','30000000-0000-4000-8000-000000000054','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000008','30000000-0000-4000-8000-000000000055','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000008','30000000-0000-4000-8000-000000000056','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000008','30000000-0000-4000-8000-000000000057','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000008','30000000-0000-4000-8000-000000000058','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000008','30000000-0000-4000-8000-000000000059','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000009','30000000-0000-4000-8000-000000000060','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000009','30000000-0000-4000-8000-000000000061','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000009','30000000-0000-4000-8000-000000000062','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000009','30000000-0000-4000-8000-000000000063','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000009','30000000-0000-4000-8000-000000000064','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000010','30000000-0000-4000-8000-000000000065','phd','Relevant undergraduate degree, national licensing examination eligibility where applicable, and satisfactory academic standing.','Degree certificate, transcript, professional references, medical fitness certificate where applicable.','Apply through the institution''s specialized/graduate admissions office; interview and entrance assessment required.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000010','30000000-0000-4000-8000-000000000066','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000010','30000000-0000-4000-8000-000000000067','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000010','30000000-0000-4000-8000-000000000068','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000011','30000000-0000-4000-8000-000000000069','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000011','30000000-0000-4000-8000-000000000070','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000011','30000000-0000-4000-8000-000000000071','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000011','30000000-0000-4000-8000-000000000072','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000011','30000000-0000-4000-8000-000000000073','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000011','30000000-0000-4000-8000-000000000074','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000011','30000000-0000-4000-8000-000000000075','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000012','30000000-0000-4000-8000-000000000076','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000012','30000000-0000-4000-8000-000000000077','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000012','30000000-0000-4000-8000-000000000078','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000012','30000000-0000-4000-8000-000000000079','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000012','30000000-0000-4000-8000-000000000080','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000013','30000000-0000-4000-8000-000000000081','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000013','30000000-0000-4000-8000-000000000082','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000013','30000000-0000-4000-8000-000000000083','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000013','30000000-0000-4000-8000-000000000084','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000013','30000000-0000-4000-8000-000000000085','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000014','30000000-0000-4000-8000-000000000086','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000014','30000000-0000-4000-8000-000000000087','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000014','30000000-0000-4000-8000-000000000088','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000014','30000000-0000-4000-8000-000000000089','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000014','30000000-0000-4000-8000-000000000090','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000015','30000000-0000-4000-8000-000000000091','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000015','30000000-0000-4000-8000-000000000092','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000015','30000000-0000-4000-8000-000000000093','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000015','30000000-0000-4000-8000-000000000094','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000015','30000000-0000-4000-8000-000000000095','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000016','30000000-0000-4000-8000-000000000096','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000016','30000000-0000-4000-8000-000000000097','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000016','30000000-0000-4000-8000-000000000098','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000016','30000000-0000-4000-8000-000000000099','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000016','30000000-0000-4000-8000-000000000100','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000017','30000000-0000-4000-8000-000000000101','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000017','30000000-0000-4000-8000-000000000102','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000017','30000000-0000-4000-8000-000000000103','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000017','30000000-0000-4000-8000-000000000104','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000017','30000000-0000-4000-8000-000000000105','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000018','30000000-0000-4000-8000-000000000106','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000018','30000000-0000-4000-8000-000000000107','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000018','30000000-0000-4000-8000-000000000108','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000018','30000000-0000-4000-8000-000000000109','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000018','30000000-0000-4000-8000-000000000110','bachelor','Ethiopian Higher Education Entrance Examination result meeting the national cutoff and stream requirements.','Grade 12 transcript, entrance exam result, national ID or passport, passport photos.','Apply through the Ministry of Education central placement or the institution''s direct undergraduate admission portal.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000111','master','Relevant bachelor''s degree with a CGPA of 2.75 or above from an accredited institution.','Degree certificate, official transcript, two recommendation letters, statement of purpose.','Apply through the institution''s School of Graduate Studies admission portal; entrance exam or interview may be required.','2026-06-01','2026-08-31'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000112','phd','Relevant undergraduate degree, national licensing examination eligibility where applicable, and satisfactory academic standing.','Degree certificate, transcript, professional references, medical fitness certificate where applicable.','Apply through the institution''s specialized/graduate admissions office; interview and entrance assessment required.','2027-06-01','2027-08-31'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000113','master','Relevant bachelor''s degree with a CGPA of 2.75 or above from an accredited institution.','Degree certificate, official transcript, two recommendation letters, statement of purpose.','Apply through the institution''s School of Graduate Studies admission portal; entrance exam or interview may be required.','2026-07-01','2026-09-15'),
('00000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000114','master','Relevant bachelor''s degree with a CGPA of 2.75 or above from an accredited institution.','Degree certificate, official transcript, two recommendation letters, statement of purpose.','Apply through the institution''s School of Graduate Studies admission portal; entrance exam or interview may be required.','2027-06-01','2027-08-31')
ON CONFLICT DO NOTHING;

-- E7. Additional Tuition Fees (development estimates, marked via source column)
INSERT INTO tuition_fees (institution_id,program_id,amount,period,effective_date,source) VALUES
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000003',18600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000004',39300,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000005',23000,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000006',19600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000007',18400,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000008',39300,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000009',27800,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000010',28800,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000011',16000,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000012',22200,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000013',31600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000014',15900,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000015',21500,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000016',36300,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000017',32900,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000018',22200,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000019',34300,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000020',25200,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000021',37900,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000022',26100,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000023',20100,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000024',26000,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000025',18000,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000026',18200,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000027',36300,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000028',23700,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000029',38900,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000030',32600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000031',27400,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000032',33100,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000033',35600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000034',26800,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000035',21300,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000036',17300,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000037',36700,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000038',24500,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000039',22600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000040',27500,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000041',29900,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000042',27000,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000043',27100,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000044',21900,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000045',23700,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000046',37400,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000047',17300,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000048',35800,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000049',32500,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000007','30000000-0000-4000-8000-000000000050',23000,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000007','30000000-0000-4000-8000-000000000051',30100,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000007','30000000-0000-4000-8000-000000000052',23800,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000007','30000000-0000-4000-8000-000000000053',37500,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000007','30000000-0000-4000-8000-000000000054',22200,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000008','30000000-0000-4000-8000-000000000055',25600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000008','30000000-0000-4000-8000-000000000056',22500,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000008','30000000-0000-4000-8000-000000000057',25300,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000008','30000000-0000-4000-8000-000000000058',23800,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000008','30000000-0000-4000-8000-000000000059',21900,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000009','30000000-0000-4000-8000-000000000060',45600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000009','30000000-0000-4000-8000-000000000061',68000,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000009','30000000-0000-4000-8000-000000000062',50900,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000009','30000000-0000-4000-8000-000000000063',55100,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000009','30000000-0000-4000-8000-000000000064',42400,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000010','30000000-0000-4000-8000-000000000065',61200,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000010','30000000-0000-4000-8000-000000000066',61800,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000010','30000000-0000-4000-8000-000000000067',42200,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000010','30000000-0000-4000-8000-000000000068',63300,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000011','30000000-0000-4000-8000-000000000069',34100,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000011','30000000-0000-4000-8000-000000000070',26900,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000011','30000000-0000-4000-8000-000000000071',19500,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000011','30000000-0000-4000-8000-000000000072',31200,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000011','30000000-0000-4000-8000-000000000073',39800,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000011','30000000-0000-4000-8000-000000000074',18600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000011','30000000-0000-4000-8000-000000000075',35600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000012','30000000-0000-4000-8000-000000000076',37300,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000012','30000000-0000-4000-8000-000000000077',34500,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000012','30000000-0000-4000-8000-000000000078',27600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000012','30000000-0000-4000-8000-000000000079',34500,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000012','30000000-0000-4000-8000-000000000080',32300,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000013','30000000-0000-4000-8000-000000000081',33100,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000013','30000000-0000-4000-8000-000000000082',37300,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000013','30000000-0000-4000-8000-000000000083',18800,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000013','30000000-0000-4000-8000-000000000084',32600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000013','30000000-0000-4000-8000-000000000085',36000,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000014','30000000-0000-4000-8000-000000000086',18700,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000014','30000000-0000-4000-8000-000000000087',29200,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000014','30000000-0000-4000-8000-000000000088',29900,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000014','30000000-0000-4000-8000-000000000089',38700,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000014','30000000-0000-4000-8000-000000000090',23600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000015','30000000-0000-4000-8000-000000000091',40000,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000015','30000000-0000-4000-8000-000000000092',31600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000015','30000000-0000-4000-8000-000000000093',35500,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000015','30000000-0000-4000-8000-000000000094',35900,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000015','30000000-0000-4000-8000-000000000095',35000,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000016','30000000-0000-4000-8000-000000000096',20000,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000016','30000000-0000-4000-8000-000000000097',40000,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000016','30000000-0000-4000-8000-000000000098',32700,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000016','30000000-0000-4000-8000-000000000099',15000,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000016','30000000-0000-4000-8000-000000000100',25600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000017','30000000-0000-4000-8000-000000000101',15600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000017','30000000-0000-4000-8000-000000000102',26900,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000017','30000000-0000-4000-8000-000000000103',22800,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000017','30000000-0000-4000-8000-000000000104',22900,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000017','30000000-0000-4000-8000-000000000105',17600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000018','30000000-0000-4000-8000-000000000106',39000,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000018','30000000-0000-4000-8000-000000000107',17300,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000018','30000000-0000-4000-8000-000000000108',19100,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000018','30000000-0000-4000-8000-000000000109',36600,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000018','30000000-0000-4000-8000-000000000110',33000,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000111',28700,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000112',44900,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000113',26900,'per_year','2026-01-01','development estimate'),
('00000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000114',44700,'per_year','2026-01-01','development estimate')
ON CONFLICT DO NOTHING;

-- E8. Additional Scholarships
INSERT INTO scholarships (id,name,slug,description,eligibility,funding,status) VALUES
('40000000-0000-4000-8000-000000000003','Women in STEM Excellence Scholarship','women-in-stem-excellence-scholarship','Supports female undergraduate students pursuing STEM programs across Ethiopian public universities.','Female students enrolled in a natural science, engineering, or computing program with a CGPA of 3.0 or above.','Full tuition and a monthly stipend','published'),
('40000000-0000-4000-8000-000000000004','National Merit Scholarship','national-merit-scholarship','Awarded to top-performing entering freshmen based on national entrance examination results.','Top 5% of entrance examination scorers admitted to a public university.','Full tuition waiver','published'),
('40000000-0000-4000-8000-000000000005','Postgraduate Research Fellowship','postgraduate-research-fellowship','Funds master''s and doctoral research in priority national development areas.','Admitted graduate students with an approved thesis/dissertation proposal.','Tuition waiver plus research grant','published'),
('40000000-0000-4000-8000-000000000006','Need-Based Access Grant','need-based-access-grant','Assists students from low-income households in meeting tuition and living costs.','Demonstrated financial need verified by kebele-level documentation.','Partial tuition and dormitory subsidy','published'),
('40000000-0000-4000-8000-000000000007','AI and Data Science Talent Award','ai-and-data-science-talent-award','Encourages talented students to pursue artificial intelligence and data science programs.','Admitted or continuing students in Computer Science, Data Science, or related programs with strong academic performance.','Partial tuition and laptop stipend','published'),
('40000000-0000-4000-8000-000000000008','International Exchange Scholarship','international-exchange-scholarship','Supports a semester of study abroad through partner-university exchange agreements.','Third- or fourth-year students in good academic standing with faculty nomination.','Travel and living stipend','published'),
('40000000-0000-4000-8000-000000000009','University-Specific Excellence Award','university-specific-excellence-award','Institution-funded award recognizing top graduating-class performance.','Graduating students ranked in the top 3 of their program cohort.','One-time cash award','published'),
('40000000-0000-4000-8000-000000000010','Government Civil Service Sponsorship','government-civil-service-sponsorship','Sponsors employed civil servants pursuing part-time or evening degree programs.','Current government employees nominated by their employing office.','Full tuition sponsorship','published'),
('40000000-0000-4000-8000-000000000011','Disability and Accessibility Support Scholarship','disability-accessibility-support-scholarship','Provides financial and accessibility support to students with disabilities.','Students with documented disabilities enrolled in an undergraduate or graduate program.','Tuition waiver and accessibility accommodations budget','published'),
('40000000-0000-4000-8000-000000000012','Agricultural Innovation Scholarship','agricultural-innovation-scholarship','Supports students in agriculture and natural resource management programs contributing to food-security innovation.','Students enrolled in Plant Science, Animal Science, or Agricultural Economics programs.','Partial tuition and field-research support','published'),
('40000000-0000-4000-8000-000000000013','Health Sciences Workforce Scholarship','health-sciences-workforce-scholarship','Addresses the shortage of health professionals by funding health-science students who commit to public service placements.','Students in Medicine, Nursing, Public Health, or Pharmacy programs who agree to a post-graduation service bond.','Full tuition and clinical placement stipend','published'),
('40000000-0000-4000-8000-000000000014','Regional Access Bridge Scholarship','regional-access-bridge-scholarship','Encourages access to higher education for students from underserved regions.','Students admitted from designated underserved zones with satisfactory entrance results.','Partial tuition and transport allowance','published')
ON CONFLICT (id) DO NOTHING;

-- E9. Institution Scholarships Links
INSERT INTO institution_scholarships (institution_id,scholarship_id) VALUES
('00000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000003'),
('00000000-0000-4000-8000-000000000002','40000000-0000-4000-8000-000000000003'),
('00000000-0000-4000-8000-000000000006','40000000-0000-4000-8000-000000000003'),
('00000000-0000-4000-8000-000000000008','40000000-0000-4000-8000-000000000003'),
('00000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000004'),
('00000000-0000-4000-8000-000000000003','40000000-0000-4000-8000-000000000004'),
('00000000-0000-4000-8000-000000000004','40000000-0000-4000-8000-000000000004'),
('00000000-0000-4000-8000-000000000005','40000000-0000-4000-8000-000000000004'),
('00000000-0000-4000-8000-000000000007','40000000-0000-4000-8000-000000000004'),
('00000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000005'),
('00000000-0000-4000-8000-000000000002','40000000-0000-4000-8000-000000000005'),
('00000000-0000-4000-8000-000000000006','40000000-0000-4000-8000-000000000005'),
('00000000-0000-4000-8000-000000000003','40000000-0000-4000-8000-000000000006'),
('00000000-0000-4000-8000-000000000004','40000000-0000-4000-8000-000000000006'),
('00000000-0000-4000-8000-000000000005','40000000-0000-4000-8000-000000000006'),
('00000000-0000-4000-8000-000000000011','40000000-0000-4000-8000-000000000006'),
('00000000-0000-4000-8000-000000000012','40000000-0000-4000-8000-000000000006'),
('00000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000007'),
('00000000-0000-4000-8000-000000000002','40000000-0000-4000-8000-000000000007'),
('00000000-0000-4000-8000-000000000008','40000000-0000-4000-8000-000000000007'),
('00000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000008'),
('00000000-0000-4000-8000-000000000002','40000000-0000-4000-8000-000000000008'),
('00000000-0000-4000-8000-000000000003','40000000-0000-4000-8000-000000000009'),
('00000000-0000-4000-8000-000000000005','40000000-0000-4000-8000-000000000009'),
('00000000-0000-4000-8000-000000000006','40000000-0000-4000-8000-000000000009'),
('00000000-0000-4000-8000-000000000007','40000000-0000-4000-8000-000000000009'),
('00000000-0000-4000-8000-000000000009','40000000-0000-4000-8000-000000000010'),
('00000000-0000-4000-8000-000000000010','40000000-0000-4000-8000-000000000010'),
('00000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000011'),
('00000000-0000-4000-8000-000000000004','40000000-0000-4000-8000-000000000011'),
('00000000-0000-4000-8000-000000000005','40000000-0000-4000-8000-000000000011'),
('00000000-0000-4000-8000-000000000004','40000000-0000-4000-8000-000000000012'),
('00000000-0000-4000-8000-000000000005','40000000-0000-4000-8000-000000000012'),
('00000000-0000-4000-8000-000000000011','40000000-0000-4000-8000-000000000012'),
('00000000-0000-4000-8000-000000000014','40000000-0000-4000-8000-000000000012'),
('00000000-0000-4000-8000-000000000017','40000000-0000-4000-8000-000000000012'),
('00000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000013'),
('00000000-0000-4000-8000-000000000003','40000000-0000-4000-8000-000000000013'),
('00000000-0000-4000-8000-000000000004','40000000-0000-4000-8000-000000000013'),
('00000000-0000-4000-8000-000000000010','40000000-0000-4000-8000-000000000013'),
('00000000-0000-4000-8000-000000000012','40000000-0000-4000-8000-000000000014'),
('00000000-0000-4000-8000-000000000013','40000000-0000-4000-8000-000000000014'),
('00000000-0000-4000-8000-000000000014','40000000-0000-4000-8000-000000000014'),
('00000000-0000-4000-8000-000000000015','40000000-0000-4000-8000-000000000014'),
('00000000-0000-4000-8000-000000000016','40000000-0000-4000-8000-000000000014'),
('00000000-0000-4000-8000-000000000017','40000000-0000-4000-8000-000000000014'),
('00000000-0000-4000-8000-000000000018','40000000-0000-4000-8000-000000000014')
ON CONFLICT DO NOTHING;

-- E10. Additional Facilities
INSERT INTO facilities (institution_id,name,type,description) VALUES
('00000000-0000-4000-8000-000000000001','Entrepreneurship Center','other','Entrepreneurship Center serving students and faculty at Addis Ababa University.'),
('00000000-0000-4000-8000-000000000001','ICT Center','computer_lab','ICT Center serving students and faculty at Addis Ababa University.'),
('00000000-0000-4000-8000-000000000002','Main Auditorium','other','Main Auditorium serving students and faculty at Bahir Dar University.'),
('00000000-0000-4000-8000-000000000002','University Health Center','medical_services','University Health Center serving students and faculty at Bahir Dar University.'),
('00000000-0000-4000-8000-000000000003','Sports and Recreation Center','sports_facility','Sports and Recreation Center serving students and faculty at University of Gondar.'),
('00000000-0000-4000-8000-000000000003','Applied Research Laboratory','research_center','Applied Research Laboratory serving students and faculty at University of Gondar.'),
('00000000-0000-4000-8000-000000000004','Sports and Recreation Center','sports_facility','Sports and Recreation Center serving students and faculty at Jimma University.'),
('00000000-0000-4000-8000-000000000004','AI and Data Science Laboratory','computer_lab','AI and Data Science Laboratory serving students and faculty at Jimma University.'),
('00000000-0000-4000-8000-000000000005','Entrepreneurship Center','other','Entrepreneurship Center serving students and faculty at Hawassa University.'),
('00000000-0000-4000-8000-000000000005','Student Dormitory Complex','student_housing','Student Dormitory Complex serving students and faculty at Hawassa University.'),
('00000000-0000-4000-8000-000000000006','AI and Data Science Laboratory','computer_lab','AI and Data Science Laboratory serving students and faculty at Mekelle University.'),
('00000000-0000-4000-8000-000000000006','University Health Center','medical_services','University Health Center serving students and faculty at Mekelle University.'),
('00000000-0000-4000-8000-000000000007','Digital Library','library','Digital Library serving students and faculty at Arba Minch University.'),
('00000000-0000-4000-8000-000000000007','Applied Research Laboratory','research_center','Applied Research Laboratory serving students and faculty at Arba Minch University.'),
('00000000-0000-4000-8000-000000000008','Entrepreneurship Center','other','Entrepreneurship Center serving students and faculty at Adama Science and Technology University.'),
('00000000-0000-4000-8000-000000000008','Student Dormitory Complex','student_housing','Student Dormitory Complex serving students and faculty at Adama Science and Technology University.'),
('00000000-0000-4000-8000-000000000009','Digital Library','library','Digital Library serving students and faculty at St. Mary''s University.'),
('00000000-0000-4000-8000-000000000009','AI and Data Science Laboratory','computer_lab','AI and Data Science Laboratory serving students and faculty at St. Mary''s University.'),
('00000000-0000-4000-8000-000000000010','Digital Library','library','Digital Library serving students and faculty at Addis Ababa Medical and Business College.'),
('00000000-0000-4000-8000-000000000010','Entrepreneurship Center','other','Entrepreneurship Center serving students and faculty at Addis Ababa Medical and Business College.'),
('00000000-0000-4000-8000-000000000011','AI and Data Science Laboratory','computer_lab','AI and Data Science Laboratory serving students and faculty at Haramaya University.'),
('00000000-0000-4000-8000-000000000011','Digital Library','library','Digital Library serving students and faculty at Haramaya University.'),
('00000000-0000-4000-8000-000000000012','University Health Center','medical_services','University Health Center serving students and faculty at Wolaita Sodo University.'),
('00000000-0000-4000-8000-000000000012','AI and Data Science Laboratory','computer_lab','AI and Data Science Laboratory serving students and faculty at Wolaita Sodo University.'),
('00000000-0000-4000-8000-000000000013','Applied Research Laboratory','research_center','Applied Research Laboratory serving students and faculty at Debre Berhan University.'),
('00000000-0000-4000-8000-000000000013','Entrepreneurship Center','other','Entrepreneurship Center serving students and faculty at Debre Berhan University.'),
('00000000-0000-4000-8000-000000000014','ICT Center','computer_lab','ICT Center serving students and faculty at Debre Markos University.'),
('00000000-0000-4000-8000-000000000014','Sports and Recreation Center','sports_facility','Sports and Recreation Center serving students and faculty at Debre Markos University.'),
('00000000-0000-4000-8000-000000000015','Entrepreneurship Center','other','Entrepreneurship Center serving students and faculty at Dire Dawa University.'),
('00000000-0000-4000-8000-000000000015','Applied Research Laboratory','research_center','Applied Research Laboratory serving students and faculty at Dire Dawa University.'),
('00000000-0000-4000-8000-000000000016','Student Innovation Hub','other','Student Innovation Hub serving students and faculty at Dilla University.'),
('00000000-0000-4000-8000-000000000016','Sports and Recreation Center','sports_facility','Sports and Recreation Center serving students and faculty at Dilla University.'),
('00000000-0000-4000-8000-000000000017','Entrepreneurship Center','other','Entrepreneurship Center serving students and faculty at Ambo University.'),
('00000000-0000-4000-8000-000000000017','Sports and Recreation Center','sports_facility','Sports and Recreation Center serving students and faculty at Ambo University.'),
('00000000-0000-4000-8000-000000000018','Main Auditorium','other','Main Auditorium serving students and faculty at Wolkite University.'),
('00000000-0000-4000-8000-000000000018','Entrepreneurship Center','other','Entrepreneurship Center serving students and faculty at Wolkite University.')
ON CONFLICT DO NOTHING;

-- E11. Additional Academic Calendar Events
INSERT INTO academic_calendar (institution_id,title,event_type,start_date,end_date,description) VALUES
('00000000-0000-4000-8000-000000000001','Freshman orientation','other','2026-09-08','2026-09-10','Freshman orientation at Addis Ababa University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000001','National holiday recess','holiday','2026-09-11','2026-09-12','National holiday recess at Addis Ababa University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000002','Second semester begins','semester_start','2027-02-08',NULL,'Second semester begins at Bahir Dar University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000002','First semester ends','semester_end','2027-01-30',NULL,'First semester ends at Bahir Dar University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000003','Second semester begins','semester_start','2027-02-08',NULL,'Second semester begins at University of Gondar for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000003','National holiday recess','holiday','2026-09-11','2026-09-12','National holiday recess at University of Gondar for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000004','Scholarship application deadline','other','2026-09-30',NULL,'Scholarship application deadline at Jimma University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000004','Undergraduate application window','other','2026-06-01','2026-08-31','Undergraduate application window at Jimma University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000005','Freshman orientation','other','2026-09-08','2026-09-10','Freshman orientation at Hawassa University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000005','Undergraduate application window','other','2026-06-01','2026-08-31','Undergraduate application window at Hawassa University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000006','Second semester begins','semester_start','2027-02-08',NULL,'Second semester begins at Mekelle University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000006','First semester ends','semester_end','2027-01-30',NULL,'First semester ends at Mekelle University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000007','Freshman orientation','other','2026-09-08','2026-09-10','Freshman orientation at Arba Minch University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000007','First semester begins','semester_start','2026-09-15',NULL,'First semester begins at Arba Minch University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000008','First semester begins','semester_start','2026-09-15',NULL,'First semester begins at Adama Science and Technology University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000008','National holiday recess','holiday','2026-09-11','2026-09-12','National holiday recess at Adama Science and Technology University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000009','Annual graduation ceremony','other','2027-07-10',NULL,'Annual graduation ceremony at St. Mary''s University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000009','Scholarship application deadline','other','2026-09-30',NULL,'Scholarship application deadline at St. Mary''s University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000010','First semester registration','registration','2026-09-01','2026-09-10','First semester registration at Addis Ababa Medical and Business College for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000010','Second semester begins','semester_start','2027-02-08',NULL,'Second semester begins at Addis Ababa Medical and Business College for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000011','First semester registration','registration','2026-09-01','2026-09-10','First semester registration at Haramaya University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000011','First semester examination period','examination','2027-01-12','2027-01-24','First semester examination period at Haramaya University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000012','Scholarship application deadline','other','2026-09-30',NULL,'Scholarship application deadline at Wolaita Sodo University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000012','First semester begins','semester_start','2026-09-15',NULL,'First semester begins at Wolaita Sodo University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000013','Freshman orientation','other','2026-09-08','2026-09-10','Freshman orientation at Debre Berhan University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000013','Scholarship application deadline','other','2026-09-30',NULL,'Scholarship application deadline at Debre Berhan University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000014','Annual graduation ceremony','other','2027-07-10',NULL,'Annual graduation ceremony at Debre Markos University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000014','Freshman orientation','other','2026-09-08','2026-09-10','Freshman orientation at Debre Markos University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000015','Undergraduate application window','other','2026-06-01','2026-08-31','Undergraduate application window at Dire Dawa University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000015','Annual graduation ceremony','other','2027-07-10',NULL,'Annual graduation ceremony at Dire Dawa University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000016','Undergraduate application window','other','2026-06-01','2026-08-31','Undergraduate application window at Dilla University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000016','Freshman orientation','other','2026-09-08','2026-09-10','Freshman orientation at Dilla University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000017','First semester begins','semester_start','2026-09-15',NULL,'First semester begins at Ambo University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000017','First semester registration','registration','2026-09-01','2026-09-10','First semester registration at Ambo University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000018','Second semester begins','semester_start','2027-02-08',NULL,'Second semester begins at Wolkite University for the 2026/27 academic year.'),
('00000000-0000-4000-8000-000000000018','Scholarship application deadline','other','2026-09-30',NULL,'Scholarship application deadline at Wolkite University for the 2026/27 academic year.')
ON CONFLICT DO NOTHING;

-- E12. Additional Careers
INSERT INTO careers (id,name,slug,description) VALUES
('50000000-0000-4000-8000-000000000003','AI Engineer','ai-engineer','Designs and deploys machine learning and artificial intelligence systems.'),
('50000000-0000-4000-8000-000000000004','Machine Learning Engineer','machine-learning-engineer','Builds and productionizes machine learning models and pipelines.'),
('50000000-0000-4000-8000-000000000005','Data Scientist','data-scientist','Extracts insight from data using statistics and machine learning.'),
('50000000-0000-4000-8000-000000000006','Cybersecurity Analyst','cybersecurity-analyst','Protects information systems from security threats.'),
('50000000-0000-4000-8000-000000000007','Cloud Engineer','cloud-engineer','Designs and manages scalable cloud infrastructure.'),
('50000000-0000-4000-8000-000000000008','DevOps Engineer','devops-engineer','Automates software delivery and infrastructure operations.'),
('50000000-0000-4000-8000-000000000009','Database Administrator','database-administrator','Manages and optimizes production database systems.'),
('50000000-0000-4000-8000-000000000010','Network Engineer','network-engineer','Designs, implements, and maintains computer networks.'),
('50000000-0000-4000-8000-000000000011','Systems Analyst','systems-analyst','Analyzes business needs and designs information system solutions.'),
('50000000-0000-4000-8000-000000000012','UI/UX Designer','ui-ux-designer','Designs usable and engaging digital product interfaces.'),
('50000000-0000-4000-8000-000000000013','Research Scientist','research-scientist','Conducts original research in an academic or industrial setting.'),
('50000000-0000-4000-8000-000000000014','Lecturer','lecturer','Teaches and conducts research at a higher education institution.'),
('50000000-0000-4000-8000-000000000015','Biomedical Engineer','biomedical-engineer','Applies engineering principles to healthcare and medical devices.'),
('50000000-0000-4000-8000-000000000016','Civil Engineer','civil-engineer','Plans, designs, and oversees construction and infrastructure projects.'),
('50000000-0000-4000-8000-000000000017','Electrical Engineer','electrical-engineer','Designs and maintains electrical systems and equipment.'),
('50000000-0000-4000-8000-000000000018','Mechanical Engineer','mechanical-engineer','Designs and analyzes mechanical systems and machinery.'),
('50000000-0000-4000-8000-000000000019','Accountant','accountant','Prepares and examines financial records for organizations.'),
('50000000-0000-4000-8000-000000000020','Economist','economist','Studies production, distribution, and consumption of goods and services.'),
('50000000-0000-4000-8000-000000000021','Public Health Specialist','public-health-specialist','Plans and evaluates public health programs and policy.'),
('50000000-0000-4000-8000-000000000022','Agricultural Engineer','agricultural-engineer','Applies engineering to agricultural production and processing.'),
('50000000-0000-4000-8000-000000000023','Physician','physician','Diagnoses and treats patients in clinical settings.'),
('50000000-0000-4000-8000-000000000024','Pharmacist','pharmacist','Dispenses medication and advises on proper drug use.')
ON CONFLICT (id) DO NOTHING;

-- E13. Additional Program-Career Links
INSERT INTO program_careers (program_id,career_id) VALUES
('30000000-0000-4000-8000-000000000003','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000003','50000000-0000-4000-8000-000000000014'),
('30000000-0000-4000-8000-000000000004','50000000-0000-4000-8000-000000000013'),
('30000000-0000-4000-8000-000000000004','50000000-0000-4000-8000-000000000014'),
('30000000-0000-4000-8000-000000000005','50000000-0000-4000-8000-000000000016'),
('30000000-0000-4000-8000-000000000006','50000000-0000-4000-8000-000000000017'),
('30000000-0000-4000-8000-000000000007','50000000-0000-4000-8000-000000000019'),
('30000000-0000-4000-8000-000000000008','50000000-0000-4000-8000-000000000020'),
('30000000-0000-4000-8000-000000000009','50000000-0000-4000-8000-000000000023'),
('30000000-0000-4000-8000-000000000010','50000000-0000-4000-8000-000000000021'),
('30000000-0000-4000-8000-000000000011','50000000-0000-4000-8000-000000000014'),
('30000000-0000-4000-8000-000000000012','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000012','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000012','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000012','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000013','50000000-0000-4000-8000-000000000011'),
('30000000-0000-4000-8000-000000000013','50000000-0000-4000-8000-000000000010'),
('30000000-0000-4000-8000-000000000013','50000000-0000-4000-8000-000000000007'),
('30000000-0000-4000-8000-000000000014','50000000-0000-4000-8000-000000000016'),
('30000000-0000-4000-8000-000000000015','50000000-0000-4000-8000-000000000017'),
('30000000-0000-4000-8000-000000000016','50000000-0000-4000-8000-000000000019'),
('30000000-0000-4000-8000-000000000017','50000000-0000-4000-8000-000000000020'),
('30000000-0000-4000-8000-000000000018','50000000-0000-4000-8000-000000000022'),
('30000000-0000-4000-8000-000000000019','50000000-0000-4000-8000-000000000022'),
('30000000-0000-4000-8000-000000000020','50000000-0000-4000-8000-000000000023'),
('30000000-0000-4000-8000-000000000021','50000000-0000-4000-8000-000000000021'),
('30000000-0000-4000-8000-000000000022','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000022','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000022','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000022','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000023','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000023','50000000-0000-4000-8000-000000000014'),
('30000000-0000-4000-8000-000000000024','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000024','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000025','50000000-0000-4000-8000-000000000019'),
('30000000-0000-4000-8000-000000000026','50000000-0000-4000-8000-000000000020'),
('30000000-0000-4000-8000-000000000027','50000000-0000-4000-8000-000000000023'),
('30000000-0000-4000-8000-000000000028','50000000-0000-4000-8000-000000000021'),
('30000000-0000-4000-8000-000000000029','50000000-0000-4000-8000-000000000022'),
('30000000-0000-4000-8000-000000000030','50000000-0000-4000-8000-000000000022'),
('30000000-0000-4000-8000-000000000031','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000031','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000031','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000031','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000032','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000032','50000000-0000-4000-8000-000000000014'),
('30000000-0000-4000-8000-000000000033','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000033','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000034','50000000-0000-4000-8000-000000000019'),
('30000000-0000-4000-8000-000000000035','50000000-0000-4000-8000-000000000020'),
('30000000-0000-4000-8000-000000000036','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000036','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000036','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000036','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000037','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000037','50000000-0000-4000-8000-000000000014'),
('30000000-0000-4000-8000-000000000038','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000038','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000039','50000000-0000-4000-8000-000000000022'),
('30000000-0000-4000-8000-000000000040','50000000-0000-4000-8000-000000000022'),
('30000000-0000-4000-8000-000000000041','50000000-0000-4000-8000-000000000019'),
('30000000-0000-4000-8000-000000000042','50000000-0000-4000-8000-000000000020'),
('30000000-0000-4000-8000-000000000043','50000000-0000-4000-8000-000000000016'),
('30000000-0000-4000-8000-000000000044','50000000-0000-4000-8000-000000000017'),
('30000000-0000-4000-8000-000000000045','50000000-0000-4000-8000-000000000019'),
('30000000-0000-4000-8000-000000000046','50000000-0000-4000-8000-000000000020'),
('30000000-0000-4000-8000-000000000047','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000047','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000047','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000047','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000048','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000048','50000000-0000-4000-8000-000000000014'),
('30000000-0000-4000-8000-000000000049','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000049','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000050','50000000-0000-4000-8000-000000000016'),
('30000000-0000-4000-8000-000000000051','50000000-0000-4000-8000-000000000017'),
('30000000-0000-4000-8000-000000000052','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000052','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000052','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000052','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000053','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000053','50000000-0000-4000-8000-000000000014'),
('30000000-0000-4000-8000-000000000054','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000054','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000055','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000055','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000055','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000055','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000056','50000000-0000-4000-8000-000000000011'),
('30000000-0000-4000-8000-000000000056','50000000-0000-4000-8000-000000000010'),
('30000000-0000-4000-8000-000000000056','50000000-0000-4000-8000-000000000007'),
('30000000-0000-4000-8000-000000000057','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000057','50000000-0000-4000-8000-000000000008'),
('30000000-0000-4000-8000-000000000057','50000000-0000-4000-8000-000000000012'),
('30000000-0000-4000-8000-000000000058','50000000-0000-4000-8000-000000000016'),
('30000000-0000-4000-8000-000000000059','50000000-0000-4000-8000-000000000017'),
('30000000-0000-4000-8000-000000000060','50000000-0000-4000-8000-000000000019'),
('30000000-0000-4000-8000-000000000061','50000000-0000-4000-8000-000000000020'),
('30000000-0000-4000-8000-000000000062','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000062','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000062','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000062','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000063','50000000-0000-4000-8000-000000000011'),
('30000000-0000-4000-8000-000000000063','50000000-0000-4000-8000-000000000010'),
('30000000-0000-4000-8000-000000000063','50000000-0000-4000-8000-000000000007'),
('30000000-0000-4000-8000-000000000064','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000064','50000000-0000-4000-8000-000000000008'),
('30000000-0000-4000-8000-000000000064','50000000-0000-4000-8000-000000000012'),
('30000000-0000-4000-8000-000000000065','50000000-0000-4000-8000-000000000023'),
('30000000-0000-4000-8000-000000000066','50000000-0000-4000-8000-000000000021'),
('30000000-0000-4000-8000-000000000067','50000000-0000-4000-8000-000000000019'),
('30000000-0000-4000-8000-000000000068','50000000-0000-4000-8000-000000000020'),
('30000000-0000-4000-8000-000000000069','50000000-0000-4000-8000-000000000022'),
('30000000-0000-4000-8000-000000000070','50000000-0000-4000-8000-000000000022'),
('30000000-0000-4000-8000-000000000071','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000071','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000071','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000071','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000072','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000072','50000000-0000-4000-8000-000000000014'),
('30000000-0000-4000-8000-000000000073','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000073','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000074','50000000-0000-4000-8000-000000000019'),
('30000000-0000-4000-8000-000000000075','50000000-0000-4000-8000-000000000020'),
('30000000-0000-4000-8000-000000000076','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000076','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000076','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000076','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000077','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000077','50000000-0000-4000-8000-000000000014'),
('30000000-0000-4000-8000-000000000078','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000078','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000079','50000000-0000-4000-8000-000000000019'),
('30000000-0000-4000-8000-000000000080','50000000-0000-4000-8000-000000000020'),
('30000000-0000-4000-8000-000000000081','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000081','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000081','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000081','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000082','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000082','50000000-0000-4000-8000-000000000014'),
('30000000-0000-4000-8000-000000000083','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000083','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000084','50000000-0000-4000-8000-000000000019'),
('30000000-0000-4000-8000-000000000085','50000000-0000-4000-8000-000000000020'),
('30000000-0000-4000-8000-000000000086','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000086','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000086','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000086','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000087','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000087','50000000-0000-4000-8000-000000000014'),
('30000000-0000-4000-8000-000000000088','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000088','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000089','50000000-0000-4000-8000-000000000022'),
('30000000-0000-4000-8000-000000000090','50000000-0000-4000-8000-000000000022'),
('30000000-0000-4000-8000-000000000091','50000000-0000-4000-8000-000000000016'),
('30000000-0000-4000-8000-000000000092','50000000-0000-4000-8000-000000000017'),
('30000000-0000-4000-8000-000000000093','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000093','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000093','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000093','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000094','50000000-0000-4000-8000-000000000011'),
('30000000-0000-4000-8000-000000000094','50000000-0000-4000-8000-000000000010'),
('30000000-0000-4000-8000-000000000094','50000000-0000-4000-8000-000000000007'),
('30000000-0000-4000-8000-000000000095','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000095','50000000-0000-4000-8000-000000000008'),
('30000000-0000-4000-8000-000000000095','50000000-0000-4000-8000-000000000012'),
('30000000-0000-4000-8000-000000000096','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000096','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000096','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000096','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000097','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000097','50000000-0000-4000-8000-000000000014'),
('30000000-0000-4000-8000-000000000098','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000098','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000099','50000000-0000-4000-8000-000000000019'),
('30000000-0000-4000-8000-000000000100','50000000-0000-4000-8000-000000000020'),
('30000000-0000-4000-8000-000000000101','50000000-0000-4000-8000-000000000022'),
('30000000-0000-4000-8000-000000000102','50000000-0000-4000-8000-000000000022'),
('30000000-0000-4000-8000-000000000103','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000103','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000103','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000103','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000104','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000104','50000000-0000-4000-8000-000000000014'),
('30000000-0000-4000-8000-000000000105','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000105','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000106','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000106','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000106','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000106','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000107','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000107','50000000-0000-4000-8000-000000000014'),
('30000000-0000-4000-8000-000000000108','50000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000108','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000109','50000000-0000-4000-8000-000000000019'),
('30000000-0000-4000-8000-000000000110','50000000-0000-4000-8000-000000000020'),
('30000000-0000-4000-8000-000000000111','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000111','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000111','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000111','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000112','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000112','50000000-0000-4000-8000-000000000003'),
('30000000-0000-4000-8000-000000000112','50000000-0000-4000-8000-000000000004'),
('30000000-0000-4000-8000-000000000112','50000000-0000-4000-8000-000000000005'),
('30000000-0000-4000-8000-000000000113','50000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000113','50000000-0000-4000-8000-000000000008'),
('30000000-0000-4000-8000-000000000113','50000000-0000-4000-8000-000000000012'),
('30000000-0000-4000-8000-000000000114','50000000-0000-4000-8000-000000000016')
ON CONFLICT DO NOTHING;

-- E14. Additional Users (development/test accounts)
INSERT INTO users (id,email,password_hash,full_name,role,status) VALUES
('90000000-0000-4000-8000-000000000004','admin2@gibiconnect.test','$2b$12$5Mhjp5aJsZLUrM7ptX8foeP5NFBegUdPPVoq3F70c5HsUxABrHmFW','Dr. Genet Alemu','admin','active'),
('90000000-0000-4000-8000-000000000005','moderator1@gibiconnect.test','$2b$12$zHCVh5fH1QqeMBCd5hVB4efd323qXYjAPD2pO7iD5FzhPpJYBEPtK','Yared Mulugeta','moderator','active'),
('90000000-0000-4000-8000-000000000006','moderator2@gibiconnect.test','$2b$12$xSmN9acHMEJUjkIDLwpBv.U713q/u.fWvjebhYy/OzmqqYv3eDO3S','Hanna Tesfaye','moderator','active'),
('90000000-0000-4000-8000-000000000007','student1@gibiconnect.test','$2b$12$W7ErrAwzTgcOQ9B5/vuwxulZnJBF0VAZegtcDBLXJEXJ7MEv7kmqC','Abel Girma','user','active'),
('90000000-0000-4000-8000-000000000008','student2@gibiconnect.test','$2b$12$TVz3tYp1sVLX5Muw0ebaQ.orvwuW4rM5PPq7zHMHYtGdHvrKcD1Nm','Selamawit Fikru','user','active'),
('90000000-0000-4000-8000-000000000009','student3@gibiconnect.test','$2b$12$3zpqKVZusECRckxR40BU7.oJl8VKpdFd6mFy7/y2htd2JP7eofm2G','Dawit Mekonnen','user','active'),
('90000000-0000-4000-8000-000000000010','student4@gibiconnect.test','$2b$12$mkkKWA3yUX8eiL13zqBndeRHKwiYzMM0yn88qABvHbudhFS2etf/W','Rahel Assefa','user','active'),
('90000000-0000-4000-8000-000000000011','student5@gibiconnect.test','$2b$12$HAQ6oHmJesds1SRu5oieLO2lRJKSDsPW3Q3eJH4mLmRh07GKKjnkG','Yonas Bekele','user','active'),
('90000000-0000-4000-8000-000000000012','student6@gibiconnect.test','$2b$12$hc.RRMdRdOk8oRhqEy3JgOWikJk57nSn.iP8/9lDjYOtkhSTujaOi','Meron Tadesse','user','active'),
('90000000-0000-4000-8000-000000000013','student7@gibiconnect.test','$2b$12$fN7Bt6FBxcsvrHu.N5v/FOz0Q1wTBdF2HfpM7vQb9akKWXCwsFtX6','Biniam Wolde','user','active'),
('90000000-0000-4000-8000-000000000014','student8@gibiconnect.test','$2b$12$rTWgnOJeywU5ctSgqKNrP.ABu5GTFMU36U52uFRYNxaGmETig2c6K','Tigist Haile','user','active'),
('90000000-0000-4000-8000-000000000015','student9@gibiconnect.test','$2b$12$IsGJLu/CTCYOiAGStG4GUu7g8RVREJw3zxhvx3Ynze/XGFdhqilKG','Kalkidan Solomon','user','active'),
('90000000-0000-4000-8000-000000000016','student10@gibiconnect.test','$2b$12$0kjtpUIcBc5pHasp0kDxAuZPul/dpsiRc.kiQv/vsk9Ow2Ie/c3KW','Nahom Girma','user','suspended'),
('90000000-0000-4000-8000-000000000017','professor1@gibiconnect.test','$2b$12$/3W1sgNiooyUQgpp5FUYMuFjlH/nti0TqveXSMcwsZsnkCgBxedFm','Prof. Alemayehu Worku','user','active'),
('90000000-0000-4000-8000-000000000018','professor2@gibiconnect.test','$2b$12$iwZtoliuxkWBPYsIbOpKfel9qKxF44Tqv2F47biF2cgyOtM0UQmi2','Dr. Tsion Berhanu','user','active'),
('90000000-0000-4000-8000-000000000019','professor3@gibiconnect.test','$2b$12$NOjPWm0TCcfN7hfv8g.br.RgXnX3nJ3RWyCafBjzUmTX3UR6IIr.O','Dr. Mulugeta Assefa','user','active'),
('90000000-0000-4000-8000-000000000020','professor4@gibiconnect.test','$2b$12$sael28bZdA9rZ48ZryTVq..DameuNySHdYaeyi3W7W5CQfANcUkPa','Dr. Frehiwot Kassa','user','active')
ON CONFLICT (id) DO NOTHING;

-- E15. Additional Categories
INSERT INTO categories (id,name,slug,description) VALUES
('ca000000-0000-4000-8000-000000000006','Business & Economics','business-economics','Accounting, management, economics, and marketing.'),
('ca000000-0000-4000-8000-000000000007','Research & Innovation','research-innovation','Cross-disciplinary research outputs and innovation case studies.'),
('ca000000-0000-4000-8000-000000000008','Scholarships & Funding','scholarships-funding','Scholarship guides, eligibility criteria, and funding opportunities.'),
('ca000000-0000-4000-8000-000000000009','Admissions & Careers','admissions-careers','Admission guides, curricula, and career-planning resources.'),
('ca000000-0000-4000-8000-000000000010','Academic Regulations','academic-regulations','Institutional policy, examination, and accreditation documentation.')
ON CONFLICT (id) DO NOTHING;

-- E16. Additional Tags
INSERT INTO tags (id,name,slug) VALUES
('ba000000-0000-4000-8000-000000000009','Python','python'),
('ba000000-0000-4000-8000-000000000010','PostgreSQL','postgresql'),
('ba000000-0000-4000-8000-000000000011','RAG','rag'),
('ba000000-0000-4000-8000-000000000012','Deep Learning','deep-learning'),
('ba000000-0000-4000-8000-000000000013','Natural Language Processing','natural-language-processing'),
('ba000000-0000-4000-8000-000000000014','Amharic NLP','amharic-nlp'),
('ba000000-0000-4000-8000-000000000015','Cybersecurity','cybersecurity'),
('ba000000-0000-4000-8000-000000000016','Cloud Computing','cloud-computing'),
('ba000000-0000-4000-8000-000000000017','Database','database'),
('ba000000-0000-4000-8000-000000000018','Algorithms','algorithms'),
('ba000000-0000-4000-8000-000000000019','Web Development','web-development'),
('ba000000-0000-4000-8000-000000000020','Admission 2026','admission-2026'),
('ba000000-0000-4000-8000-000000000021','Scholarship','scholarship'),
('ba000000-0000-4000-8000-000000000022','Curriculum','curriculum'),
('ba000000-0000-4000-8000-000000000023','Research Paper','research-paper')
ON CONFLICT (id) DO NOTHING;

-- E17. Additional Authors
INSERT INTO authors (id,user_id,full_name,email,affiliation,orcid) VALUES
('aa000000-0000-4000-8000-000000000005','90000000-0000-4000-8000-000000000014','Prof. Alemayehu Worku','alemayehu.worku@aau.edu.et','Addis Ababa University, College of Engineering','0000-0002-5541-7723'),
('aa000000-0000-4000-8000-000000000006','90000000-0000-4000-8000-000000000015','Dr. Tsion Berhanu','tsion.berhanu@bdu.edu.et','Bahir Dar University, School of Computing','0000-0003-6612-9034'),
('aa000000-0000-4000-8000-000000000007','90000000-0000-4000-8000-000000000016','Dr. Mulugeta Assefa','mulugeta.assefa@ju.edu.et','Jimma University, College of Health Sciences','0000-0001-7823-4456'),
('aa000000-0000-4000-8000-000000000008','90000000-0000-4000-8000-000000000017','Dr. Frehiwot Kassa','frehiwot.kassa@mu.edu.et','Mekelle University, College of Engineering','0000-0002-9034-1187'),
('aa000000-0000-4000-8000-000000000009',NULL,'Dr. Bereket Alemu','bereket.alemu@astu.edu.et','Adama Science and Technology University','0000-0003-1145-2290'),
('aa000000-0000-4000-8000-000000000010',NULL,'Dr. Selamawit Girma','selamawit.girma@uog.edu.et','University of Gondar, College of Health Sciences','0000-0002-2287-6635'),
('aa000000-0000-4000-8000-000000000011',NULL,'Prof. Tesfaye Bekele','tesfaye.bekele@haramaya.edu.et','Haramaya University, College of Agriculture','0000-0001-3392-8871'),
('aa000000-0000-4000-8000-000000000012',NULL,'Dr. Meseret Hailu','meseret.hailu@hu.edu.et','Hawassa University, College of Natural and Computational Sciences','0000-0002-4456-9912'),
('aa000000-0000-4000-8000-000000000013',NULL,'Dr. Yohannes Tadesse','yohannes.tadesse@dilla.edu.et','Dilla University','0000-0003-5567-1023'),
('aa000000-0000-4000-8000-000000000014',NULL,'Dr. Hiwot Assefa','hiwot.assefa@astu.edu.et','Adama Science and Technology University, School of Computing','0000-0002-6678-2134')
ON CONFLICT (id) DO NOTHING;

-- E18. Additional Resources
INSERT INTO resources (id,title,description,resource_type,mime_type,file_extension,original_filename,file_size_bytes,storage_provider,storage_bucket,storage_key,checksum,uploaded_by,institution_id,faculty_id,department_id,program_id,publication_year,language,status,visibility,extracted_text,transcript,processing_status) VALUES
('70000000-0000-4000-8000-000000000015','2026 Undergraduate Admission Guide','Consolidated guide summarizing undergraduate admission requirements, deadlines, and application steps across Ethiopian public universities for the 2026 intake.','document','application/pdf','pdf','undergraduate_admission_guide_2026.pdf',2100000,'local','educational-resources','dev/resources/expansion/undergraduate_admission_guide_2026.pdf','3337da1eb5441c20986e3a011c5a9becc287b6ae14e6e5bb734734fd6555b33e','90000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001',NULL,NULL,NULL,2026,'en','approved','public','Section 1: Eligibility. Applicants must meet the national entrance examination cutoff for their chosen stream. Section 2: Application Timeline for the 2026 academic year.',NULL,'processed'),
('70000000-0000-4000-8000-000000000016','Graduate Admission Guide 2026','Guide to master''s and doctoral admission requirements, application documents, and school of graduate studies procedures.','document','application/pdf','pdf','graduate_admission_guide_2026.pdf',1850000,'local','educational-resources','dev/resources/expansion/graduate_admission_guide_2026.pdf','e3f0bd18f2dacddfd7f44d959d0fd3b35a80abff64103c43fd37c330edabf5f4','90000000-0000-4000-8000-000000000004','00000000-0000-4000-8000-000000000001',NULL,NULL,NULL,2026,'en','approved','public','Graduate applicants must submit an official transcript, two recommendation letters, and a statement of purpose to the School of Graduate Studies.',NULL,'processed'),
('70000000-0000-4000-8000-000000000017','Computer Science Curriculum Handbook','Detailed course-by-course curriculum map for the Bachelor of Science in Computer Science program.','document','application/pdf','pdf','cs_curriculum_handbook.pdf',3100000,'local','educational-resources','dev/resources/expansion/cs_curriculum_handbook.pdf','fad3f570f4b9d9ab4e0e112cf3b3f6f916f8d467f16472c1b6aa31c3d6486f25','90000000-0000-4000-8000-000000000017','00000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001',2026,'en','approved','public','Year 1: Introduction to Programming, Discrete Mathematics. Year 2: Data Structures and Algorithms, Database Systems. Year 3: Operating Systems, Software Engineering.',NULL,'processed'),
('70000000-0000-4000-8000-000000000018','Software Engineering Curriculum Guide','Course map and learning outcomes for the Bachelor of Science in Software Engineering program.','document','application/vnd.openxmlformats-officedocument.wordprocessingml.document','docx','se_curriculum_guide.docx',1400000,'local','educational-resources','dev/resources/expansion/se_curriculum_guide.docx','9ef57cdf2ee7dba481ee794f4b5d060bf260ce922ad4c409648d2d9a67abf1fd','90000000-0000-4000-8000-000000000003','00000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000002',2026,'en','approved','public','The Software Engineering curriculum emphasizes agile methodologies, software architecture, and a capstone team project in the final year.',NULL,'processed'),
('70000000-0000-4000-8000-000000000019','Scholarship Opportunities Guide 2026','Overview of merit-based, need-based, and specialized scholarships available to students at Ethiopian universities.','document','application/pdf','pdf','scholarship_opportunities_guide_2026.pdf',1950000,'local','educational-resources','dev/resources/expansion/scholarship_opportunities_guide_2026.pdf','970cfd3cc8e22881f134dfe9b466f9ad05a26a3f5adc0fb966a5180bdc25b487','90000000-0000-4000-8000-000000000005','00000000-0000-4000-8000-000000000001',NULL,NULL,NULL,2026,'en','approved','public','This guide summarizes eligibility and application procedures for merit, need-based, STEM, and postgraduate research scholarships available in 2026.',NULL,'processed'),
('70000000-0000-4000-8000-000000000020','Data Structures and Algorithms Lecture Notes','Lecture notes covering arrays, linked lists, trees, graphs, sorting, and algorithmic complexity analysis.','document','application/pdf','pdf','data_structures_algorithms_notes.pdf',2750000,'local','educational-resources','dev/resources/expansion/data_structures_algorithms_notes.pdf','fdbeed4db307cf068ef48df9a12730ef90e4de9a550b0350adf9c479322bfd96','90000000-0000-4000-8000-000000000017','00000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001',2026,'en','approved','public','Chapter 3: Binary Search Trees. Chapter 4: Graph Traversal - Breadth First Search and Depth First Search. Chapter 5: Sorting Algorithm Complexity.',NULL,'processed'),
('70000000-0000-4000-8000-000000000021','Introduction to Artificial Intelligence','Introductory textbook-style notes covering search algorithms, knowledge representation, and an overview of machine learning.','ebook','application/epub+zip','epub','introduction_to_ai.epub',5200000,'local','educational-resources','dev/resources/expansion/introduction_to_ai.epub','cf31341d93b06138a8b1a074b18b8ca687ecd0ee85e18056a9f803938d959775','90000000-0000-4000-8000-000000000018','00000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000002',NULL,2026,'en','approved','public','Chapter 1: What is Artificial Intelligence? Chapter 2: Uninformed and Informed Search. Chapter 3: Introduction to Machine Learning Paradigms.',NULL,'processed'),
('70000000-0000-4000-8000-000000000022','GIBIConnect Student Handbook','General student handbook covering registration, code of conduct, grading policy, and support services.','document','application/pdf','pdf','gibiconnect_student_handbook.pdf',2650000,'local','educational-resources','dev/resources/expansion/gibiconnect_student_handbook.pdf','e085b195244b9863e92406b3a325d19721d3dd16aaa0f175ca8abfb10696c1bb','90000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001',NULL,NULL,NULL,2026,'en','approved','public','Section 4: Grading Policy. Grades are assigned on a 4.0 scale. Section 7: Student Support Services including counseling and disability accommodations.',NULL,'processed'),
('70000000-0000-4000-8000-000000000023','Academic Regulations and Examination Policy','Institutional policy document governing examinations, academic integrity, and grade appeals.','document','application/pdf','pdf','academic_regulations_examination_policy.pdf',1780000,'local','educational-resources','dev/resources/expansion/academic_regulations_examination_policy.pdf','56b69fd8fd7be86745f0ebbe94176dae6550da93545e1f0cbabf737be0c5281d','90000000-0000-4000-8000-000000000006','00000000-0000-4000-8000-000000000003',NULL,NULL,NULL,2026,'en','approved','restricted','Article 12: Examination Conduct. Article 15: Academic Integrity Violations and Sanctions. Article 20: Grade Appeal Procedure.',NULL,'processed'),
('70000000-0000-4000-8000-000000000024','Computing Careers Guide','Guide to career paths available to computing and information technology graduates in Ethiopia.','document','application/pdf','pdf','computing_careers_guide.pdf',1600000,'local','educational-resources','dev/resources/expansion/computing_careers_guide.pdf','474fe6e12fa1ac667f3d0b29e9f2e9561cbb3eaabb5025122a5d59086771a6eb','90000000-0000-4000-8000-000000000018','00000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000002',NULL,2026,'en','approved','public','Career Path 1: Software Development. Career Path 2: Data Science and Analytics. Career Path 3: Cybersecurity and Cloud Engineering.',NULL,'processed'),
('70000000-0000-4000-8000-000000000025','Introduction to Database Systems Lecture Notes','Lecture notes on relational database design, SQL, normalization, and PostgreSQL indexing.','document','application/pdf','pdf','database_systems_lecture_notes.pdf',2300000,'local','educational-resources','dev/resources/expansion/database_systems_lecture_notes.pdf','715cb6a64a960adfe79a0fd12007968e8ca5c47e2d081f6157b0512a03694583','90000000-0000-4000-8000-000000000017','00000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001',2026,'en','pending','public','Lecture 5: Normalization up to Third Normal Form. Lecture 8: PostgreSQL Index Types - B-Tree, GIN, and GiST.',NULL,'processed'),
('70000000-0000-4000-8000-000000000026','Public Health Fieldwork Manual','Field practicum manual for public health students conducting community health assessments.','document','application/pdf','pdf','public_health_fieldwork_manual.pdf',3400000,'local','educational-resources','dev/resources/expansion/public_health_fieldwork_manual.pdf','ffd09041efac2ca299bf10b2ac06eecef42a0b8c959460621983615334415b66','90000000-0000-4000-8000-000000000019','00000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000013',NULL,NULL,2026,'en','approved','restricted','Module 2: Community Health Needs Assessment. Module 5: Maternal and Child Health Indicators in Rural Ethiopia.',NULL,'processed'),
('70000000-0000-4000-8000-000000000027','Renewable Energy Systems in Ethiopia: Lecture Slides','Presentation slides covering solar, wind, and hydro renewable energy systems relevant to the Ethiopian grid.','presentation','application/vnd.openxmlformats-officedocument.presentationml.presentation','pptx','renewable_energy_systems_slides.pptx',8700000,'local','educational-resources','dev/resources/expansion/renewable_energy_systems_slides.pptx','cf16b915817335e2fb99cefbcc52f85d7c0fb2a1d27b1164a4f05665a685c66f','90000000-0000-4000-8000-000000000020','00000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000020','20000000-0000-4000-8000-000000000044',NULL,2026,'en','approved','public','Slide 4: Solar Irradiance Potential Across Ethiopian Regions. Slide 9: Hybrid Mini-Grid Design Considerations.',NULL,'processed'),
('70000000-0000-4000-8000-000000000028','Agricultural Extension Practices Handbook','Practical handbook for agricultural extension workers supporting smallholder farmers.','ebook','application/epub+zip','epub','agricultural_extension_handbook.epub',4100000,'local','educational-resources','dev/resources/expansion/agricultural_extension_handbook.epub','033a2785620d44994c9bafdd8dbb627f18784bb5f28557a5cd90f5c1e18c6c45','90000000-0000-4000-8000-000000000005','00000000-0000-4000-8000-000000000011','10000000-0000-4000-8000-000000000031','20000000-0000-4000-8000-000000000069',NULL,2025,'en','approved','public','Chapter 2: Extension Communication Methods. Chapter 6: Integrated Pest Management for Smallholder Farms.',NULL,'processed'),
('70000000-0000-4000-8000-000000000029','Cybersecurity Fundamentals Workshop Slides','Workshop slide deck introducing network security, cryptography basics, and secure coding practices.','presentation','application/vnd.openxmlformats-officedocument.presentationml.presentation','pptx','cybersecurity_fundamentals_slides.pptx',6300000,'local','educational-resources','dev/resources/expansion/cybersecurity_fundamentals_slides.pptx','3ae0a0b21666a733417e30fccb6d87ca96f9f60a7524d085c67c3433f2779270','90000000-0000-4000-8000-000000000018','00000000-0000-4000-8000-000000000008','10000000-0000-4000-8000-000000000025','20000000-0000-4000-8000-000000000055',NULL,2026,'en','archived','restricted','Slide 3: Symmetric vs Asymmetric Encryption. Slide 11: Common Web Application Vulnerabilities (OWASP Top 10).',NULL,'processed'),
('70000000-0000-4000-8000-000000000030','Entrepreneurship and Innovation Guide','Guide for student entrepreneurs on business model design, pitching, and university innovation-hub resources.','document','application/vnd.openxmlformats-officedocument.wordprocessingml.document','docx','entrepreneurship_innovation_guide.docx',1500000,'local','educational-resources','dev/resources/expansion/entrepreneurship_innovation_guide.docx','c6674d28462e1bfd52291d908c818715cc9b583196b0ea491eaebeeaba499acc','90000000-0000-4000-8000-000000000006','00000000-0000-4000-8000-000000000001',NULL,NULL,NULL,2026,'en','rejected','public','Section 1: Business Model Canvas. Section 3: Pitching to University Innovation Hub Panels.',NULL,'processed'),
('70000000-0000-4000-8000-000000000031','Video Lecture: Web Development with PostgreSQL','Recorded lecture walking through building a full-stack web application backed by PostgreSQL.','video','video/mp4','mp4','web_development_postgresql_lecture.mp4',210000000,'local','educational-resources','dev/resources/expansion/web_development_postgresql_lecture.mp4','4ad9195b935f7db6207637689c087e02d36a5ac386c4a19b82f3764308a79b37','90000000-0000-4000-8000-000000000017','00000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000002',2026,'en','approved','public',NULL,'Instructor: Today we connect an Express backend to a PostgreSQL database and implement parameterized queries to prevent SQL injection.','processed'),
('70000000-0000-4000-8000-000000000032','Podcast: Careers in Data Science','Podcast episode interviewing Ethiopian data professionals about entry paths into data science careers.','audio','audio/mp4','m4a','careers_in_data_science_podcast.m4a',28000000,'local','educational-resources','dev/resources/expansion/careers_in_data_science_podcast.m4a','05feb8f489353433b7183b4a883f9b3ea91052a22d6910a69fbf354bd249c3b5','90000000-0000-4000-8000-000000000005','00000000-0000-4000-8000-000000000008','10000000-0000-4000-8000-000000000025','20000000-0000-4000-8000-000000000055',NULL,2026,'en','approved','public',NULL,'Host: What does a typical day look like for a data scientist working on agricultural yield prediction models in Ethiopia?','processed'),
('70000000-0000-4000-8000-000000000033','Machine Learning Research in Ethiopia: A Comprehensive Survey','Survey paper reviewing the state of machine learning research output across Ethiopian universities from 2018-2026.','research','application/pdf','pdf','ml_research_ethiopia_survey.pdf',3300000,'local','educational-resources','dev/resources/expansion/ml_research_ethiopia_survey.pdf','cbdf3a8669d644088289472bd7510f2a0384b6b033c8ecda49f71c9079a40780','90000000-0000-4000-8000-000000000018','00000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000002',2026,'en','approved','public','Abstract: We systematically review 210 machine learning publications originating from Ethiopian institutions, identifying dominant research themes of agriculture, health, and language processing.',NULL,'processed'),
('70000000-0000-4000-8000-000000000034','Amharic Automatic Speech Recognition Using Transformer Architectures','Journal article presenting a transformer-based automatic speech recognition system for Amharic broadcast audio.','research','application/pdf','pdf','amharic_asr_transformers.pdf',2900000,'local','educational-resources','dev/resources/expansion/amharic_asr_transformers.pdf','10fd721a9874864d2c77ba650a5bf757b700660c8924dead9f6cabd39a5ee070','90000000-0000-4000-8000-000000000017','00000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001',2026,'en','approved','public','Abstract: We introduce a transformer-based ASR system for Amharic achieving a 12.3% word error rate on broadcast news audio, outperforming prior HMM-based baselines.',NULL,'processed'),
('70000000-0000-4000-8000-000000000035','Rural Microgrid Reliability: A Conference Case Study from Southern Ethiopia','Conference paper reporting reliability metrics of solar-battery microgrids deployed in the SNNPR region.','research','application/pdf','pdf','rural_microgrid_reliability_case_study.pdf',2450000,'local','educational-resources','dev/resources/expansion/rural_microgrid_reliability_case_study.pdf','b082d5ce92d5c39646c71adc3881fff27901cbbc1d69e5e7773ce8eac53aab47','90000000-0000-4000-8000-000000000020','00000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000020','20000000-0000-4000-8000-000000000044',NULL,2026,'en','approved','public','Abstract: We report 18 months of operational reliability data from six solar-battery microgrids in Southern Ethiopia, identifying battery degradation as the primary failure mode.',NULL,'processed'),
('70000000-0000-4000-8000-000000000036','Educational Technology Adoption in Ethiopian Higher Education','Master''s thesis examining factors influencing e-learning platform adoption among Ethiopian university instructors.','research','application/pdf','pdf','edtech_adoption_ethiopia_thesis.pdf',6100000,'local','educational-resources','dev/resources/expansion/edtech_adoption_ethiopia_thesis.pdf','238e5606c0097bc02df5bbd9a821d1685a0846d017dffc7ce4b73bcb3615a248','90000000-0000-4000-8000-000000000007','00000000-0000-4000-8000-000000000005',NULL,NULL,NULL,2025,'en','pending','restricted','Thesis Abstract: Using a mixed-methods survey of 340 instructors across four universities, this study identifies digital literacy and institutional support as the strongest predictors of e-learning adoption.',NULL,'processed'),
('70000000-0000-4000-8000-000000000037','Cybersecurity Threat Landscape in Ethiopian Financial Institutions','Doctoral dissertation analyzing cybersecurity incident patterns reported by Ethiopian banks and microfinance institutions.','research','application/pdf','pdf','cybersecurity_threat_landscape_dissertation.pdf',9800000,'local','educational-resources','dev/resources/expansion/cybersecurity_threat_landscape_dissertation.pdf','375c51f7b2c2098693aca631d6205e3846ea327b1c7e7d63d119701fc071a434','90000000-0000-4000-8000-000000000018','00000000-0000-4000-8000-000000000008','10000000-0000-4000-8000-000000000025','20000000-0000-4000-8000-000000000055',NULL,2026,'en','approved','restricted','Dissertation Abstract: Drawing on incident reports from twelve financial institutions, this dissertation characterizes the evolving cybersecurity threat landscape and proposes a sector-specific risk framework.',NULL,'processed'),
('70000000-0000-4000-8000-000000000038','Artificial Intelligence in Ethiopian Primary Education: A Pilot Study','Conference paper reporting a pilot deployment of an AI-assisted literacy tutoring tool in five primary schools in Addis Ababa.','research','application/pdf','pdf','ai_primary_education_pilot_study.pdf',2650000,'local','educational-resources','dev/resources/expansion/ai_primary_education_pilot_study.pdf','0c15fbb3db05ea376bd39cb11327e3425557875320d6c0d2c5e02e0e05baa482','90000000-0000-4000-8000-000000000019','00000000-0000-4000-8000-000000000004',NULL,NULL,NULL,2026,'en','approved','public','Abstract: We report results from a 12-week pilot of an AI-assisted Amharic literacy tutor deployed in five primary schools, finding a statistically significant improvement in reading fluency scores.',NULL,'processed')
ON CONFLICT (id) DO NOTHING;

-- E19. Additional Research Metadata
INSERT INTO research (id,resource_id,abstract,research_type,publication_date,publication_year,journal_name,conference_name,doi,keywords,language) VALUES
('80000000-0000-4000-8000-000000000005','70000000-0000-4000-8000-000000000033','We systematically review 210 machine learning publications originating from Ethiopian institutions, identifying dominant research themes of agriculture, health, and language processing.','journal_article','2026-04-15',2026,'Ethiopian Journal of Science and Computing',NULL,'10.1016/j.ejsc.2026.05.021',ARRAY['machine-learning','ethiopia','research-survey','higher-education'],'en'),
('80000000-0000-4000-8000-000000000006','70000000-0000-4000-8000-000000000034','We introduce a transformer-based ASR system for Amharic achieving a 12.3% word error rate on broadcast news audio, outperforming prior HMM-based baselines.','journal_article','2026-04-15',2026,'Ethiopian Journal of Science and Computing',NULL,'10.1016/j.ejsc.2026.06.014',ARRAY['amharic-nlp','speech-recognition','transformers','deep-learning'],'en'),
('80000000-0000-4000-8000-000000000007','70000000-0000-4000-8000-000000000035','We report 18 months of operational reliability data from six solar-battery microgrids in Southern Ethiopia, identifying battery degradation as the primary failure mode.','conference_paper','2026-04-15',2026,NULL,'IEEE PES PowerAfrica 2026','10.1109/pwrafr.2026.0087',ARRAY['microgrids','renewable-energy','reliability','rural-electrification'],'en'),
('80000000-0000-4000-8000-000000000008','70000000-0000-4000-8000-000000000036','Using a mixed-methods survey of 340 instructors across four universities, this study identifies digital literacy and institutional support as the strongest predictors of e-learning adoption.','thesis','2025-04-15',2025,NULL,NULL,NULL,ARRAY['edtech','e-learning','higher-education','technology-adoption'],'en'),
('80000000-0000-4000-8000-000000000009','70000000-0000-4000-8000-000000000037','Drawing on incident reports from twelve financial institutions, this dissertation characterizes the evolving cybersecurity threat landscape and proposes a sector-specific risk framework.','dissertation','2026-04-15',2026,NULL,NULL,'10.1109/diss.2026.2077',ARRAY['cybersecurity','financial-sector','risk-assessment','threat-intelligence'],'en'),
('80000000-0000-4000-8000-000000000010','70000000-0000-4000-8000-000000000038','We report results from a 12-week pilot of an AI-assisted Amharic literacy tutor deployed in five primary schools, finding a statistically significant improvement in reading fluency scores.','conference_paper','2026-04-15',2026,NULL,'Pan-African Conference on Educational Technology 2026','10.1109/pacet.2026.0033',ARRAY['artificial-intelligence','primary-education','amharic-nlp','literacy'],'en')
ON CONFLICT (id) DO NOTHING;

-- E20. Additional Research Authors Links
INSERT INTO research_authors (research_id,author_id,author_order,is_corresponding) VALUES
('80000000-0000-4000-8000-000000000005','aa000000-0000-4000-8000-000000000006',1,true),
('80000000-0000-4000-8000-000000000005','aa000000-0000-4000-8000-000000000014',2,false),
('80000000-0000-4000-8000-000000000006','aa000000-0000-4000-8000-000000000005',1,true),
('80000000-0000-4000-8000-000000000006','aa000000-0000-4000-8000-000000000001',2,false),
('80000000-0000-4000-8000-000000000007','aa000000-0000-4000-8000-000000000008',1,true),
('80000000-0000-4000-8000-000000000008','aa000000-0000-4000-8000-000000000012',1,true),
('80000000-0000-4000-8000-000000000009','aa000000-0000-4000-8000-000000000006',1,true),
('80000000-0000-4000-8000-000000000009','aa000000-0000-4000-8000-000000000009',2,false),
('80000000-0000-4000-8000-000000000010','aa000000-0000-4000-8000-000000000007',1,true),
('80000000-0000-4000-8000-000000000010','aa000000-0000-4000-8000-000000000010',2,false)
ON CONFLICT DO NOTHING;

-- E21. Additional Resource-Category Links
INSERT INTO resource_categories (resource_id,category_id) VALUES
('70000000-0000-4000-8000-000000000015','ca000000-0000-4000-8000-000000000009'),
('70000000-0000-4000-8000-000000000016','ca000000-0000-4000-8000-000000000009'),
('70000000-0000-4000-8000-000000000017','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000018','ca000000-0000-4000-8000-000000000002'),
('70000000-0000-4000-8000-000000000019','ca000000-0000-4000-8000-000000000008'),
('70000000-0000-4000-8000-000000000020','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000021','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000022','ca000000-0000-4000-8000-000000000009'),
('70000000-0000-4000-8000-000000000023','ca000000-0000-4000-8000-000000000010'),
('70000000-0000-4000-8000-000000000024','ca000000-0000-4000-8000-000000000009'),
('70000000-0000-4000-8000-000000000024','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000025','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000026','ca000000-0000-4000-8000-000000000004'),
('70000000-0000-4000-8000-000000000027','ca000000-0000-4000-8000-000000000003'),
('70000000-0000-4000-8000-000000000028','ca000000-0000-4000-8000-000000000005'),
('70000000-0000-4000-8000-000000000029','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000030','ca000000-0000-4000-8000-000000000009'),
('70000000-0000-4000-8000-000000000031','ca000000-0000-4000-8000-000000000002'),
('70000000-0000-4000-8000-000000000032','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000033','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000033','ca000000-0000-4000-8000-000000000007'),
('70000000-0000-4000-8000-000000000034','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000034','ca000000-0000-4000-8000-000000000007'),
('70000000-0000-4000-8000-000000000035','ca000000-0000-4000-8000-000000000003'),
('70000000-0000-4000-8000-000000000035','ca000000-0000-4000-8000-000000000007'),
('70000000-0000-4000-8000-000000000036','ca000000-0000-4000-8000-000000000007'),
('70000000-0000-4000-8000-000000000037','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000037','ca000000-0000-4000-8000-000000000007'),
('70000000-0000-4000-8000-000000000038','ca000000-0000-4000-8000-000000000007')
ON CONFLICT DO NOTHING;

-- E22. Additional Resource-Tag Links
INSERT INTO resource_tags (resource_id,tag_id) VALUES
('70000000-0000-4000-8000-000000000015','ba000000-0000-4000-8000-000000000020'),
('70000000-0000-4000-8000-000000000015','ba000000-0000-4000-8000-000000000008'),
('70000000-0000-4000-8000-000000000016','ba000000-0000-4000-8000-000000000020'),
('70000000-0000-4000-8000-000000000017','ba000000-0000-4000-8000-000000000022'),
('70000000-0000-4000-8000-000000000017','ba000000-0000-4000-8000-000000000007'),
('70000000-0000-4000-8000-000000000018','ba000000-0000-4000-8000-000000000022'),
('70000000-0000-4000-8000-000000000019','ba000000-0000-4000-8000-000000000021'),
('70000000-0000-4000-8000-000000000019','ba000000-0000-4000-8000-000000000020'),
('70000000-0000-4000-8000-000000000020','ba000000-0000-4000-8000-000000000018'),
('70000000-0000-4000-8000-000000000020','ba000000-0000-4000-8000-000000000003'),
('70000000-0000-4000-8000-000000000021','ba000000-0000-4000-8000-000000000002'),
('70000000-0000-4000-8000-000000000021','ba000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000022','ba000000-0000-4000-8000-000000000008'),
('70000000-0000-4000-8000-000000000023','ba000000-0000-4000-8000-000000000008'),
('70000000-0000-4000-8000-000000000024','ba000000-0000-4000-8000-000000000022'),
('70000000-0000-4000-8000-000000000025','ba000000-0000-4000-8000-000000000010'),
('70000000-0000-4000-8000-000000000025','ba000000-0000-4000-8000-000000000017'),
('70000000-0000-4000-8000-000000000026','ba000000-0000-4000-8000-000000000008'),
('70000000-0000-4000-8000-000000000027','ba000000-0000-4000-8000-000000000023'),
('70000000-0000-4000-8000-000000000028','ba000000-0000-4000-8000-000000000008'),
('70000000-0000-4000-8000-000000000029','ba000000-0000-4000-8000-000000000015'),
('70000000-0000-4000-8000-000000000030','ba000000-0000-4000-8000-000000000008'),
('70000000-0000-4000-8000-000000000031','ba000000-0000-4000-8000-000000000010'),
('70000000-0000-4000-8000-000000000031','ba000000-0000-4000-8000-000000000019'),
('70000000-0000-4000-8000-000000000032','ba000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000033','ba000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000033','ba000000-0000-4000-8000-000000000023'),
('70000000-0000-4000-8000-000000000034','ba000000-0000-4000-8000-000000000014'),
('70000000-0000-4000-8000-000000000034','ba000000-0000-4000-8000-000000000012'),
('70000000-0000-4000-8000-000000000035','ba000000-0000-4000-8000-000000000023'),
('70000000-0000-4000-8000-000000000036','ba000000-0000-4000-8000-000000000008'),
('70000000-0000-4000-8000-000000000037','ba000000-0000-4000-8000-000000000015'),
('70000000-0000-4000-8000-000000000038','ba000000-0000-4000-8000-000000000002'),
('70000000-0000-4000-8000-000000000038','ba000000-0000-4000-8000-000000000014')
ON CONFLICT DO NOTHING;

-- E23. Additional Bookmarks
INSERT INTO resource_bookmarks (user_id,resource_id) VALUES
('90000000-0000-4000-8000-000000000007','70000000-0000-4000-8000-000000000021'),
('90000000-0000-4000-8000-000000000007','70000000-0000-4000-8000-000000000010'),
('90000000-0000-4000-8000-000000000008','70000000-0000-4000-8000-000000000007'),
('90000000-0000-4000-8000-000000000008','70000000-0000-4000-8000-000000000024'),
('90000000-0000-4000-8000-000000000009','70000000-0000-4000-8000-000000000006'),
('90000000-0000-4000-8000-000000000009','70000000-0000-4000-8000-000000000028'),
('90000000-0000-4000-8000-000000000010','70000000-0000-4000-8000-000000000038'),
('90000000-0000-4000-8000-000000000010','70000000-0000-4000-8000-000000000028'),
('90000000-0000-4000-8000-000000000011','70000000-0000-4000-8000-000000000026'),
('90000000-0000-4000-8000-000000000011','70000000-0000-4000-8000-000000000004'),
('90000000-0000-4000-8000-000000000012','70000000-0000-4000-8000-000000000019'),
('90000000-0000-4000-8000-000000000012','70000000-0000-4000-8000-000000000027'),
('90000000-0000-4000-8000-000000000013','70000000-0000-4000-8000-000000000038'),
('90000000-0000-4000-8000-000000000013','70000000-0000-4000-8000-000000000012'),
('90000000-0000-4000-8000-000000000014','70000000-0000-4000-8000-000000000038'),
('90000000-0000-4000-8000-000000000014','70000000-0000-4000-8000-000000000005'),
('90000000-0000-4000-8000-000000000015','70000000-0000-4000-8000-000000000028'),
('90000000-0000-4000-8000-000000000015','70000000-0000-4000-8000-000000000021'),
('90000000-0000-4000-8000-000000000016','70000000-0000-4000-8000-000000000012'),
('90000000-0000-4000-8000-000000000016','70000000-0000-4000-8000-000000000016')
ON CONFLICT DO NOTHING;

-- E24. Additional Resource Views (no ON CONFLICT: plain analytics events)
INSERT INTO resource_views (resource_id,user_id,ip_hash) VALUES
('70000000-0000-4000-8000-000000000026','90000000-0000-4000-8000-000000000007','devhash1709048079070508'),
('70000000-0000-4000-8000-000000000004','90000000-0000-4000-8000-000000000007','devhash2785509711671516'),
('70000000-0000-4000-8000-000000000005','90000000-0000-4000-8000-000000000007','devhash6367604602244867'),
('70000000-0000-4000-8000-000000000004','90000000-0000-4000-8000-000000000008','devhash1248781032366744'),
('70000000-0000-4000-8000-000000000035','90000000-0000-4000-8000-000000000008','devhash3622336705528656'),
('70000000-0000-4000-8000-000000000014','90000000-0000-4000-8000-000000000008','devhash3330210752425244'),
('70000000-0000-4000-8000-000000000027','90000000-0000-4000-8000-000000000009','devhash5397498179646248'),
('70000000-0000-4000-8000-000000000005','90000000-0000-4000-8000-000000000009','devhash3414857640936550'),
('70000000-0000-4000-8000-000000000016','90000000-0000-4000-8000-000000000009','devhash6552161938456475'),
('70000000-0000-4000-8000-000000000004','90000000-0000-4000-8000-000000000010','devhash6072975509792195'),
('70000000-0000-4000-8000-000000000008','90000000-0000-4000-8000-000000000010','devhash0340974697083324'),
('70000000-0000-4000-8000-000000000015','90000000-0000-4000-8000-000000000010','devhash4893402599585616'),
('70000000-0000-4000-8000-000000000015','90000000-0000-4000-8000-000000000011','devhash7635941370260286'),
('70000000-0000-4000-8000-000000000003','90000000-0000-4000-8000-000000000011','devhash1690930504877566'),
('70000000-0000-4000-8000-000000000038','90000000-0000-4000-8000-000000000011','devhash6523910869193642'),
('70000000-0000-4000-8000-000000000010','90000000-0000-4000-8000-000000000012','devhash1466301349340130'),
('70000000-0000-4000-8000-000000000037','90000000-0000-4000-8000-000000000012','devhash9512495178634186'),
('70000000-0000-4000-8000-000000000008','90000000-0000-4000-8000-000000000012','devhash5041795496230583'),
('70000000-0000-4000-8000-000000000007','90000000-0000-4000-8000-000000000013','devhash7632726240323776'),
('70000000-0000-4000-8000-000000000013','90000000-0000-4000-8000-000000000013','devhash6922933719977235'),
('70000000-0000-4000-8000-000000000024','90000000-0000-4000-8000-000000000013','devhash6935864755139216'),
('70000000-0000-4000-8000-000000000004','90000000-0000-4000-8000-000000000014','devhash5927311458438666'),
('70000000-0000-4000-8000-000000000014','90000000-0000-4000-8000-000000000014','devhash6868903336314625'),
('70000000-0000-4000-8000-000000000034','90000000-0000-4000-8000-000000000014','devhash3569818568285381'),
('70000000-0000-4000-8000-000000000032','90000000-0000-4000-8000-000000000015','devhash4828382765564639'),
('70000000-0000-4000-8000-000000000024','90000000-0000-4000-8000-000000000015','devhash5730711292200889'),
('70000000-0000-4000-8000-000000000020','90000000-0000-4000-8000-000000000015','devhash2057556917105594'),
('70000000-0000-4000-8000-000000000006','90000000-0000-4000-8000-000000000016','devhash0941243044349880'),
('70000000-0000-4000-8000-000000000020','90000000-0000-4000-8000-000000000016','devhash8097492045633734'),
('70000000-0000-4000-8000-000000000036','90000000-0000-4000-8000-000000000016','devhash9144516829167626');

-- E25. Additional Resource Downloads
INSERT INTO resource_downloads (resource_id,user_id,ip_hash) VALUES
('70000000-0000-4000-8000-000000000037','90000000-0000-4000-8000-000000000007','devhash3828539555466532'),
('70000000-0000-4000-8000-000000000003','90000000-0000-4000-8000-000000000008','devhash8266427881150235'),
('70000000-0000-4000-8000-000000000006','90000000-0000-4000-8000-000000000009','devhash3899019991235975'),
('70000000-0000-4000-8000-000000000004','90000000-0000-4000-8000-000000000010','devhash1065245975550025'),
('70000000-0000-4000-8000-000000000009','90000000-0000-4000-8000-000000000011','devhash4757296118049945'),
('70000000-0000-4000-8000-000000000020','90000000-0000-4000-8000-000000000012','devhash0047722672309128'),
('70000000-0000-4000-8000-000000000007','90000000-0000-4000-8000-000000000013','devhash9588110908287959'),
('70000000-0000-4000-8000-000000000037','90000000-0000-4000-8000-000000000014','devhash6263350860663452'),
('70000000-0000-4000-8000-000000000016','90000000-0000-4000-8000-000000000015','devhash6013580333423694'),
('70000000-0000-4000-8000-000000000034','90000000-0000-4000-8000-000000000016','devhash7700732025100263');

-- E26. Additional Resource Reports
INSERT INTO resource_reports (id,resource_id,reporter_id,reason,description,status,reviewed_by,reviewed_at,notes) VALUES
('60000000-0000-4000-8000-000000000002','70000000-0000-4000-8000-000000000018','90000000-0000-4000-8000-000000000008','copyright','This slide deck references outdated licensing terms that need review.','pending',NULL,NULL,NULL),
('60000000-0000-4000-8000-000000000003','70000000-0000-4000-8000-000000000020','90000000-0000-4000-8000-000000000009','duplicate','This appears to duplicate an existing lecture-notes resource.','resolved','90000000-0000-4000-8000-000000000005',now(),'Confirmed distinct scope; report closed with no action.'),
('60000000-0000-4000-8000-000000000004','70000000-0000-4000-8000-000000000006','90000000-0000-4000-8000-000000000010','broken_file','Video file fails to play past the ten minute mark.','reviewed','90000000-0000-4000-8000-000000000001',now(),'Re-encoded and re-uploaded; issue resolved.'),
('60000000-0000-4000-8000-000000000005','70000000-0000-4000-8000-000000000023','90000000-0000-4000-8000-000000000007','other','Please double check the cited tuition figures for accuracy.','pending',NULL,NULL,NULL)
ON CONFLICT (id) DO NOTHING;

-- E27. Development AI Conversation Scenarios
INSERT INTO ai_conversations (id,user_id,institution_context_id,title) VALUES
('c1000000-0000-4000-8000-000000000001','90000000-0000-4000-8000-000000000007',NULL,'Universities offering Computer Science'),
('c1000000-0000-4000-8000-000000000002','90000000-0000-4000-8000-000000000008','00000000-0000-4000-8000-000000000002','Software Engineering admission requirements'),
('c1000000-0000-4000-8000-000000000003','90000000-0000-4000-8000-000000000009',NULL,'Scholarships for AI students'),
('c1000000-0000-4000-8000-000000000004','90000000-0000-4000-8000-000000000010','00000000-0000-4000-8000-000000000001','Computer Science tuition'),
('c1000000-0000-4000-8000-000000000005','90000000-0000-4000-8000-000000000011',NULL,'Machine learning research resources')
ON CONFLICT (id) DO NOTHING;

-- E28. Development AI Messages
INSERT INTO ai_messages (id,conversation_id,role,content) VALUES
('c2000000-0000-4000-8000-000000000001','c1000000-0000-4000-8000-000000000001','user','What universities in Ethiopia offer Computer Science?'),
('c2000000-0000-4000-8000-000000000002','c1000000-0000-4000-8000-000000000001','assistant','Several public universities offer Computer Science, including Addis Ababa University, Bahir Dar University (School of Computing), Jimma University, and Adama Science and Technology University. Would you like admission requirements or tuition details for any of these?'),
('c2000000-0000-4000-8000-000000000003','c1000000-0000-4000-8000-000000000002','user','What are the admission requirements for Software Engineering at Bahir Dar University?'),
('c2000000-0000-4000-8000-000000000004','c1000000-0000-4000-8000-000000000002','assistant','Bahir Dar University''s Software Engineering program requires the Ethiopian Higher Education Entrance Examination result meeting the national cutoff for the natural science stream, along with a completed application through the central placement or direct admission portal.'),
('c2000000-0000-4000-8000-000000000005','c1000000-0000-4000-8000-000000000003','user','Are there scholarships for students studying artificial intelligence?'),
('c2000000-0000-4000-8000-000000000006','c1000000-0000-4000-8000-000000000003','assistant','Yes — the AI and Data Science Talent Award supports students in Computer Science, Data Science, and related programs at Addis Ababa University, Bahir Dar University, and Adama Science and Technology University. There is also a Postgraduate Research Fellowship for master''s and PhD research in priority areas including AI.'),
('70000000-0000-4000-8000-000000000036','Educational Technology Adoption in Ethiopian Higher Education','Master''s thesis examining factors influencing e-learning platform adoption among Ethiopian university instructors.','research','application/pdf','pdf','edtech_adoption_ethiopia_thesis.pdf',6100000,'local','educational-resources','dev/resources/expansion/edtech_adoption_ethiopia_thesis.pdf','238e5606c0097bc02df5bbd9a821d1685a0846d017dffc7ce4b73bcb3615a248','90000000-0000-4000-8000-000000000007','00000000-0000-4000-8000-000000000005',NULL,NULL,NULL,2025,'en','pending','restricted','Thesis Abstract: Using a mixed-methods survey of 340 instructors across four universities, this study identifies digital literacy and institutional support as the strongest predictors of e-learning adoption.',NULL,'processed'),
('70000000-0000-4000-8000-000000000037','Cybersecurity Threat Landscape in Ethiopian Financial Institutions','Doctoral dissertation analyzing cybersecurity incident patterns reported by Ethiopian banks and microfinance institutions.','research','application/pdf','pdf','cybersecurity_threat_landscape_dissertation.pdf',9800000,'local','educational-resources','dev/resources/expansion/cybersecurity_threat_landscape_dissertation.pdf','375c51f7b2c2098693aca631d6205e3846ea327b1c7e7d63d119701fc071a434','90000000-0000-4000-8000-000000000018','00000000-0000-4000-8000-000000000008','10000000-0000-4000-8000-000000000025','20000000-0000-4000-8000-000000000055',NULL,2026,'en','approved','restricted','Dissertation Abstract: Drawing on incident reports from twelve financial institutions, this dissertation characterizes the evolving cybersecurity threat landscape and proposes a sector-specific risk framework.',NULL,'processed'),
('70000000-0000-4000-8000-000000000038','Artificial Intelligence in Ethiopian Primary Education: A Pilot Study','Conference paper reporting a pilot deployment of an AI-assisted literacy tutoring tool in five primary schools in Addis Ababa.','research','application/pdf','pdf','ai_primary_education_pilot_study.pdf',2650000,'local','educational-resources','dev/resources/expansion/ai_primary_education_pilot_study.pdf','0c15fbb3db05ea376bd39cb11327e3425557875320d6c0d2c5e02e0e05baa482','90000000-0000-4000-8000-000000000019','00000000-0000-4000-8000-000000000004',NULL,NULL,NULL,2026,'en','approved','public','Abstract: We report results from a 12-week pilot of an AI-assisted Amharic literacy tutor deployed in five primary schools, finding a statistically significant improvement in reading fluency scores.',NULL,'processed')
ON CONFLICT (id) DO NOTHING;

-- E19. Additional Research Metadata
INSERT INTO research (id,resource_id,abstract,research_type,publication_date,publication_year,journal_name,conference_name,doi,keywords,language) VALUES
('80000000-0000-4000-8000-000000000005','70000000-0000-4000-8000-000000000033','We systematically review 210 machine learning publications originating from Ethiopian institutions, identifying dominant research themes of agriculture, health, and language processing.','journal_article','2026-04-15',2026,'Ethiopian Journal of Science and Computing',NULL,'10.1016/j.ejsc.2026.05.021',ARRAY['machine-learning','ethiopia','research-survey','higher-education'],'en'),
('80000000-0000-4000-8000-000000000006','70000000-0000-4000-8000-000000000034','We introduce a transformer-based ASR system for Amharic achieving a 12.3% word error rate on broadcast news audio, outperforming prior HMM-based baselines.','journal_article','2026-04-15',2026,'Ethiopian Journal of Science and Computing',NULL,'10.1016/j.ejsc.2026.06.014',ARRAY['amharic-nlp','speech-recognition','transformers','deep-learning'],'en'),
('80000000-0000-4000-8000-000000000007','70000000-0000-4000-8000-000000000035','We report 18 months of operational reliability data from six solar-battery microgrids in Southern Ethiopia, identifying battery degradation as the primary failure mode.','conference_paper','2026-04-15',2026,NULL,'IEEE PES PowerAfrica 2026','10.1109/pwrafr.2026.0087',ARRAY['microgrids','renewable-energy','reliability','rural-electrification'],'en'),
('80000000-0000-4000-8000-000000000008','70000000-0000-4000-8000-000000000036','Using a mixed-methods survey of 340 instructors across four universities, this study identifies digital literacy and institutional support as the strongest predictors of e-learning adoption.','thesis','2025-04-15',2025,NULL,NULL,NULL,ARRAY['edtech','e-learning','higher-education','technology-adoption'],'en'),
('80000000-0000-4000-8000-000000000009','70000000-0000-4000-8000-000000000037','Drawing on incident reports from twelve financial institutions, this dissertation characterizes the evolving cybersecurity threat landscape and proposes a sector-specific risk framework.','dissertation','2026-04-15',2026,NULL,NULL,'10.1109/diss.2026.2077',ARRAY['cybersecurity','financial-sector','risk-assessment','threat-intelligence'],'en'),
('80000000-0000-4000-8000-000000000010','70000000-0000-4000-8000-000000000038','We report results from a 12-week pilot of an AI-assisted Amharic literacy tutor deployed in five primary schools, finding a statistically significant improvement in reading fluency scores.','conference_paper','2026-04-15',2026,NULL,'Pan-African Conference on Educational Technology 2026','10.1109/pacet.2026.0033',ARRAY['artificial-intelligence','primary-education','amharic-nlp','literacy'],'en')
ON CONFLICT (id) DO NOTHING;

-- E20. Additional Research Authors Links
INSERT INTO research_authors (research_id,author_id,author_order,is_corresponding) VALUES
('80000000-0000-4000-8000-000000000005','aa000000-0000-4000-8000-000000000006',1,true),
('80000000-0000-4000-8000-000000000005','aa000000-0000-4000-8000-000000000014',2,false),
('80000000-0000-4000-8000-000000000006','aa000000-0000-4000-8000-000000000005',1,true),
('80000000-0000-4000-8000-000000000006','aa000000-0000-4000-8000-000000000001',2,false),
('80000000-0000-4000-8000-000000000007','aa000000-0000-4000-8000-000000000008',1,true),
('80000000-0000-4000-8000-000000000008','aa000000-0000-4000-8000-000000000012',1,true),
('80000000-0000-4000-8000-000000000009','aa000000-0000-4000-8000-000000000006',1,true),
('80000000-0000-4000-8000-000000000009','aa000000-0000-4000-8000-000000000009',2,false),
('80000000-0000-4000-8000-000000000010','aa000000-0000-4000-8000-000000000007',1,true),
('80000000-0000-4000-8000-000000000010','aa000000-0000-4000-8000-000000000010',2,false)
ON CONFLICT DO NOTHING;

-- E21. Additional Resource-Category Links
INSERT INTO resource_categories (resource_id,category_id) VALUES
('70000000-0000-4000-8000-000000000015','ca000000-0000-4000-8000-000000000009'),
('70000000-0000-4000-8000-000000000016','ca000000-0000-4000-8000-000000000009'),
('70000000-0000-4000-8000-000000000017','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000018','ca000000-0000-4000-8000-000000000002'),
('70000000-0000-4000-8000-000000000019','ca000000-0000-4000-8000-000000000008'),
('70000000-0000-4000-8000-000000000020','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000021','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000022','ca000000-0000-4000-8000-000000000009'),
('70000000-0000-4000-8000-000000000023','ca000000-0000-4000-8000-000000000010'),
('70000000-0000-4000-8000-000000000024','ca000000-0000-4000-8000-000000000009'),
('70000000-0000-4000-8000-000000000024','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000025','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000026','ca000000-0000-4000-8000-000000000004'),
('70000000-0000-4000-8000-000000000027','ca000000-0000-4000-8000-000000000003'),
('70000000-0000-4000-8000-000000000028','ca000000-0000-4000-8000-000000000005'),
('70000000-0000-4000-8000-000000000029','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000030','ca000000-0000-4000-8000-000000000009'),
('70000000-0000-4000-8000-000000000031','ca000000-0000-4000-8000-000000000002'),
('70000000-0000-4000-8000-000000000032','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000033','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000033','ca000000-0000-4000-8000-000000000007'),
('70000000-0000-4000-8000-000000000034','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000034','ca000000-0000-4000-8000-000000000007'),
('70000000-0000-4000-8000-000000000035','ca000000-0000-4000-8000-000000000003'),
('70000000-0000-4000-8000-000000000035','ca000000-0000-4000-8000-000000000007'),
('70000000-0000-4000-8000-000000000036','ca000000-0000-4000-8000-000000000007'),
('70000000-0000-4000-8000-000000000037','ca000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000037','ca000000-0000-4000-8000-000000000007'),
('70000000-0000-4000-8000-000000000038','ca000000-0000-4000-8000-000000000007')
ON CONFLICT DO NOTHING;

-- E22. Additional Resource-Tag Links
INSERT INTO resource_tags (resource_id,tag_id) VALUES
('70000000-0000-4000-8000-000000000015','ba000000-0000-4000-8000-000000000020'),
('70000000-0000-4000-8000-000000000015','ba000000-0000-4000-8000-000000000008'),
('70000000-0000-4000-8000-000000000016','ba000000-0000-4000-8000-000000000020'),
('70000000-0000-4000-8000-000000000017','ba000000-0000-4000-8000-000000000022'),
('70000000-0000-4000-8000-000000000017','ba000000-0000-4000-8000-000000000007'),
('70000000-0000-4000-8000-000000000018','ba000000-0000-4000-8000-000000000022'),
('70000000-0000-4000-8000-000000000019','ba000000-0000-4000-8000-000000000021'),
('70000000-0000-4000-8000-000000000019','ba000000-0000-4000-8000-000000000020'),
('70000000-0000-4000-8000-000000000020','ba000000-0000-4000-8000-000000000018'),
('70000000-0000-4000-8000-000000000020','ba000000-0000-4000-8000-000000000003'),
('70000000-0000-4000-8000-000000000021','ba000000-0000-4000-8000-000000000002'),
('70000000-0000-4000-8000-000000000021','ba000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000022','ba000000-0000-4000-8000-000000000008'),
('70000000-0000-4000-8000-000000000023','ba000000-0000-4000-8000-000000000008'),
('70000000-0000-4000-8000-000000000024','ba000000-0000-4000-8000-000000000022'),
('70000000-0000-4000-8000-000000000025','ba000000-0000-4000-8000-000000000010'),
('70000000-0000-4000-8000-000000000025','ba000000-0000-4000-8000-000000000017'),
('70000000-0000-4000-8000-000000000026','ba000000-0000-4000-8000-000000000008'),
('70000000-0000-4000-8000-000000000027','ba000000-0000-4000-8000-000000000023'),
('70000000-0000-4000-8000-000000000028','ba000000-0000-4000-8000-000000000008'),
('70000000-0000-4000-8000-000000000029','ba000000-0000-4000-8000-000000000015'),
('70000000-0000-4000-8000-000000000030','ba000000-0000-4000-8000-000000000008'),
('70000000-0000-4000-8000-000000000031','ba000000-0000-4000-8000-000000000010'),
('70000000-0000-4000-8000-000000000031','ba000000-0000-4000-8000-000000000019'),
('70000000-0000-4000-8000-000000000032','ba000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000033','ba000000-0000-4000-8000-000000000001'),
('70000000-0000-4000-8000-000000000033','ba000000-0000-4000-8000-000000000023'),
('70000000-0000-4000-8000-000000000034','ba000000-0000-4000-8000-000000000014'),
('70000000-0000-4000-8000-000000000034','ba000000-0000-4000-8000-000000000012'),
('70000000-0000-4000-8000-000000000035','ba000000-0000-4000-8000-000000000023'),
('70000000-0000-4000-8000-000000000036','ba000000-0000-4000-8000-000000000008'),
('70000000-0000-4000-8000-000000000037','ba000000-0000-4000-8000-000000000015'),
('70000000-0000-4000-8000-000000000038','ba000000-0000-4000-8000-000000000002'),
('70000000-0000-4000-8000-000000000038','ba000000-0000-4000-8000-000000000014')
ON CONFLICT DO NOTHING;

-- E23. Additional Bookmarks
INSERT INTO resource_bookmarks (user_id,resource_id) VALUES
('90000000-0000-4000-8000-000000000007','70000000-0000-4000-8000-000000000021'),
('90000000-0000-4000-8000-000000000007','70000000-0000-4000-8000-000000000010'),
('90000000-0000-4000-8000-000000000008','70000000-0000-4000-8000-000000000007'),
('90000000-0000-4000-8000-000000000008','70000000-0000-4000-8000-000000000024'),
('90000000-0000-4000-8000-000000000009','70000000-0000-4000-8000-000000000006'),
('90000000-0000-4000-8000-000000000009','70000000-0000-4000-8000-000000000028'),
('90000000-0000-4000-8000-000000000010','70000000-0000-4000-8000-000000000038'),
('90000000-0000-4000-8000-000000000010','70000000-0000-4000-8000-000000000028'),
('90000000-0000-4000-8000-000000000011','70000000-0000-4000-8000-000000000026'),
('90000000-0000-4000-8000-000000000011','70000000-0000-4000-8000-000000000004'),
('90000000-0000-4000-8000-000000000012','70000000-0000-4000-8000-000000000019'),
('90000000-0000-4000-8000-000000000012','70000000-0000-4000-8000-000000000027'),
('90000000-0000-4000-8000-000000000013','70000000-0000-4000-8000-000000000038'),
('90000000-0000-4000-8000-000000000013','70000000-0000-4000-8000-000000000012'),
('90000000-0000-4000-8000-000000000014','70000000-0000-4000-8000-000000000038'),
('90000000-0000-4000-8000-000000000014','70000000-0000-4000-8000-000000000005'),
('90000000-0000-4000-8000-000000000015','70000000-0000-4000-8000-000000000028'),
('90000000-0000-4000-8000-000000000015','70000000-0000-4000-8000-000000000021'),
('90000000-0000-4000-8000-000000000016','70000000-0000-4000-8000-000000000012'),
('90000000-0000-4000-8000-000000000016','70000000-0000-4000-8000-000000000016')
ON CONFLICT DO NOTHING;

-- E24. Additional Resource Views (no ON CONFLICT: plain analytics events)
INSERT INTO resource_views (resource_id,user_id,ip_hash) VALUES
('70000000-0000-4000-8000-000000000026','90000000-0000-4000-8000-000000000007','devhash1709048079070508'),
('70000000-0000-4000-8000-000000000004','90000000-0000-4000-8000-000000000007','devhash2785509711671516'),
('70000000-0000-4000-8000-000000000005','90000000-0000-4000-8000-000000000007','devhash6367604602244867'),
('70000000-0000-4000-8000-000000000004','90000000-0000-4000-8000-000000000008','devhash1248781032366744'),
('70000000-0000-4000-8000-000000000035','90000000-0000-4000-8000-000000000008','devhash3622336705528656'),
('70000000-0000-4000-8000-000000000014','90000000-0000-4000-8000-000000000008','devhash3330210752425244'),
('70000000-0000-4000-8000-000000000027','90000000-0000-4000-8000-000000000009','devhash5397498179646248'),
('70000000-0000-4000-8000-000000000005','90000000-0000-4000-8000-000000000009','devhash3414857640936550'),
('70000000-0000-4000-8000-000000000016','90000000-0000-4000-8000-000000000009','devhash6552161938456475'),
('70000000-0000-4000-8000-000000000004','90000000-0000-4000-8000-000000000010','devhash6072975509792195'),
('70000000-0000-4000-8000-000000000008','90000000-0000-4000-8000-000000000010','devhash0340974697083324'),
('70000000-0000-4000-8000-000000000015','90000000-0000-4000-8000-000000000010','devhash4893402599585616'),
('70000000-0000-4000-8000-000000000015','90000000-0000-4000-8000-000000000011','devhash7635941370260286'),
('70000000-0000-4000-8000-000000000003','90000000-0000-4000-8000-000000000011','devhash1690930504877566'),
('70000000-0000-4000-8000-000000000038','90000000-0000-4000-8000-000000000011','devhash6523910869193642'),
('70000000-0000-4000-8000-000000000010','90000000-0000-4000-8000-000000000012','devhash1466301349340130'),
('70000000-0000-4000-8000-000000000037','90000000-0000-4000-8000-000000000012','devhash9512495178634186'),
('70000000-0000-4000-8000-000000000008','90000000-0000-4000-8000-000000000012','devhash5041795496230583'),
('70000000-0000-4000-8000-000000000007','90000000-0000-4000-8000-000000000013','devhash7632726240323776'),
('70000000-0000-4000-8000-000000000013','90000000-0000-4000-8000-000000000013','devhash6922933719977235'),
('70000000-0000-4000-8000-000000000024','90000000-0000-4000-8000-000000000013','devhash6935864755139216'),
('70000000-0000-4000-8000-000000000004','90000000-0000-4000-8000-000000000014','devhash5927311458438666'),
('70000000-0000-4000-8000-000000000014','90000000-0000-4000-8000-000000000014','devhash6868903336314625'),
('70000000-0000-4000-8000-000000000034','90000000-0000-4000-8000-000000000014','devhash3569818568285381'),
('70000000-0000-4000-8000-000000000032','90000000-0000-4000-8000-000000000015','devhash4828382765564639'),
('70000000-0000-4000-8000-000000000024','90000000-0000-4000-8000-000000000015','devhash5730711292200889'),
('70000000-0000-4000-8000-000000000020','90000000-0000-4000-8000-000000000015','devhash2057556917105594'),
('70000000-0000-4000-8000-000000000006','90000000-0000-4000-8000-000000000016','devhash0941243044349880'),
('70000000-0000-4000-8000-000000000020','90000000-0000-4000-8000-000000000016','devhash8097492045633734'),
('70000000-0000-4000-8000-000000000036','90000000-0000-4000-8000-000000000016','devhash9144516829167626');

-- E25. Additional Resource Downloads
INSERT INTO resource_downloads (resource_id,user_id,ip_hash) VALUES
('70000000-0000-4000-8000-000000000037','90000000-0000-4000-8000-000000000007','devhash3828539555466532'),
('70000000-0000-4000-8000-000000000003','90000000-0000-4000-8000-000000000008','devhash8266427881150235'),
('70000000-0000-4000-8000-000000000006','90000000-0000-4000-8000-000000000009','devhash3899019991235975'),
('70000000-0000-4000-8000-000000000004','90000000-0000-4000-8000-000000000010','devhash1065245975550025'),
('70000000-0000-4000-8000-000000000009','90000000-0000-4000-8000-000000000011','devhash4757296118049945'),
('70000000-0000-4000-8000-000000000020','90000000-0000-4000-8000-000000000012','devhash0047722672309128'),
('70000000-0000-4000-8000-000000000007','90000000-0000-4000-8000-000000000013','devhash9588110908287959'),
('70000000-0000-4000-8000-000000000037','90000000-0000-4000-8000-000000000014','devhash6263350860663452'),
('70000000-0000-4000-8000-000000000016','90000000-0000-4000-8000-000000000015','devhash6013580333423694'),
('70000000-0000-4000-8000-000000000034','90000000-0000-4000-8000-000000000016','devhash7700732025100263');

-- E26. Additional Resource Reports
INSERT INTO resource_reports (id,resource_id,reporter_id,reason,description,status,reviewed_by,reviewed_at,notes) VALUES
('60000000-0000-4000-8000-000000000002','70000000-0000-4000-8000-000000000018','90000000-0000-4000-8000-000000000008','copyright','This slide deck references outdated licensing terms that need review.','pending',NULL,NULL,NULL),
('60000000-0000-4000-8000-000000000003','70000000-0000-4000-8000-000000000020','90000000-0000-4000-8000-000000000009','duplicate','This appears to duplicate an existing lecture-notes resource.','resolved','90000000-0000-4000-8000-000000000005',now(),'Confirmed distinct scope; report closed with no action.'),
('60000000-0000-4000-8000-000000000004','70000000-0000-4000-8000-000000000006','90000000-0000-4000-8000-000000000010','broken_file','Video file fails to play past the ten minute mark.','reviewed','90000000-0000-4000-8000-000000000001',now(),'Re-encoded and re-uploaded; issue resolved.'),
('60000000-0000-4000-8000-000000000005','70000000-0000-4000-8000-000000000023','90000000-0000-4000-8000-000000000007','other','Please double check the cited tuition figures for accuracy.','pending',NULL,NULL,NULL)
ON CONFLICT (id) DO NOTHING;

-- E27. Development AI Conversation Scenarios
INSERT INTO ai_conversations (id,user_id,institution_context_id,title) VALUES
('c1000000-0000-4000-8000-000000000001','90000000-0000-4000-8000-000000000007',NULL,'Universities offering Computer Science'),
('c1000000-0000-4000-8000-000000000002','90000000-0000-4000-8000-000000000008','00000000-0000-4000-8000-000000000002','Software Engineering admission requirements'),
('c1000000-0000-4000-8000-000000000003','90000000-0000-4000-8000-000000000009',NULL,'Scholarships for AI students'),
('c1000000-0000-4000-8000-000000000004','90000000-0000-4000-8000-000000000010','00000000-0000-4000-8000-000000000001','Computer Science tuition'),
('c1000000-0000-4000-8000-000000000005','90000000-0000-4000-8000-000000000011',NULL,'Machine learning research resources')
ON CONFLICT (id) DO NOTHING;

-- E28. Development AI Messages
INSERT INTO ai_messages (id,conversation_id,role,content) VALUES
('c2000000-0000-4000-8000-000000000001','c1000000-0000-4000-8000-000000000001','user','What universities in Ethiopia offer Computer Science?'),
('c2000000-0000-4000-8000-000000000002','c1000000-0000-4000-8000-000000000001','assistant','Several public universities offer Computer Science, including Addis Ababa University, Bahir Dar University (School of Computing), Jimma University, and Adama Science and Technology University. Would you like admission requirements or tuition details for any of these?'),
('c2000000-0000-4000-8000-000000000003','c1000000-0000-4000-8000-000000000002','user','What are the admission requirements for Software Engineering at Bahir Dar University?'),
('c2000000-0000-4000-8000-000000000004','c1000000-0000-4000-8000-000000000002','assistant','Bahir Dar University''s Software Engineering program requires the Ethiopian Higher Education Entrance Examination result meeting the national cutoff for the natural science stream, along with a completed application through the central placement or direct admission portal.'),
('c2000000-0000-4000-8000-000000000005','c1000000-0000-4000-8000-000000000003','user','Are there scholarships for students studying artificial intelligence?'),
('c2000000-0000-4000-8000-000000000006','c1000000-0000-4000-8000-000000000003','assistant','Yes — the AI and Data Science Talent Award supports students in Computer Science, Data Science, and related programs at Addis Ababa University, Bahir Dar University, and Adama Science and Technology University. There is also a Postgraduate Research Fellowship for master''s and PhD research in priority areas including AI.'),
('c2000000-0000-4000-8000-000000000007','c1000000-0000-4000-8000-000000000004','user','What is the tuition for the Computer Science program at Addis Ababa University?'),
('c2000000-0000-4000-8000-000000000008','c1000000-0000-4000-8000-000000000004','assistant','As a public university, Addis Ababa University''s Computer Science tuition is in the range of public-institution rates for the 2026 academic year. These figures are development/demo estimates — check the tuition_fees table filtered by program for the exact seeded amount.'),
('c2000000-0000-4000-8000-000000000009','c1000000-0000-4000-8000-000000000005','user','Can you find resources about machine learning?'),
('c2000000-0000-4000-8000-000000000010','c1000000-0000-4000-8000-000000000005','assistant','I found several: ''Introduction to Machine Learning Lecture Notes'', ''Machine Learning Research in Ethiopia: A Comprehensive Survey'', and ''Introduction to Artificial Intelligence''. Would you like the direct links or a summary of each?')
ON CONFLICT (id) DO NOTHING;

-- E29. Populate Official University Logos
UPDATE institutions SET logo_url = NULL;
UPDATE institutions SET logo_url = 'assets/logos/astu_logo.png' WHERE name ILIKE '%Adama Science%';

COMMIT;
