-- GIBIConnect Development & Demonstration Seed Data
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

COMMIT;
