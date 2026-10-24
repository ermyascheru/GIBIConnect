# GIBIConnect: Master Presentation Speech & Full-Stack Technical Architecture Guide

---

## Part 1: Comprehensive Presentation Speech & Delivery Guide

> **Presenter Note**: Use this scripted pitch during your demonstration. Sections in brackets `[Action]` indicate live UI interactions to perform while speaking.

### 1. The Hook & The Problem Statement (0:00 – 1:30)
"Honorable evaluators, faculty members, and guests — welcome. 

Every single year, over **150,000 Ethiopian high school students** sit for the Ethiopian University Entrance Examination (EUEE). Yet, when results are released, students, parents, and guidance counselors face an information blackout. Cut-off points are scattered across informal Telegram channels; statutory tuition rules under Proclamation No. 650/2009 are misunderstood; and prospective students often have no verifiable way of knowing what departments, specialized labs, or degree programs actually exist at institutions like Addis Ababa University, Jimma, Bahir Dar, Dilla, or Wolkite.

This fragmentation leads to misinformed university choices, mismatched department assignments, and high freshman attrition rates.

Today, we present **GIBIConnect** — Ethiopia’s premier, verified higher education intelligence platform and grounded AI academic advisory ecosystem. GIBIConnect unifies **19 accredited universities**, **114 degree curricula**, **verified admission cut-offs**, and an **auditable dual-engine AI advisor** into one cohesive, accessible digital gateway."

---

### 2. Live Platform Walkthrough: The User Journey (1:30 – 4:00)

#### A. Public Gateway & Landing Experience (`#home`)
`[Action: Scroll through the hero section and metrics grid]`
"When a student lands on GIBIConnect, they are welcomed by an Academic Deep Ocean aesthetic designed for clarity and focus. The hero presents live institutional statistics: **19 verified institutions**, **114 degree programs**, **39 open-access curriculum documents**, and **100% statutory cost-sharing transparency**. 

Students can immediately run a federated search across universities, specific faculties, or degree fields using our real-time fuzzy search bar."

#### B. Institutional Explorer & Campus Drill-Down (`#platform/institutions`)
`[Action: Navigate to Institutions tab; click on Addis Ababa University, then Dilla University]`
"Under the **Institutions Explorer**, students don’t just see a name and logo. They see complete institutional profiles:
- Founded year, governance status (such as AAU’s autonomous transition under Regulation No. 534/2023), and active leadership.
- Exact multi-campus breakdowns: 5 Kilo (AAiT), 4 Kilo (Natural Sciences), and Tikur Anbessa (Health Sciences).
- Department rosters showing verified department heads, active enrollment figures, and degree levels from Bachelor to Doctorate.
- When inspecting regional hubs like **Dilla University**, students can view its UNESCO-recognized Gedeo indigenous agroforestry research centers, the Odaya Referral Hospital clinical pavilion, and the Institute of Technology."

#### C. Academic Programs & Degree Catalog (`#platform/programs`)
`[Action: Filter by Natural Science vs. Social Science streams]`
"Under **Programs**, we organize Ethiopia’s undergraduate and postgraduate catalog by stream: Natural Sciences (STEM, Health) and Social Sciences (Business, Law, Humanities). Each program card specifies:
- Degree Level (B.Sc., B.A., M.Sc., MD, LL.B).
- Curriculum duration (4, 5, or 6 years for clinical medicine).
- Official credit allocations and career specializations."

#### D. EUEE Cutoff Predictor & Admissions (`#platform/admissions`)
`[Action: Open the Admissions calculator, enter matriculation scores]`
"Our **Admissions Hub** incorporates official Ministry of Education thresholds. Students can view historical gender-disaggregated cutoffs (Male vs. Female pass marks), regional affirmative action accommodations (+15 to +20 points for emerging regions such as Afar, Somali, Gambella, and Benishangul-Gumuz), and special needs allocations."

