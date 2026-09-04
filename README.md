# GIBIConnect

## Educational Information and AI Consultation Platform for Higher Education

---

### 1. Project Overview

**GIBIConnect** is a centralized educational technology platform designed to help students easily access verified institutional information, academic programs, scholarship opportunities, academic resources, and AI-powered consultation services through a unified digital platform.

The primary purpose of GIBIConnect is to resolve the severe information fragmentation students face when searching for reliable higher-education data and making academic decisions in Ethiopia. Students frequently struggle across disconnected websites, outdated portals, and informal social media channels to find basic details regarding university programs, entrance cut-off points, tuition fee structures, and academic calendars. GIBIConnect consolidates these essential services into one organized, accessible, and verified system.

In addition to centralized directories, GIBIConnect features a **grounded AI Academic Consultation System (RAG)** that provides personalized guidance based on a student's questions, interests, and academic goals. The system functions as a digital educational advisor that answers student queries strictly using authoritative database records and verified institutional documents.

The platform is engineered using a robust modern architecture consisting of an **HTML5 + ES Modules + Tailwind CSS frontend, a Node.js + Express.js RESTful API gateway, a PostgreSQL 16 database with pgvector, and a local Ollama AI engine (Llama 3.2 & nomic-embed-text)**.

---

## 2. Problem Statement

Students and academic stakeholders in Ethiopia face critical information bottlenecks:

1. **Fragmented & Outdated Information**: Data regarding universities, colleges, degree curricula, admissions criteria, and scholarships is scattered across unmaintained websites, physical registrar bulletin boards, or informal channels.
2. **Opaque Admissions & Tuition Details**: Matriculation thresholds, department prerequisites, and cost-sharing/tuition schedules are rarely standardized or accessible in advance, leading to uninformed choices.
3. **Limited Access to Academic Guidance**: Many secondary and undergraduate students lack immediate access to dedicated academic counselors to help them evaluate suitable fields of study.
4. **Lack of Personalization & Verification**: Existing websites provide static, unverified lists without search filtering, interactive comparison, or verifiable academic documents.

**GIBIConnect solves these challenges by uniting authoritative relational data with a zero-hallucination Retrieval-Augmented Generation (RAG) AI consultation system.**

---

## 3. Project Objectives

### General Objective
To design, implement, and evaluate a centralized higher-education information and AI consultation platform that provides students with accessible institutional directories, transparent admissions criteria, verified resources, and personalized AI academic guidance.

### Specific Objectives
1. **Centralize Institutional Data**: Build a unified catalog indexing Ethiopian universities and colleges with verified profiles, official emblems, and contact details.
2. **Standardize Curricula & Costs**: Provide structured comparisons of degree programs across degree levels (Bachelor, Master, PhD), study modes (Regular, Extension, Online), and transparent tuition fee schedules.
3. **Integrate a Grounded AI Advisor**: Implement a local RAG pipeline capable of answering natural-language student queries backed by cited database records and document chunks.
4. **Democratize Academic Resources**: Establish a moderated repository for syllabi, lecture notes, academic calendars, and peer-reviewed research papers.
5. **Enforce Security & Data Integrity**: Implement salted bcrypt password hashing, stateless JWT authentication, and strict Role-Based Access Control (RBAC).
6. **Ensure High Performance & Scalability**: Utilize hardware-accelerated vector indexing (pgvector HNSW) and PostgreSQL full-text/trigram search (`tsvector`, `pg_trgm`) for sub-120ms response times.

---

## 4. Target Users

* **High School Students**: Exploring higher-education opportunities, entrance requirements, and university selections.
* **Undergraduate & Graduate Students**: Accessing academic syllabi, degree roadmaps, research publications, and scholarship funding.
* **Scholarship Seekers**: Discovering active national and institutional grants, eligibility requirements, and application deadlines.
* **University Administrators & Faculty**: Publishing official program updates, admissions criteria, and institutional research.
* **Educators & Counselors**: Using verified institutional data to assist students in academic planning.

---

## 5. Major Features

### 5.1 User Authentication & Role-Based Access Control (RBAC)
* Secure user registration and login with bcrypt password salting (10 rounds).
* Stateless JWT (JSON Web Token) bearer authentication with role-based route guards (`user`, `moderator`, `admin`).
* Profile customization and personal dashboard management.

