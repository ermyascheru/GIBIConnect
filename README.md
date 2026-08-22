# GIBIConnect — Frontend & Design System (React + Vite)

GIBIConnect is an educational discovery and AI consultation platform for Ethiopian higher education (Universities and Colleges).

This repository contains the complete frontend design system, accessible UI component foundation, and interactive component showcase built with **React 19**, **Vite**, and **Tailwind CSS**.

---

## 🏛️ Project Scope
The platform scope is **strictly accredited Universities and Colleges** across Ethiopia. High school directories, fields, and search scopes are excluded by technical architecture design.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser to explore the interactive component showcase.

### 3. Run Lint & Build
```bash
npm run lint    # Oxlint validation
npm run build   # Production Vite bundle build
```

---

## 📁 Component Hierarchy (Ezra UI Ownership)

```
src/components/
├── common/             # Design System & UI Foundation (Issue #11)
│   ├── Badge.jsx
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── ConfirmationModal.jsx
│   ├── EmptyState.jsx
│   ├── ErrorState.jsx
│   ├── FilterPanel.jsx
│   ├── Input.jsx
│   ├── LoadingState.jsx
│   ├── Modal.jsx
│   ├── Pagination.jsx
│   ├── Select.jsx
│   ├── Skeleton.jsx
│   ├── Tabs.jsx
│   └── Textarea.jsx
├── layout/             # Application Shell (Issue #11)
│   ├── Breadcrumbs.jsx
│   ├── Footer.jsx
│   └── Navbar.jsx
├── search/             # Global Search (Issue #11)
│   └── SearchBar.jsx
├── institutions/       # Higher Education Discovery (Issue #12)
│   ├── InstitutionCard.jsx
│   ├── InstitutionComparisonCard.jsx
│   ├── InstitutionFilter.jsx
│   ├── InstitutionHeader.jsx
│   ├── InstitutionOverview.jsx
│   ├── InstitutionTabs.jsx
│   └── VerificationBadge.jsx
├── programs/           # Academic Programs (Issue #12)
│   ├── ProgramCard.jsx
│   ├── ProgramDetails.jsx
│   ├── ProgramFilter.jsx
│   └── ProgramMetadata.jsx
├── scholarships/       # Grants & Financial Aid (Issue #12)
│   ├── ScholarshipCard.jsx
│   ├── ScholarshipDeadline.jsx
│   ├── ScholarshipDetails.jsx
│   └── ScholarshipEligibility.jsx
├── comparison/         # Institution Comparison Matrix (Issue #12)
│   ├── ComparisonRow.jsx
│   ├── ComparisonSelector.jsx
│   └── ComparisonTable.jsx
├── ai/                 # Database-Grounded AI Consultant (Issue #13)
│   ├── AIChat.jsx
│   ├── AIInput.jsx
│   ├── AIMessage.jsx
│   ├── ConversationList.jsx
│   ├── SourceReference.jsx
│   └── VerificationStatus.jsx
├── reviews/            # Verified Reviews & Moderation (Issue #13)
│   ├── ModerationStatus.jsx
│   ├── RatingInput.jsx
│   ├── ReviewCard.jsx
│   └── ReviewForm.jsx
├── auth/               # User Authentication (Issue #13)
│   ├── AuthError.jsx
│   ├── LoginForm.jsx
│   ├── PasswordField.jsx
│   └── RegistrationForm.jsx
└── forms/              # General Form Helpers (Issue #13)
    ├── ConfirmationModal.jsx
    ├── FormActions.jsx
    ├── FormError.jsx
    └── FormField.jsx
```

---

## 📚 Architectural Documentation
- [`COMPONENT_ARCHITECTURE.md`](./COMPONENT_ARCHITECTURE.md) — Detailed prop interfaces and design system guidelines.
- [`FRONTEND_API_MAPPING.md`](./FRONTEND_API_MAPPING.md) — REST API endpoints and data contract mapping.
- [`FRONTEND_DATABASE_MAPPING.md`](./FRONTEND_DATABASE_MAPPING.md) — PostgreSQL database table-to-feature mapping.
- [`REACT_VITE_FRONTEND_STRUCTURE.md`](./REACT_VITE_FRONTEND_STRUCTURE.md) — Team boundary separation and workflow guidelines.