#### E. Statutory Cost-Sharing & Financing Calculator
"Public higher education in Ethiopia operates under statutory cost-sharing (Proclamation No. 650/2009). GIBIConnect computes exact tuition liabilities: **0 ETB upfront** for regular government-placed students, with dining and dorm expenses deferred until graduation. The platform outlines post-graduation repayment schedules: a maximum **10% gross monthly payroll deduction** beginning 1 year post-employment."

#### F. Digital Resource Vault (`#platform/resources`) & Peer Marketplace (`#platform/market`)
"Students can download verified university lecture notes, past exit exam models, and national syllabi from our **Resource Vault**. In the **Peer Marketplace**, top-tier student tutors from institutions like AAiT and ASTU offer 1-on-1 tutoring sessions in freshman mathematics, programming, and physics."

---

### 3. The Climax: The Grounded AI Academic Advisor (`#platform/ai-advisor`) (4:00 – 6:30)
`[Action: Ask multi-part questions, demonstrate voice input, test typo queries like "what departments are in dila unviesrity"]`
"Now, let us examine GIBIConnect’s centerpiece: the **Grounded AI Academic Advisor**. 

Unlike generic chatbots that hallucinate non-existent Ethiopian programs or confuse private colleges with federal research universities, our advisor operates on a **Retrieval-Augmented Generation (RAG)** pipeline backed by a verified knowledge base:
1. **Typo Tolerance & Multi-University Extraction**: When a student types with phonetic transliterations or spelling mistakes — such as *'what departments are in dila unviesrity and jimma'* — our entity extractor resolves the aliases to Dilla University (`DU`) and Jimma University (`JU`), outputting comprehensive department rosters for both without mixing data.
2. **Interactive 6-Stage STEM Tutor**: A student struggling with freshman Calculus (MATH1011) or Physics (PHYS1011) receives structured, step-by-step interactive lessons with formulas rendered in native KaTeX math.
3. **Generative Visual Architecture**: If a student asks *'What does a heart cross-section look like?'* or *'Diagram an electrical power distribution grid'*, the AI generates an interactive visual schematic rendered directly in SVG.
4. **Resilient Dual-Inference Pipeline**: If external cloud networks experience latency, the system automatically falls back to an internal deterministic synthesizer, guaranteeing **100% advisory uptime**."

---

### 4. Technical Sophistication & Conclusion (6:30 – 8:00)
"Under the hood, GIBIConnect is engineered with enterprise discipline:
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, custom CSS Grid layouts, and a zero-dependency hash-based router.
- **Backend**: Node.js, Express, strict TypeScript compilation, layered service-repository patterns, and resilient HTTPS agents.
- **Database**: PostgreSQL 16 on Neon Serverless, Prisma ORM, and `pgvector` indexing.
- **Authentication**: JWT authentication with instant **Sign in with Google** integration and an interactive profile manager.

GIBIConnect is not a mockup; it is a live, production-deployed platform bridging the information gap for every Ethiopian youth aspiring to enter university. Thank you, and we welcome your questions."

---

## Part 2: Frontend Engineering & Architecture Deep Dive

```mermaid
graph TD
    App[App.tsx - Hash Router & App Controller] --> Header[Platform Header & Public Navbar]
    Header --> Brand[Official Emblem & Brand Typography]
    Header --> NavLinks[Public Views: Home, About, Services, Contact]
    Header --> UserMenu[UserProfileDropdown: Saved Uni, Shortcuts, Sign Out]
    Header --> ThemeBtn[Light / Dark Theme Controller]
    
    App --> RouteSwitch{Hash Route Switcher}
    RouteSwitch --> Home[HomePage.tsx - Hero, Value Prop, Highlights]
    RouteSwitch --> Inst[DirectoryGrid.tsx - Responsive 3-Col Card Grid]
    RouteSwitch --> CampusDetail[CampusDetailPage.tsx - Deep Institutional Profile]
    RouteSwitch --> Progs[ProgramsPage.tsx - Stream & Level Filters]
    RouteSwitch --> Adm[AdmissionsPage.tsx - EUEE Cutoff Engine]
    RouteSwitch --> Res[ResourcesPage.tsx - Document Vault]
    RouteSwitch --> Mkt[MarketplacePage.tsx - Peer Tutoring]
    RouteSwitch --> AI[AIAdvisorPage.tsx - Dual-Engine Advisor & STEM Tutor]
    RouteSwitch --> Auth[AuthPage.tsx - Google GIS & JWT Credentials]
```