### 5.2 Interactive University & Program Directories
* **18+ Verified Ethiopian University Hubs**: Detailed profiles with verified logos (e.g., ASTU emblem), location maps, leadership, and contact data.
* **8 Dynamic Subtabs per Campus**: Overview, Faculties/Departments, Degree Programs, Admissions Criteria, Tuition Fees, Campus Facilities, Scholarships, and Academic Calendars.
* **Multi-Facet Search & Filtering**: Real-time filtering by Region (*Oromia, Amhara, Addis Ababa, Tigray, Sidama*), Governance (*Public vs Private*), and Degree Level (*Bachelor, Master, PhD*).

### 5.3 Grounded AI Academic Consultation (RAG)
* **Natural Language Advisory**: Students can ask questions regarding majors, career pathways, entrance cut-offs, and tuition rates.
* **Retrieval-Augmented Generation (RAG)**: Connects local embeddings (`nomic-embed-text`) with vector similarity search (`pgvector`) to feed verified context to `Llama 3.2`.
* **Zero-Hallucination Guardrails**: Prompts are fenced with authoritative database records; the AI refutes fictional queries and admits missing data rather than hallucinating.
* **Citations & Sources**: Displays the exact source university, document title, and page number with every AI response.

### 5.4 Academic Resources & Research Repository
* Searchable digital library of verified syllabi, lecture slides, past exams, and research papers.
* In-browser document streaming and secure direct file downloads.
* Full-text search (`tsvector`) and typo-tolerant trigram search (`pg_trgm`).

### 5.5 Student Bookmarking & Personal Dashboard
* Personalized saved items: Bookmark universities, degree curricula, scholarships, and academic documents to a unified student dashboard.

---

## 6. Database System

GIBIConnect utilizes **PostgreSQL 16** with advanced extensions as its database foundation:

* **Relational Schema**: 11 core canonical tables (`users`, `institutions`, `faculties`, `departments`, `programs`, `admissions`, `tuition_fees`, `scholarships`, `resources`, `research`, `academic_calendar`, `reviews`).
* **pgvector Extension**: Stores 768-dimensional dense vector embeddings in `rag_document_chunks` indexed with **HNSW (Hierarchical Navigable Small World)** for high-speed cosine distance similarity search (`vector_cosine_ops`).
* **pg_trgm & pgcrypto**: Powers typo-tolerant fuzzy search, instant autocomplete (`gin_trgm_ops`), and UUID primary key generation (`gen_random_uuid()`).
* **Referential Integrity**: Enforces strict `ON DELETE RESTRICT` on core academic hierarchies and `ON DELETE CASCADE` on transient embeddings and bookmarks.

---

## 7. Backend Architecture

The backend is developed with **Node.js v24 and Express.js 4.19**:

* **Layered MVC/Repository Architecture**: Strict separation between Controllers, Services, SQL Repositories, and Route Middleware.
* **AI Orchestration Layer**: Query intent classification (`query.classifier.js`), structured SQL retrieval (`structured.retriever.js`), prompt fencing (`context.builder.js`), and LLM service connection (`llm.service.js`).
* **Input Validation**: Centralized request payload validation using **Joi** schemas before reaching database queries.
* **Security Middleware**: Centralized error envelopes, CORS configuration, rate limiting, and JWT authentication guards.

---

## 8. Frontend Architecture

The user interface is built using **HTML5, JavaScript ES Modules (`type="module"`), and Tailwind CSS**:

* **Performance & Speed**: Zero client-side framework overhead, achieving sub-50ms paint times and instantaneous navigation.
* **Dynamic DOM Lifecycle Gates**: Built with `document.readyState` checks to eliminate ES module asynchronous execution delays.
* **Visual Logo & Monogram Fallback Engine**: Renders verified university emblems where available and falls back gracefully to clean initials badges (`AAU`, `BDU`, `JU`) for null records.
* **Responsive Layouts**: Fully responsive across mobile (320px), tablet, and desktop (4K) viewports with slide-out navigation drawers and search command modals.

---


## 9. System Architecture

GIBIConnect follows a layered, decoupled system architecture:

* text
[ CLIENT / BROWSER LAYER ]
   ├── explore.html | institutions.html | programs.html | ai-advisor.html | profile.html
   └── Vanilla JS ES Modules (api.js, navigation.js, auth.js) + Tailwind CSS
            │
            ▼ (HTTP / JSON REST API Requests)
[ APPLICATION / BACKEND LAYER (Node.js + Express 4.19) ]
   ├── JWT Auth Middleware & Role-Based Access Control (RBAC)
   ├── Joi Request Validation Layer
   ├── REST Controllers & Services (Institutions, Programs, Scholarships, Users)
   └── AI Orchestrator & Query Intent Classifier
            │                                  │
            ▼ (SQL Queries & Transactions)     ▼ (768-dim Vectors & Prompts)
[ DATABASE LAYER (PostgreSQL 16) ]   [ LOCAL AI ENGINE (Ollama on localhost:11434) ]
   ├── Relational Tables (11 Core)      ├── nomic-embed-text (Embeddings)
   ├── pgvector (HNSW Index, 768-dim)   └── Llama 3.2 (Grounded Synthesis)
   └── Full-Text & Trigram Indexes 
---

---
### 10. Security & Quality Assurance
* **Cryptographic Security**: Passwords salted and hashed with bcrypt (10 rounds); sensitive configurations managed via isolated .env files.
* **SQL Injection Immunity**: 100% of database queries execute via parameterized statements ($1, $2, ...).
* **Input Validation**: Strict Joi schema validation on all incoming request payloads before reaching database layers.
* **Role-Based Access Control (RBAC)**: Stateless JWT authentication enforcing user privilege boundaries (user, moderator, admin).
* **Comprehensive Automated Test Suite**: A 32-point test harness (backend/tests/full_system_test_suite.js) verifying Unit logic, Database constraints, API endpoints, AI/RAG retrieval, and Integration flows with a 100% Pass Rate.
### 11. Expected Benefits
### For Students
* **Single Access Point**: Centralized access to verified university directories, degree curricula, cut-off marks, and fee structures.
* **Personalized AI Guidance**: Real-time conversational guidance grounded strictly in official institutional data.
* **Transparent Comparison**: Clear, side-by-side comparison of degree programs and tuition across public and private institutions.
### For Educational Institutions
* **Structured Digital Presence**: Authoritative platform to publish verified academic calendars, admissions criteria, and research publications.
* **Reduced Inquiry Overhead**: Automated AI answering of repetitive admission, scholarship, and program inquiries.
### For Educational Planning
* **Elimination of Misinformation**: Anchors student expectations in verified facts, reducing dropouts and uninformed academic choices.
### 12. Future Enhancements
* **Dedicated GPU Worker Nodes**: High-throughput concurrent LLM inference streams for nationwide deployment.
* **Multi-Language Support**: Native user interface and AI consultation in Amharic, Afaan Oromoo, and Tigrinya.
* **Cross-Platform Mobile Apps**: Flutter / React Native applications with offline bookmark and resource synchronization.
* **Automated PDF OCR Pipeline**: Direct ingestion, chunking, and semantic vectorization of scanned university prospectuses and syllabi.
* **Entrance Exam Scoring Simulator**: Interactive cut-off score predictor based on historical matriculation trends.
13. Project Team & Responsibilities
No.	Full Name	Student ID	Core Project Responsibility
1	Ermiyas Cheru	CTC-5723-26	Database Design, pgvector & AI/RAG Orchestration
2	Fekadu Alemnew	CTC-4438-26	Backend Architecture, Express REST API & Security
3	Ezra Michael	CTC-3205-26	UI/UX Design, CSS Styling & Reusable Components
4	Ezana Girmay	CTC-7612-26	Frontend Pages, Routing & Search Integration
5	Elsabeth Berhanu	CTC-1036-26	Authentication, Admin Console & Quality Assurance Testing
### 14. Conclusion
* GIBIConnect delivers an integrated, scalable, and intelligent educational platform that resolves the severe information fragmentation in Ethiopian higher education.

* By combining relational data modeling in PostgreSQL 16, hardware-accelerated semantic search in pgvector, modern performant frontend views, and grounded local AI reasoning via Llama 3.2 and Ollama, GIBIConnect establishes an authoritative, zero-hallucination digital companion that empowers students to explore opportunities, compare institutions, and make confident decisions about their academic future.
