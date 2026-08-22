# GIBIConnect — Component Architecture

This document describes the component hierarchy, design system specifications, and domain-specific UI components built for GIBIConnect (Issues #11, #12, and #13 owned by Ezra).

---

## 1. Design System & Foundation Components (`src/components/common/` & `src/components/layout/`)

### Foundation Components (Issue #11)
| Component | Path | Description & Props |
|-----------|------|---------------------|
| `Button` | `components/common/Button.jsx` | Polymorphic button with variants (`primary`, `secondary`, `outline`, `danger`, `success`, `ghost`), sizes (`sm`, `md`, `lg`), `isLoading` spinner state, and icon slots (`leftIcon`, `rightIcon`). |
| `Badge` | `components/common/Badge.jsx` | Status pill component with variants (`primary`, `success`, `warning`, `danger`, `info`, `purple`), dot indicator option, and sizes (`sm`, `md`). |
| `Input` | `components/common/Input.jsx` | Form input with prefix/suffix icons, validation error display, required indicators, and helper text. |
| `Select` | `components/common/Select.jsx` | Accessible custom select dropdown component with placeholder and error states. |
| `Textarea` | `components/common/Textarea.jsx` | Multi-line text field with character count tracking and auto-expand capabilities. |
| `Card` | `components/common/Card.jsx` | Compound card container: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardBody`, `CardFooter`. |
| `Tabs` | `components/common/Tabs.jsx` | Tabbed navigation supporting `underline` and `pills` variants with numeric badge counters and icons. |
| `Pagination` | `components/common/Pagination.jsx` | Responsive pagination bar with smart ellipsis (`1 ... 4 5 6 ... 12`) and item counters. |
| `FilterPanel` | `components/common/FilterPanel.jsx` | Collapsible accordion filter panel: `FilterPanel`, `FilterSection`, `FilterCheckbox`. |
| `Modal` | `components/common/Modal.jsx` | Accessible modal dialog with backdrop blur, scroll locking, and header/body/footer partitions. |
| `ConfirmationModal` | `components/common/ConfirmationModal.jsx` | Action confirmation dialog with destructive (`danger`), warning, and primary action types. |
| `LoadingState` | `components/common/LoadingState.jsx` | Centered loading spinner and textual progress state. |
| `Skeleton` | `components/common/Skeleton.jsx` | Animated pulse skeletons for text, circular avatars, and card grid previews. |
| `ErrorState` | `components/common/ErrorState.jsx` | Error state illustration with message, error icon, and retry trigger. |
| `EmptyState` | `components/common/EmptyState.jsx` | Empty state placeholder with custom action button and explanatory text. |

### Layout Components
| Component | Path | Description & Props |
|-----------|------|---------------------|
| `Navbar` | `components/layout/Navbar.jsx` | Top navigation bar with active route highlighting, mobile drawer, brand identity, and user profile menu. |
| `Footer` | `components/layout/Footer.jsx` | Multi-column footer displaying platform scope (universities & colleges), directory links, and legal disclaimers. |
| `Breadcrumbs` | `components/layout/Breadcrumbs.jsx` | Dynamic route breadcrumbs hierarchy navigation. |

---

## 2. Higher Education Domain Components (Issue #12)

### Institution Components (`src/components/institutions/`)
| Component | Path | Description |
|-----------|------|-------------|
| `InstitutionCard` | `InstitutionCard.jsx` | Main discovery card with logo, cover banner, verified badge, ownership pill, location, and quick actions. |
| `InstitutionHeader` | `InstitutionHeader.jsx` | Hero banner with verified institution badge, contact channels (website, email, phone), and AI inquiry trigger. |
| `InstitutionOverview` | `InstitutionOverview.jsx` | Summary card grid for student enrollment, faculty size, campus address, and mission/vision statements. |
| `InstitutionTabs` | `InstitutionTabs.jsx` | Sub-navigation bar across departments, programs, admissions, tuition, facilities, and reviews. |
| `InstitutionFilter` | `InstitutionFilter.jsx` | Multi-select filters for Universities, Colleges, Public/Private ownership, and regional locations. |
| `InstitutionComparisonCard` | `InstitutionComparisonCard.jsx` | Compact badge card used inside comparison selection trays. |
| `VerificationBadge` | `VerificationBadge.jsx` | Official Ministry of Education verification seal badge with checkmark icon. |

### Academic Program Components (`src/components/programs/`)
| Component | Path | Description |
|-----------|------|-------------|
| `ProgramCard` | `ProgramCard.jsx` | Academic program card featuring degree level badge, study mode, tuition estimates, duration, and career tags. |
| `ProgramDetails` | `ProgramDetails.jsx` | Comprehensive program view covering curriculum highlights, career pathways, and admission criteria. |
| `ProgramMetadata` | `ProgramMetadata.jsx` | Formatted metric grid (degree, duration, study mode, tuition, language, credits). |
| `ProgramFilter` | `ProgramFilter.jsx` | Program filter sidebar for Bachelor, Master, PhD, TVET/Diploma, and study schedules. |

### Scholarship Components (`src/components/scholarships/`)
| Component | Path | Description |
|-----------|------|-------------|
| `ScholarshipCard` | `ScholarshipCard.jsx` | Scholarship card displaying award coverage, sponsoring institution, and deadline countdown. |
| `ScholarshipDetails` | `ScholarshipDetails.jsx` | Deep-dive scholarship page with required application documents, eligibility, and process. |
| `ScholarshipEligibility` | `ScholarshipEligibility.jsx` | Checklist view for academic GPA, nationality, and faculty eligibility criteria. |
| `ScholarshipDeadline` | `ScholarshipDeadline.jsx` | Dynamic deadline badge showing days remaining and closing soon alerts. |

### Comparison Matrix Components (`src/components/comparison/`)
| Component | Path | Description |
|-----------|------|-------------|
| `ComparisonSelector` | `ComparisonSelector.jsx` | Interactive tray to search and select 2 to 4 universities/colleges for comparison. |
| `ComparisonTable` | `ComparisonTable.jsx` | Side-by-side comparison matrix with difference highlighting toggle and AI summary CTA. |
| `ComparisonRow` | `ComparisonRow.jsx` | Individual row in the comparison table with diff highlighting. |

---

## 3. AI, Review, Authentication & Form Components (Issue #13)

### AI Consultation Components (`src/components/ai/`)
| Component | Path | Description |
|-----------|------|-------------|
| `AIChat` | `AIChat.jsx` | Interactive chat interface with sticky input, suggested prompts, auto-scrolling, and database grounding. |
| `AIMessage` | `AIMessage.jsx` | Chat message bubble supporting markdown, avatar distinction, timestamp, and source references. |
| `AIInput` | `AIInput.jsx` | Text prompt input with quick question suggestions pills and send button. |
| `ConversationList` | `ConversationList.jsx` | Sidebar drawer of past and current AI consultation threads. |
| `SourceReference` | `SourceReference.jsx` | Clickable citation pill linking AI answers to verified university, program, or scholarship records. |
| `VerificationStatus` | `VerificationStatus.jsx` | Pulsing trust badge confirming database-grounded SQL retrieval without LLM hallucination. |

### Review & Feedback Components (`src/components/reviews/`)
| Component | Path | Description |
|-----------|------|-------------|
| `RatingInput` | `RatingInput.jsx` | Interactive 5-star rating selector with hover preview and rating labels. |
| `ModerationStatus` | `ModerationStatus.jsx` | Badge displaying review status (`Approved`, `Pending`, `Flagged`). |
| `ReviewCard` | `ReviewCard.jsx` | Student review card with author affiliation, star rating, verified status, and helpful vote button. |
| `ReviewForm` | `ReviewForm.jsx` | Academic review submission form with department selector and moderation guidelines notice. |

### Authentication & General Forms (`src/components/auth/` & `src/components/forms/`)
| Component | Path | Description |
|-----------|------|-------------|
| `LoginForm` | `components/auth/LoginForm.jsx` | User login form with email, password, remember me, validation, and error alert. |
| `RegistrationForm` | `components/auth/RegistrationForm.jsx` | User registration form with name, email, password strength bar, and terms agreement. |
| `PasswordField` | `components/auth/PasswordField.jsx` | Password input with toggleable show/hide eye action and strength meter. |
| `AuthError` | `components/auth/AuthError.jsx` | Dismissible alert box for authentication and credential errors. |
| `FormField` | `components/forms/FormField.jsx` | Standard form field wrapper with label, error display, and required indicators. |
| `FormError` | `components/forms/FormError.jsx` | Validation error component with warning icon. |
| `FormActions` | `components/forms/FormActions.jsx` | Reusable submit/cancel button row with loading and dirty state management. |