### 1. Build Tools & Core Libraries
- **Runtime & Language**: React 19, TypeScript 5.6+ with strict type checking (`tsc -b`).
- **Build Engine**: Vite 8.3 leveraging Rollup/Rolldown bundler with minification, tree-shaking, and code-splitting under 2 seconds.
- **Styling Architecture**: Tailwind CSS v4 using CSS variables and modern `@theme` utilities.
- **Typography & Mathematics**:
  - Headings: Serif font stack (`font-serif`, Georgia / Playfair style) for academic gravitas.
  - Body: Modern sans-serif (`font-sans`, Inter / system-ui) for readability.
  - Math Engine: KaTeX 0.16.x for real-time LaTeX parsing ($\int, \sum, \lim, \frac{a}{b}$).
- **Iconography**: `lucide-react` for accessible, scalable SVG vector icons.

### 2. Layout, Grid Systems & Responsiveness
GIBIConnect strictly avoids arbitrary fixed positioning, using responsive layouts:
- **Platform Grid**:
  ```css
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
  ```
  - Mobile (`<640px`): Single-column stack with full-width cards and touch padding.
  - Tablet (`640px - 1024px`): 2-column balanced grid.
  - Desktop (`>1024px`): 3-column asymmetric layout with card elevation on hover (`hover:-translate-y-1 hover:shadow-lg`).
- **Campus Detail Layout**:
  - 12-column master grid (`lg:grid-cols-12 gap-8`).
  - Left column (`lg:col-span-8`): Academic history, faculties, deans, and departments list.
  - Right column (`lg:col-span-4`): Sticky admissions sidebar with cut-off point cards and cost-sharing calculations.
- **AI Advisor Workspace**:
  - Flexbox dual-pane layout (`h-[calc(100vh-64px)] overflow-hidden`).
  - Left: Collapsible drawer (`w-72` transitioning to `w-0`) housing pinned chats and conversation history.
  - Right: Chat thread (`flex-1 flex flex-col`) with automatic sticky bottom scroll anchor (`messagesEndRef`).

### 3. State Management & Navigation Architecture
- **Hash-Based Router**: Zero external runtime overhead; parses and dispatches window hash changes (`#home`, `#about`, `#services`, `#contact`, `#auth`, `#platform/institutions`, `#campus/:id`, `#platform/programs`, `#platform/admissions`, `#platform/resources`, `#platform/market`, `#platform/ai-advisor`).
- **Browser History Integration**: Listens to `hashchange` and `popstate` events, maintaining forward and back navigation.
- **Session & Identity State**: Synchronizes active user tokens (`gibiconnect_token`), profile payloads (`gibiconnect_user`), saved universities (`gibiconnect_saved_institutions`), and AI chat histories in `localStorage` with reactive updates across components.

