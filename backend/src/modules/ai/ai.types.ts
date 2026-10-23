/**
 * GIBIConnect — Hybrid RAG & Adaptive AI Tutor Type Definitions
 * Follows the Master Technical Architecture Blueprint:
 * - 3-Tier Hybrid Retrieval + Reciprocal Rank Fusion (RRF)
 * - Strict Verification Status Filtering (VERIFIED only)
 * - Context Fencing (<verified_context>) & Citation Guard
 * - 6-Stage AI Tutor Loop: Explain -> Show -> Simulate -> Practice -> Feedback -> Adapt
 */

export type VerificationStatus = 'VERIFIED' | 'PENDING_REVIEW' | 'OUTDATED' | 'CONFLICTING' | 'REJECTED';

export type AIMode = 'ADVISOR' | 'TUTOR';

export type QueryIntent =
  | 'ADMISSIONS_CUTOFF'
  | 'COST_SHARING_TUITION'
  | 'PROGRAM_CURRICULUM'
  | 'CAMPUS_FACILITIES'
  | 'SCHOLARSHIPS_CALENDAR'
  | 'PLATFORM_OVERVIEW_FEATURES'
  | 'DOCUMENT_ANALYSIS'
  | 'ACADEMIC_VISUAL'
  | 'TUTOR_CONCEPT_EXPLAIN'
  | 'TUTOR_WORKED_EXAMPLE'
  | 'TUTOR_QUIZ_PRACTICE'
  | 'GENERAL_ACADEMIC';

export type ChunkDomain =
  | 'PLATFORM_METADATA'
  | 'ADMISSIONS'
  | 'PROCLAMATION_FINANCE'
  | 'UNIVERSITY_CATALOG'
  | 'SYLLABUS_CURRICULUM'
  | 'FRESHMAN_COURSE'
  | 'EUEE_PAST_EXAM'
  | 'USER_DOCUMENT';

export interface RAGDocumentChunk {
  id: string;
  institutionCode?: string; // e.g., 'AAU', 'ASTU', 'AASTU', 'JU', 'BDU', 'MOE'
  courseCode?: string;      // e.g., 'MATH1011', 'PHYS1011', 'COSC1011', 'EUEE-MATH'
  domain: ChunkDomain;
  sourceTitle: string;
  sourceUrl?: string;
  pageNumber: number;
  chunkIndex: number;
  academicYear: string;
  content: string;
  keywords: string[];
  verificationStatus: VerificationStatus;
  embedding?: number[];
}

export interface ScoredRAGChunk {
  chunk: RAGDocumentChunk;
  vectorScore: number;
  fullTextScore: number;
  structuredBonus: number;
  rrfScore: number;
}

export interface CitationItem {
  chunkId: string;
  title: string;
  page: number;
  institutionCode?: string;
  academicYear: string;
  confidenceScore: number;
}

export interface StudentContextProfile {
  userId?: string;
  stream?: 'NATURAL' | 'SOCIAL';
  gender?: 'MALE' | 'FEMALE';
  region?: string;
  eueeScore?: number;
  targetUniversity?: string;
  targetCourseCode?: string;
}

export interface ChatHistoryTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface AttachedDocumentPayload {
  name: string;
  data?: string; // base64 or text data
  mimeType?: string;
}

export interface AIChatRequest {
  message: string;
  mode?: AIMode;
  sessionId?: string;
  documentId?: string;
  attachedDocument?: AttachedDocumentPayload;
  history?: ChatHistoryTurn[];
  studentProfile?: StudentContextProfile;
}

export interface VisualArtifact {
  imageUrl: string;
  title: string;
  subject: string;
  style: string;
  keyConcepts: string[];
  description: string;
  provider: string;
}

export interface AIChatResponse {
  reply: string;
  mode: AIMode;
  detectedIntent: QueryIntent;
  grounded: boolean;
  confidenceScore: number;
  citations: CitationItem[];
  retrievedChunksCount: number;
  suggestedFollowUps: string[];
  documentContext?: {
    documentId: string;
    fileName: string;
    totalPages: number;
    retrievedPages: number[];
  };
  visual?: VisualArtifact;
  tutorArtifact?: TutorLessonArtifact;
  timings?: {
    retrievalMs: number;
    llmMs: number;
    totalMs: number;
  };
  conversationTitle?: string;
}

// ============================================================================
// 6-STAGE AI TUTOR TYPES (Explain -> Show -> Simulate -> Practice -> Feedback -> Adapt)
// ============================================================================

export interface ConceptNode {
  conceptId: string;
  courseCode: string;
  title: string;
  prerequisites: string[];
  difficulty: 'FOUNDATION' | 'INTERMEDIATE' | 'ADVANCED';
}

export interface WorkedExampleStep {
  stepNumber: number;
  title: string;
  explanation: string;
  formulaOrCode?: string;
}

export interface DeclarativeVisualSimulation {
  type: 'CONCEPT_GRAPH' | 'STEP_DERIVATION' | 'FUNCTION_PLOT' | 'ALGORITHM_TRACE';
  title: string;
  description: string;
  nodes: { id: string; label: string; highlight?: boolean; value?: string }[];
  edges?: { from: string; to: string; label?: string }[];
  parameters?: Record<string, number | string>;
}

export interface TutorQuizQuestion {
  id: string;
  conceptId: string;
  courseCode: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  hint: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  sourceCitation: { title: string; page: number };
}

export interface TutorFlashcard {
  id: string;
  courseCode: string;
  front: string;
  back: string;
  tag: string;
}

export interface TutorLessonArtifact {
  courseCode: string;
  topicTitle: string;
  stage1Explain: {
    summary: string;
    keyPrinciples: string[];
    keyFormulas: string[];
  };
  stage2Show: {
    problemStatement: string;
    examSource: string;
    steps: WorkedExampleStep[];
    finalAnswer: string;
  };
  stage3Simulate: DeclarativeVisualSimulation;
  stage4Practice: {
    quizQuestions: TutorQuizQuestion[];
    flashcards: TutorFlashcard[];
  };
  prerequisites: string[];
  nextRecommendedTopics: string[];
}

export interface LearnerMasteryRecord {
  userId: string;
  conceptId: string;
  courseCode: string;
  masteryScore: number; // 0.0 to 1.0
  attemptsCount: number;
  correctCount: number;
  status: 'NEEDS_PREREQUISITE' | 'LEARNING' | 'PRACTICING' | 'MASTERED';
  recommendedAction: string;
  updatedAt: string;
}
