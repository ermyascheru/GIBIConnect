# GIBIConnect — Higher Education Intelligence & Grounded AI Academic Advising Platform

[![Vercel Deployment](https://img.shields.io/badge/Frontend-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![Render Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat&logo=render)](https://render.com)
[![Neon Database](https://img.shields.io/badge/Database-Neon%20Postgres-00E599?style=flat&logo=postgresql)](https://neon.tech)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)

GIBIConnect is Ethiopia’s premier digital higher-education platform, connecting secondary school seniors, university students, and parents with verified institutional data, 5-year degree curricula, admissions criteria, statutory cost-sharing calculators, and grounded AI academic advising.

The platform eliminates severe information fragmentation across Ethiopian universities by providing an authoritative single source of truth backed by relational data, vector embeddings, and an interactive modern web application.

---

## 1. Core Platform Capabilities

### 1.1 Verified Higher Education Institutional Directory
* Comprehensive coverage of **18+ accredited Ethiopian institutions**, including flagship research universities (AAU, ASTU, AASTU, UoG, BDU, JU, HU, MU, AMU, HRU, DMU, DDU) and private institutions (St. Mary's, Addis Ababa Medical College).
* Authentic campus photography: main entrance gates, academic quadrangles, laboratories, and student life imagery.
* Detailed breakdowns of academic faculties, departments, active campus facilities, and leadership.

### 1.2 Official Admissions & EUEE Cut-Off Thresholds
* Authentic 2016/2017 E.C. national university entrance examination (EUEE/ESEE) matriculation cut-off points across Natural Science and Social Science streams.
* Transparent gender quotas (Male vs. Female thresholds) and affirmative action quotas for candidates from developing/emerging regions (Afar, Somali, Benishangul-Gumuz, Gambella, and pastoralist areas).
* Competitive department allocation guidelines (e.g., Freshman Year CGPA thresholds for Software, Electrical, Civil, and Mechanical Engineering).

### 1.3 Grounded AI Academic Advisor & STEM Tutor
* **Zero-Hallucination Retrieval-Augmented Generation (RAG)**: Answers student queries strictly grounded in official Ministry of Education documents and university registry records.
* **Typo & Phrasing Invariance**: Robust entity resolution and token boundary matching that handles colloquial queries (e.g. *"cutoff point of engineering in goder university"*, *"aastu software marks"*, *"how much is aau medicine tuition"*).
* **Multi-Question & Multi-Institution Support**: Automatically decomposes compound prompts (e.g. *"What is the cutoff for engineering in Gondar and what about AAU medicine?"*) and answers every sub-question in structured sections.
* **6-Stage Freshman STEM Tutor**: Interactive, step-by-step tutoring modules for freshman courses:
  - **Calculus I & II (MATH1011)**: Limits, derivatives, integration, optimization.
  - **General Physics (PHYS1011)**: 2D projectile motion kinematics, vector algebra, work-energy theorems.
  - **Introduction to Computer Science (COSC1011)**: Pointers, dynamic memory, arrays, recursion.
  - **General Chemistry (CHEM1011)**: Reaction dynamics, pH calculation, chemical equilibrium.
* **KaTeX LaTeX Math Rendering**: Clear formatting for all mathematical equations ($...$ and $$...$$).

### 1.4 Statutory Cost-Sharing Calculator (Proclamation No. 650/2009)
* Calculates student tuition subsidies, dormitory expenses, and cafeteria meal costs under Ethiopian Federal Higher Education Proclamation No. 650/2009 and Regulation No. 154/2008.
* Clarifies the **100% upfront government tuition subsidy** for regular public university students.
* Models post-graduation income-contingent repayment schedules (10% monthly payroll deduction upon formal employment).

### 1.5 Academic Programs & Curricula Catalog
* Explores 114+ accredited degree programs across STEM, Health Sciences, Business, Natural Sciences, and Social Sciences.
* Detailed 5-year degree roadmaps, semester course sequences, and ECTS credit distributions.

### 1.6 Peer Tutor Marketplace & Resource Vault
* **Peer Tutor Network**: Connects undergraduate students with verified top-performing peer mentors from AAiT, ASTU, Hawassa, and Jimma.
* **Academic Resource Vault**: Searchable repository of 39+ verified educational materials including university syllabi, lecture slides, and past national exit exam papers.

---

## 2. System Architecture

```
                       [ USER DEVICE / BROWSER ]
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
    [ VERCEL: FRONTEND ]                    [ RENDER: BACKEND API ]
    React 19 + TypeScript + Vite            Node.js + Express REST API
    Tailwind CSS + Lucide + KaTeX           3-Tier Hybrid RAG Orchestrator
    (gibiconnect.vercel.app)                (gibiconnect.onrender.com)
                                                        │ (SSL / TLS)
                                                        ▼
                                              [ NEON: POSTGRESQL ]
                                              Serverless Cloud Postgres 16
                                              pgvector 768-dim HNSW Index
                                              37 Relational Tables
```

---

## 3. Repository Structure

```
gibiconnect/
├── frontend/                 # ACTIVE: Modern React 19 + TypeScript + Vite Application
│   ├── public/               # Verified campus imagery, university logos, entrance gates
│   ├── src/
│   │   ├── components/       # Reusable UI widgets, Modals, Navbar, AI Advisor components
│   │   ├── config/           # API endpoints and environment configuration
│   │   ├── data/             # Mock datasets, campus media catalog, university metadata
│   │   ├── pages/            # Page views (Home, CampusDetail, AIAdvisor, Admissions, etc.)
│   │   ├── types/            # TypeScript interfaces and domain schemas
│   │   └── utils/            # Institution resolvers, SVG visual synthesizers
│   ├── package.json          # Frontend dependencies (React 19, Vite, Lucide, KaTeX)
│   ├── vercel.json           # Vercel SPA routing & rewrites configuration
│   └── vite.config.ts        # Vite build tool configuration
│
├── legacy-frontend/          # ARCHIVED: Original early-stage HTML/JS/CSS prototype
│   ├── assets/               # Early logos, icons, and hero illustrations
│   ├── css/                  # Early CSS stylesheets
│   ├── js/                   # Vanilla JavaScript ES modules
│   ├── pages/                # Early static HTML pages (explore.html, admissions.html, etc.)
│   └── package.json          # Early tooling configuration
│
├── backend/                  # RESTful API Gateway & AI RAG Engine
│   ├── src/
│   │   ├── modules/ai/       # Hybrid RAG retriever, vector search, document reader
│   │   ├── modules/institutions/ # Institutional CRUD, faculties, facilities controllers
│   │   └── server.ts         # Express server entry point
│   └── prisma/               # Database schema & Neon migrations
│
├── vercel.json               # Monorepo root Vercel build & route rules
├── package.json              # Monorepo scripts (builds frontend automatically)
└── README.md                 # Project documentation
```