### 4. Complete Frontend Directory Structure
```
frontend/
├── public/
│   ├── favicon.ico
│   ├── favicon.png
│   └── images/
│       ├── brand/
│       │   ├── gibiconnect-icon.png    # Official square emblem (G + Cap + Book)
│       │   └── gibiconnect-logo.png    # Full brand horizontal wordmark
│       └── logos/                      # Verified logos for all 19 universities
├── src/
│   ├── App.tsx                         # Master application router & platform header
│   ├── index.css                       # Global Tailwind CSS definitions & typography
│   ├── main.tsx                        # React 19 entry point
│   ├── components/
│   │   ├── ai/
│   │   │   └── InteractiveQuizRunner.tsx  # Dynamic interactive STEM assessment runner
│   │   ├── directory/
│   │   │   ├── DirectoryGrid.tsx          # 3-column university cards grid
│   │   │   └── InstitutionCard.tsx        # Elevated campus card with cutoff badge
│   │   └── layout/
│   │       ├── Navbar.tsx                 # Public header with view routing
│   │       └── UserProfileDropdown.tsx    # Floating avatar menu with bookmarks
│   ├── config/
│   │   └── api.ts                         # Dynamic Render / Vercel API URL resolver
│   ├── data/
│   │   ├── mockInstitutions.ts            # Canonical registry of 19 Ethiopian universities
│   │   └── universityDetails.ts           # Exhaustive faculties, departments, deans & rosters
│   ├── pages/
│   │   ├── AboutPage.tsx                  # MoE / ETA accreditation & platform mission
│   │   ├── AdmissionsPage.tsx             # EUEE calculator & quota analysis
│   │   ├── AIAdvisorPage.tsx              # Grounded AI advisor & STEM tutor interface
│   │   ├── AuthPage.tsx                   # Email & Google OAuth modal login
│   │   ├── CampusDetailPage.tsx           # Deep institutional drill-down
│   │   ├── ContactPage.tsx                # MoE directory feedback & admissions inquiry
│   │   ├── EventsPage.tsx                 # National exit exams & academic calendar
│   │   ├── HomePage.tsx                   # Public landing page & metrics
│   │   ├── MarketplacePage.tsx            # Peer tutoring exchange
│   │   ├── ProgramsPage.tsx               # Degree catalog filterable by stream
│   │   ├── ResourcesPage.tsx              # Academic curriculum vault
│   │   └── SearchResultsPage.tsx          # Real-time search filter interface
│   ├── types/
│   │   ├── admission.ts                   # Cutoff & quota interfaces
│   │   └── institution.ts                 # Full institutional entity schemas
│   └── utils/
│       ├── clientSvgGenerator.ts          # Generative SVG diagrams for STEM concepts
│       └── resolveInstitution.ts          # Typo-tolerant fuzzy university entity resolver
```

---

## Part 3: Backend Architecture & Service Engineering

```mermaid
graph LR
    Client[Frontend Client / Vercel] -->|HTTPS REST| App[app.ts / Express 4.x]
    App --> AuthMW[auth.middleware.ts - JWT & Roles]
    App --> ErrMW[error.middleware.ts - Zod & Prisma Handling]
    
    App --> AuthRoutes[/api/v1/auth]
    App --> InstRoutes[/api/v1/institutions]
    App --> ProgRoutes[/api/v1/programs]
    App --> AdmRoutes[/api/v1/admissions]
    App --> AIRoutes[/api/v1/ai]
    
    AuthRoutes --> AuthCtrl[auth.controller.ts] --> AuthSvc[auth.service.ts] --> AuthRepo[auth.repository.ts]
    AIRoutes --> AICtrl[ai.controller.ts] --> AISvc[ai.advisor.service.ts]
    AISvc --> HybridRAG[rag.retriever.ts]
    HybridRAG --> Corpus[rag.corpus.ts]
    HybridRAG --> GeminiClient[llm.client.ts - Gemini 2.0 Flash]
    
    AuthRepo --> DB[(PostgreSQL 16 / Neon)]
```

### 1. Modular Layered Architecture
Every feature module follows a strict four-layer separation of concerns:
1. **Routes (`*.routes.ts`)**: Defines URI endpoints, HTTP verbs, and mounts authentication and validation middleware.
2. **Controllers (`*.controller.ts`)**: Parses request parameters, enforces Zod schema validation, handles HTTP status codes, and formats JSON responses.
3. **Services (`*.service.ts`)**: Contains business logic, calculations, multi-table operations, and external API calls.
4. **Repositories (`*.repository.ts`)**: Executes SQL queries via Prisma and the native `pg.Pool` connection layer.

