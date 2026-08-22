# GIBIConnect — React + Vite Frontend Structure

This document outlines the complete architectural structure, file tree, component guidelines, and integration patterns for the GIBIConnect React + Vite frontend.

---

## 1. Directory Tree

```
gibiconnect-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   └── vite.svg
│   ├── components/
│   │   ├── common/             # Base UI Foundation (Issue #11)
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── ConfirmationModal.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── Tabs.jsx
│   │   │   └── Textarea.jsx
│   │   ├── layout/             # Application Shell (Issue #11)
│   │   │   ├── Breadcrumbs.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   ├── search/             # Global Search (Issue #11)
│   │   │   └── SearchBar.jsx
│   │   ├── institutions/       # Higher Ed Discovery (Issue #12)
│   │   │   ├── InstitutionCard.jsx
│   │   │   ├── InstitutionComparisonCard.jsx
│   │   │   ├── InstitutionFilter.jsx
│   │   │   ├── InstitutionHeader.jsx
│   │   │   ├── InstitutionOverview.jsx
│   │   │   ├── InstitutionTabs.jsx
│   │   │   └── VerificationBadge.jsx
│   │   ├── programs/           # Academic Programs (Issue #12)
│   │   │   ├── ProgramCard.jsx
│   │   │   ├── ProgramDetails.jsx
│   │   │   ├── ProgramFilter.jsx
│   │   │   └── ProgramMetadata.jsx
│   │   ├── scholarships/       # Grants & Financial Aid (Issue #12)
│   │   │   ├── ScholarshipCard.jsx
│   │   │   ├── ScholarshipDeadline.jsx
│   │   │   ├── ScholarshipDetails.jsx
│   │   │   └── ScholarshipEligibility.jsx
│   │   ├── comparison/         # Institution Comparison (Issue #12)
│   │   │   ├── ComparisonRow.jsx
│   │   │   ├── ComparisonSelector.jsx
│   │   │   └── ComparisonTable.jsx
│   │   ├── ai/                 # AI Educational Consultant (Issue #13)
│   │   │   ├── AIChat.jsx
│   │   │   ├── AIInput.jsx
│   │   │   ├── AIMessage.jsx
│   │   │   ├── ConversationList.jsx
│   │   │   ├── SourceReference.jsx
│   │   │   └── VerificationStatus.jsx
│   │   ├── reviews/            # Reviews & Moderation (Issue #13)
│   │   │   ├── ModerationStatus.jsx
│   │   │   ├── RatingInput.jsx
│   │   │   ├── ReviewCard.jsx
│   │   │   └── ReviewForm.jsx
│   │   ├── auth/               # Authentication (Issue #13)
│   │   │   ├── AuthError.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── PasswordField.jsx
│   │   │   └── RegistrationForm.jsx
│   │   └── forms/              # General Form Helpers (Issue #13)
│   │       ├── ConfirmationModal.jsx
│   │       ├── FormActions.jsx
│   │       ├── FormError.jsx
│   │       └── FormField.jsx
│   ├── pages/                  # Page Containers (Ezana Issue #7-9)
│   ├── App.jsx                 # Component Explorer & Interactive Showcase
│   ├── index.css               # Tailwind CSS v4 setup
│   └── main.jsx                # React root entry
├── COMPONENT_ARCHITECTURE.md
├── FRONTEND_API_MAPPING.md
├── FRONTEND_DATABASE_MAPPING.md
├── REACT_VITE_FRONTEND_STRUCTURE.md
├── package.json
└── vite.config.js
```

---

## 2. Separation of Responsibilities

```
                      React + Vite (Frontend)
                               │
                               │ HTTP / JSON API
                               ▼
                    Node.js + Express (Backend)
                               │
                       Controllers & Services
                               │
                          Repositories
                               │
                               ▼
                     PostgreSQL Database
```

- **Ezera (UI/UX & Components)**: Owns Issues #11, #12, #13 (reusable, props-based UI components without embedded database or page-level API calls).
- **Ezana (Frontend Pages & Routing)**: Integrates Ezera's reusable components into pages (`/institutions`, `/programs`, `/scholarships`, `/compare`, `/ai`, `/login`, `/register`).
- **Fikadu (Backend API & Services)**: Express controllers, routes, and AI endpoint `POST /api/ai/ask`.
- **Ermiyas (Database & AI Retrieval)**: PostgreSQL migrations, seed data, and structured SQL retrieval for AI grounding.
- **Elsa (Authentication, Admin & QA)**: JWT authentication middleware, admin dashboard, RBAC, and test suite.

---

## 3. UI Scope Constraint
The platform scope is **exclusively Ethiopian Universities and Colleges**. High schools are deliberately excluded from filters, forms, database schema, and AI prompts.
