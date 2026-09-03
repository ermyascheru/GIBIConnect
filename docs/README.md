# GIBIConnect Documentation Index

Welcome to the central documentation hub for **GIBIConnect**, an AI-powered higher education information and academic decision-support platform for Ethiopia.

---

## 📚 Documentation Directory Map

### 1. [System Architecture](architecture/)
* **[`ARCHITECTURE.md`](architecture/ARCHITECTURE.md)**: Comprehensive, beginner-friendly yet technically rigorous architecture guide explaining project structure, frontend/backend integration, database design, AI/RAG orchestration, deployment, and developer onboarding.
* **[`GIBICONNECT_ARCHITECTURE.md`](architecture/GIBICONNECT_ARCHITECTURE.md)**: High-level architectural overview and component interaction flow diagrams.

### 2. [Database & Schema](database/)
* **[`DATABASE_TABLE_MAP.md`](database/DATABASE_TABLE_MAP.md)**: Complete database entity-relationship documentation covering all 11 core tables, foreign keys, constraints, and pgvector schema.
* **[`DATABASE_EXECUTION_ORDER.md`](database/DATABASE_EXECUTION_ORDER.md)**: Sequential execution order for SQL migrations, constraints, indexes, and seed files.
* **[`BACKEND_DATABASE_MAPPING.md`](database/BACKEND_DATABASE_MAPPING.md)**: Detailed mapping of Express backend repositories to PostgreSQL SQL queries.
* **[`resource_research_database_design.md`](database/resource_research_database_design.md)**: Detailed specification for educational resource & research document schema.
* **[`resource_research_future_backend.md`](database/resource_research_future_backend.md)**: Specification for future document processing and OCR ingestion pipeline.

### 3. [API & Endpoints](api/)
* **[`API_ENDPOINT_MAP.md`](api/API_ENDPOINT_MAP.md)**: REST API reference for all endpoints (`/api/institutions`, `/api/programs`, `/api/scholarships`, `/api/auth`, `/api/users`, `/api/ai`).

### 4. [Frontend](frontend/)
* **[`FRONTEND_DATABASE_MAPPING.md`](frontend/FRONTEND_DATABASE_MAPPING.md)**: Mapping of frontend pages (`explore.html`, `institutions.html`, etc.) to backend API response structures and DOM render logic.

### 5. [Testing & Evaluation](testing/)
* **[`TESTING_AND_EVALUATION.md`](testing/TESTING_AND_EVALUATION.md)**: Master 32-point test report covering Unit, Database, API, AI/RAG, and Integration testing with 100% pass rate.
* **[`MANUAL_TESTING.md`](testing/MANUAL_TESTING.md)**: Step-by-step manual test cases and browser validation guide.

---

## 🚀 Quick Links
* **Backend Source Code**: [`backend/src/`](../backend/src/)
* **Database Schema**: [`database/schema.sql`](../database/schema.sql)
* **Frontend Web App**: [`frontend/`](../frontend/)
* **Automated Test Suite**: [`backend/tests/full_system_test_suite.js`](../backend/tests/full_system_test_suite.js)