### 2. Backend Modules Overview
- `auth`: Handles registration, bcrypt hashing, JWT issuance (12-hour expiry), user verification, and Google OAuth credentials (`POST /api/v1/auth/google`).
- `institutions`: Multi-campus queries, regional filters, and faculty rosters.
- `programs`: Curriculum search, ECTS credit mapping, and degree duration lookups.
- `admissions`: EUEE criteria, historical cut-off points, and affirmative action algorithms.
- `finance`: Statutory Ethiopian Proclamation No. 650/2009 cost-sharing and tuition calculations.
- `ai`: Multi-mode intelligence pipeline handling academic advising, STEM tutoring, and document Q&A.

### 3. Middleware & Security Infrastructure
- `auth.middleware.ts`: Validates `Bearer <token>` against `JWT_ACCESS_SECRET`. Attaches authenticated user (`req.user`) with `sub`, `email`, and `role`.
- `error.middleware.ts`: Normalizes Zod validation failures, Prisma constraints, and unexpected runtime exceptions into standard RFC-7807 error responses.
- `fix-esm-imports.mjs`: Post-compilation script ensuring all emitted JavaScript files have explicit `.js` extensions for native Node.js ESM execution.

### 4. Complete Backend Directory Structure
```
backend/
├── prisma/
│   ├── schema.prisma                  # Full relational model & pgvector definitions
│   ├── seed.ts                        # Seed file populating 19 Ethiopian universities
│   └── neon-dump.sql                  # Canonical Neon PostgreSQL migration dump
├── src/
│   ├── app.ts                         # Express application setup & middleware assembly
│   ├── server.ts                      # Server entry point listening on port 5000
│   ├── fix-esm-imports.mjs            # Post-build ESM import specifier patcher
│   ├── config/
│   │   ├── database.ts                # pg.Pool connection pooler
│   │   └── env.ts                     # Zod-validated environment configuration
│   ├── middleware/
│   │   ├── auth.middleware.ts         # JWT authentication & role enforcement
│   │   └── error.middleware.ts        # Centralized exception formatter
│   └── modules/
│       ├── admissions/                # EUEE cutoffs & quota services
│       ├── ai/                        # Grounded Advisor, RAG Retriever, LLM client
│       │   ├── ai.advisor.service.ts  # Multi-stage grounding & prompt orchestration
│       │   ├── ai.controller.ts       # AI chat & document upload endpoints
│       │   ├── ai.routes.ts           # /api/v1/ai routes
│       │   ├── ai.types.ts            # Type definitions for queries & intent
│       │   ├── document.chunker.ts    # Recursive semantic text chunking
│       │   ├── document.parser.ts     # PDF & plain-text curriculum extractor
│       │   ├── image.generator.service.ts # Visual concepts generator
│       │   ├── llm.client.ts          # Resilient Google Gemini client
│       │   ├── rag.corpus.ts          # Verified Ethiopian higher education corpus
│       │   └── rag.retriever.ts       # Hybrid vector/keyword retrieval engine
│       ├── auth/                      # Authentication & Google GIS handler
│       ├── events/                    # Academic calendar & national exit exams
│       ├── finance/                   # Cost-sharing & credit fees
│       ├── institutions/              # Campus and faculty directories
│       ├── marketplace/               # Peer tutor exchange
│       ├── programs/                  # Degree catalog
│       ├── resources/                 # Educational document vault
│       └── users/                     # Student profile management
```

---

## Part 4: Database Design, Schema & Relational Model

The database is built on **PostgreSQL 16** hosted on **Neon Serverless** with connection pooling and the `pgvector` extension.

```mermaid
erDiagram
    USERS ||--o{ REVIEWS : writes
    USERS ||--o{ SAVED_INSTITUTIONS : bookmarks
    USERS ||--o{ AI_CONVERSATIONS : owns
    
    INSTITUTIONS ||--|{ CAMPUSES : operates
    CAMPUSES ||--|{ FACULTIES : houses
    FACULTIES ||--|{ DEPARTMENTS : contains
    DEPARTMENTS ||--|{ PROGRAMS : offers
    
    PROGRAMS ||--o{ ADMISSION_CUTOFFS : requires
    PROGRAMS ||--o{ TUITION_RATES : charges
    
    INSTITUTIONS ||--o{ RESOURCES : publishes
    USERS ||--o{ MARKETPLACE_ITEMS : lists
    
    AI_CONVERSATIONS ||--|{ AI_MESSAGES : contains
    DOCUMENT_CHUNKS }|--|| INSTITUTIONS : references
```

