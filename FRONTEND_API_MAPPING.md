# GIBIConnect — Frontend API Mapping

This document details the REST API mapping between frontend UI components/pages and the backend Express routes.

| Page | Component | HTTP Method | Endpoint | Request Payload / Params | Response Envelope |
|------|-----------|-------------|----------|--------------------------|-------------------|
| `/institutions` | `InstitutionFilter`, `SearchBar`, `InstitutionCard` | `GET` | `/api/institutions` | `?type=University&ownership=Public&page=1&limit=10&search=Addis` | `{ success: true, data: [Institution], pagination: { total, page, totalPages } }` |
| `/institutions/:slug` | `InstitutionHeader`, `InstitutionOverview` | `GET` | `/api/institutions/:slug` | `params: { slug }` | `{ success: true, data: InstitutionDetail }` |
| `/institutions/:id/programs` | `ProgramCard`, `ProgramFilter` | `GET` | `/api/institutions/:id/programs` | `params: { id }, ?degree=Bachelor` | `{ success: true, data: [Program] }` |
| `/institutions/:id/admissions` | `AdmissionsList` | `GET` | `/api/institutions/:id/admissions` | `params: { id }` | `{ success: true, data: [AdmissionRequirement] }` |
| `/institutions/:id/tuition` | `TuitionTable` | `GET` | `/api/institutions/:id/tuition` | `params: { id }` | `{ success: true, data: [TuitionFee] }` |
| `/institutions/:id/scholarships` | `ScholarshipCard` | `GET` | `/api/institutions/:id/scholarships` | `params: { id }` | `{ success: true, data: [Scholarship] }` |
| `/institutions/:id/facilities` | `FacilityGrid` | `GET` | `/api/institutions/:id/facilities` | `params: { id }` | `{ success: true, data: [Facility] }` |
| `/institutions/:id/reviews` | `ReviewCard`, `ReviewForm` | `GET` | `/api/institutions/:id/reviews` | `params: { id }` | `{ success: true, data: [Review] }` |
| `/institutions/:id/reviews` | `ReviewForm` | `POST` | `/api/institutions/:id/reviews` | `{ rating, title, content, department, authorRole }` | `{ success: true, data: Review, message: 'Review submitted for moderation' }` |
| `/institutions/:id/verification` | `VerificationBadge` | `GET` | `/api/institutions/:id/verification` | `params: { id }` | `{ success: true, data: { isVerified: true, verifiedBy, date } }` |
| `/programs` | `ProgramCard`, `ProgramFilter` | `GET` | `/api/programs` | `?degree=Bachelor&search=Computer&page=1` | `{ success: true, data: [Program], pagination: {...} }` |
| `/programs/:slug` | `ProgramDetails`, `ProgramMetadata` | `GET` | `/api/programs/:slug` | `params: { slug }` | `{ success: true, data: ProgramDetail }` |
| `/scholarships` | `ScholarshipCard`, `ScholarshipDeadline` | `GET` | `/api/scholarships` | `?coverageType=Full&page=1` | `{ success: true, data: [Scholarship], pagination: {...} }` |
| `/compare` | `ComparisonTable`, `ComparisonSelector` | `POST` | `/api/comparisons` | `{ institutionIds: ['id1', 'id2'] }` | `{ success: true, data: ComparisonMatrix }` |
| `/ai` | `AIChat`, `AIInput`, `AIMessage` | `POST` | `/api/ai/ask` | `{ message: string, conversationId?: string, institutionContextId?: string }` | `{ success: true, data: { reply: string, sources: [SourceReference], conversationId: string } }` |
| `/login` | `LoginForm` | `POST` | `/api/auth/login` | `{ email, password }` | `{ success: true, data: { user: User, token: string, refreshToken: string } }` |
| `/register` | `RegistrationForm` | `POST` | `/api/auth/register` | `{ firstName, lastName, email, password }` | `{ success: true, data: { user: User, token: string } }` |
| `/dashboard` | `DashboardSavedList` | `GET` | `/api/users/saved` | `Headers: { Authorization: 'Bearer ...' }` | `{ success: true, data: { institutions: [], programs: [], scholarships: [] } }` |
| `/admin/*` | `AdminDashboard` | `GET/POST/PUT` | `/api/admin/*` | `Admin Auth Header` | `{ success: true, data: ... }` |

---

### Standard Response Envelope Format
Every backend response follows a unified structure:
```json
{
  "success": true,
  "data": {},
  "message": "Optional user-friendly message",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```
In case of error:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address provided"
  }
}
```