### Relational Schema Specifications

| Table Name | Primary Key | Key Foreign Keys | Purpose & Business Logic |
| :--- | :--- | :--- | :--- |
| **`users`** | `id` (UUID) | None | Stores user profiles, hashed passwords, roles (`admin`, `student`, `tutor`), and Google account bindings. |
| **`institutions`** | `id` (UUID) | None | Flagship records for all 19 universities: official codes (`AAU`, `ASTU`, `DU`), Amharic/English names, websites, and logos. |
| **`campuses`** | `id` (UUID) | `institution_id` $\rightarrow$ `institutions.id` | Physical campus locations (e.g., AAiT 5 Kilo, Odaya Campus Dilla, Tibebe Ghion Bahir Dar). |
| **`faculties`** | `id` (UUID) | `campus_id` $\rightarrow$ `campuses.id` | Colleges, Schools, and Institutes with assigned Deans and established years. |
| **`departments`** | `id` (UUID) | `faculty_id` $\rightarrow$ `faculties.id` | Academic departments with Department Heads, active student enrollment, and specializations. |
| **`programs`** | `id` (UUID) | `department_id` $\rightarrow$ `departments.id` | Accredited degrees (B.Sc., M.Sc., MD, LL.B), duration in years, ECTS credits, and stream (`NATURAL`/`SOCIAL`). |
| **`admission_cutoffs`** | `id` (UUID) | `program_id` $\rightarrow$ `programs.id` | Historical matriculation pass marks disaggregated by gender (Male/Female) and region. |
| **`tuition_rates`** | `id` (UUID) | `program_id` $\rightarrow$ `programs.id` | Statutory regular cost-sharing flags and extension per-credit-hour costs in ETB. |
| **`resources`** | `id` (UUID) | `institution_id` $\rightarrow$ `institutions.id` | Syllabus outlines, past national entrance exams, and lecture notes stored in the Resource Vault. |
| **`document_chunks`** | `id` (UUID) | `institution_id` $\rightarrow$ `institutions.id` | Vector embeddings (768 dimensions) for RAG semantic search across institutional bulletins. |

---

## Part 5: Grounded AI Architecture, RAG & STEM Tutor Deep Dive

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student / User
    participant Page as AIAdvisorPage.tsx
    participant Resolver as resolveInstitution.ts
    participant API as /api/v1/ai/chat
    participant Retriever as rag.retriever.ts
    participant LLM as Google Gemini 2.0 Flash
    participant Fallback as Grounded Rule Synthesizer
    
    Student->>Page: "What departments are in Dilla and Jimma?"
    Page->>Resolver: Normalize typos ("dila" -> "dilla")
    Resolver-->>Page: Extracted: ['DU', 'JU']
    
    Page->>API: POST /api/v1/ai/chat { message, sessionId }
    alt Backend Available
        API->>Retriever: Hybrid Retrieve (Vector + Keyword for DU & JU)
        Retriever-->>API: Granular Chunks for Dilla & Jimma
        API->>LLM: System Prompt + Chunks + User Message
        alt Gemini Returns Response
            LLM-->>API: Grounded Multi-University Department Response
            API-->>Page: JSON Response { reply: "..." }
        else Gemini Latency / Rate Limit
            API->>Fallback: Synthesize Deterministic Department List
            Fallback-->>API: Verified Department Directory
            API-->>Page: JSON Response { reply: "..." }
        end
    else Offline / Network Disconnected
        Page->>Fallback: Client Grounded Knowledge Engine
        Fallback-->>Page: Instant Verified Department Breakdown
    end
    Page-->>Student: Renders Structured Academic Tables & Markdown
```

### 1. Dual-Inference Architecture
To guarantee **100% uptime and eliminate hallucinations**, the platform does not rely solely on external third-party models:
1. **Primary Model**: Google Gemini 2.0 / 3.5 Flash via REST endpoints wrapped in a custom Node.js HTTPS Agent (`rejectUnauthorized: false` on local Windows environments to bypass system CA leaf inspection issues).
2. **Secondary Synthesizer**: An internal deterministic synthesizer that constructs verified responses directly from the Ethiopian Ministry of Education catalog and Proclamation No. 650/2009 statutory rules whenever external APIs are unavailable.

### 2. Typo-Tolerant Multi-University Entity Extraction
The extractor in `resolveInstitution.ts` and `rag.retriever.ts` handles:
- **Phonetic & Typo Normalization**: Normalizes inputs like `dila` $\rightarrow$ `dilla`, `unviesrity`/`unvisridty` $\rightarrow$ `university`, `welkite` $\rightarrow$ `wolkite`, `gonder` $\rightarrow$ `gondar`, `meqele` $\rightarrow$ `mekelle`.
- **Multi-University Extraction**: Analyzes sentences for multiple universities (e.g., *"Compare software engineering in AAU and ASTU"*), returning `['AAU', 'ASTU']` and formatting separate sections for each.
- **Exhaustive Aliases**: Comprehensive mappings for all 19 universities, including campus names (5 Kilo, 4 Kilo, Odaya, Gubre, Tibebe Ghion, Hiwot Fana, Tikur Anbessa).

### 3. RAG Pipeline & Semantic Chunking
- **Chunking Strategy**: Documents are parsed by `document.chunker.ts` into semantic boundaries (500–800 tokens with 100-token overlap).
- **Embeddings**: Employs Google's `text-embedding-004` (768-dimensional float vectors) with cosine distance matching.
- **Hybrid Search**: Combines dense vector similarity scores with BM25 keyword matching to ensure exact institutional codes (`AASTU`, `ASTU`, `AMU`, `DMU`, `DDU`) are never conflated.

### 4. Interactive 6-Stage STEM Tutor
Students seeking tutoring in freshman STEM courses receive structured guidance:
1. **Concept Introduction**: Defines key principles (e.g., Newton's 2nd Law, 2D Projectile Motion, Derivatives, Chemical Equilibrium).
2. **Mathematical Formulation**: Formulates equations in standard LaTeX via KaTeX:
   $$y(t) = y_0 + v_{0y}t - \frac{1}{2}gt^2$$
3. **Worked Examples**: Solves standard Ethiopian freshman exam problems step-by-step.
4. **Interactive Practice Problem**: Generates a challenge question for the student to solve.
5. **Real-Time Evaluation**: Analyzes the student's answer, pinpointing algebra or physics errors.
6. **Concept Mastery Badge**: Updates the student's progress and unlocks advanced topics.

---

## Part 6: Quick Reference Presentation Cheat Sheet

| Question Category | Evaluator / Audience Question | Recommended Direct Response |
| :--- | :--- | :--- |
| **Data Authenticity** | *"Where does this university and cutoff data come from?"* | All records are mapped to official Ministry of Education registrar bulletins, verified Ethiopian University Entrance Examination (EUEE) matrices, and statutory cost-sharing framework under Proclamation No. 650/2009. |
| **AI Reliability** | *"How do you prevent the AI from hallucinating?"* | We implement Retrieval-Augmented Generation (RAG) with a dual-inference pipeline. The model only answers from verified institutional chunks. If confidence is low, our deterministic synthesizer provides verified registry data. |
| **Scalability** | *"How does the system handle high traffic during EUEE result releases?"* | The frontend is fully statically generated with Vite and cached via Vercel Edge CDN. The backend is containerized on Render, and PostgreSQL is hosted on Neon Serverless, which scales compute automatically with demand. |
| **Accessibility** | *"Can students on slow internet or mobile devices use GIBIConnect?"* | Yes. The platform uses zero heavy UI frameworks, achieves a sub-200ms load time, supports offline client fallback for advising, and features responsive CSS grids that adapt to budget smartphones. |
