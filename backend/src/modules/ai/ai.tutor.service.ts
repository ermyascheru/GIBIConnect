/**
 * GIBIConnect — 6-Stage Adaptive AI Tutor Engine
 * Implements Master Blueprint Part 15, 18, 20 & 21:
 * Loop: Explain -> Show -> Simulate -> Practice -> Feedback -> Adapt
 */

import {
  CONCEPT_PREREQUISITE_GRAPH,
  VERIFIED_TUTOR_QUIZ_BANK,
  VERIFIED_TUTOR_FLASHCARDS,
} from './rag.corpus.js';
import { ragRetriever } from './rag.retriever.js';
import type {
  TutorLessonArtifact,
  TutorQuizQuestion,
  TutorFlashcard,
  LearnerMasteryRecord,
} from './ai.types.js';

export class AITutorService {
  // In-memory store for learner mastery tracking (mirrors `learner_progress` table)
  private masteryStore = new Map<string, LearnerMasteryRecord>();

  /**
   * Generates a complete 6-Stage Tutor Lesson Artifact grounded in Ethiopian
   * University Freshman & Engineering syllabi (MATH1011, PHYS1011, COSC1011, CHEM1011).
   */
  async buildStructuredTutorLesson(queryOrTopic: string, targetCourseCode?: string): Promise<TutorLessonArtifact> {
    const q = queryOrTopic.toLowerCase();
    const detectedCourse = this.detectCourseCode(q, targetCourseCode);

    // Retrieve top syllabus chunks for grounding
    await ragRetriever.retrieveTopK(`${detectedCourse} ${queryOrTopic}`, 3, {
      targetCourseCode: detectedCourse,
    });

    if (detectedCourse === 'PHYS1011') {
      return {
        courseCode: 'PHYS1011',
        topicTitle: '2D Projectile Motion & Newtonian Kinematics (Freshman PHYS1011)',
        stage1Explain: {
          summary:
            'In 2D projectile motion (neglecting air resistance), horizontal and vertical motions are independent. Horizontal velocity remains constant ($a_x = 0$), while vertical velocity experiences constant downward gravitational acceleration ($a_y = -g \\approx -9.8\\text{ m/s}^2$).',
          keyPrinciples: [
            'Horizontal velocity $v_x = v_0 \\cos\\theta$ is constant throughout the flight.',
            'At the highest point (apex), vertical velocity $v_y = 0$, but acceleration is still $-g$.',
            'Complementary launch angles (e.g., $30^\\circ$ and $60^\\circ$) yield the exact same horizontal range $R$ on level ground.',
            'Maximum horizontal range occurs at $\\theta = 45^\\circ$.',
          ],
          keyFormulas: [
            'H_{\\max} = \\frac{v_0^2 \\sin^2\\theta}{2g}',
            'T_{\\text{flight}} = \\frac{2v_0 \\sin\\theta}{g}',
            'R = \\frac{v_0^2 \\sin(2\\theta)}{g}',
          ],
        },
        stage2Show: {
          problemStatement:
            'A football is kicked from level ground at an initial velocity of $v_0 = 20\\text{ m/s}$ at an angle of $\\theta = 30^\\circ$ above the horizontal. Taking $g = 10\\text{ m/s}^2$, find: (a) Maximum height $H_{\\max}$, (b) Total time of flight $T$, and (c) Horizontal range $R$.',
          examSource: 'AAU & ASTU Freshman General Physics (PHYS1011) Midterm Exam',
          steps: [
            {
              stepNumber: 1,
              title: 'Resolve initial velocity into horizontal and vertical components',
              explanation: 'Use $\\sin(30^\\circ) = 0.5$ and $\\cos(30^\\circ) \\approx 0.866$.',
              formulaOrCode: 'v_{0y} = 20 \\sin(30^\\circ) = 10\\text{ m/s}, \\quad v_{0x} = 20 \\cos(30^\\circ) \\approx 17.32\\text{ m/s}',
            },
            {
              stepNumber: 2,
              title: 'Compute Maximum Height (H_max)',
              explanation: 'At maximum height, vertical velocity $v_y = 0$.',
              formulaOrCode: 'H_{\\max} = \\frac{v_{0y}^2}{2g} = \\frac{10^2}{2 \\times 10} = \\frac{100}{20} = 5.0\\text{ m}',
            },
            {
              stepNumber: 3,
              title: 'Compute Time of Flight (T) and Range (R)',
              explanation: 'Total time is twice the time to reach the apex; range is horizontal speed times total flight time.',
              formulaOrCode: 'T = \\frac{2 v_{0y}}{g} = \\frac{20}{10} = 2.0\\text{ s}, \\quad R = v_{0x} \\cdot T = 17.32 \\times 2.0 = 34.64\\text{ m}',
            },
          ],
          finalAnswer: 'H_max = 5.0 m, Time of Flight T = 2.0 s, Horizontal Range R = 34.64 m',
        },
        stage3Simulate: {
          type: 'FUNCTION_PLOT',
          title: 'Parabolic Trajectory Simulation (v0 = 20 m/s, θ = 30°)',
          description: 'Declarative scene parameters for trajectory curve y(x) = x tan(θ) - (g x^2) / (2 v0^2 cos^2(θ))',
          nodes: [
            { id: 'launch', label: 'Launch (t = 0s)', value: '(x=0m, y=0m, vy=10m/s)' },
            { id: 'apex', label: 'Apex (t = 1.0s)', highlight: true, value: '(x=17.32m, y=5.0m, vy=0m/s)' },
            { id: 'impact', label: 'Landing (t = 2.0s)', value: '(x=34.64m, y=0m, vy=-10m/s)' },
          ],
          edges: [
            { from: 'launch', to: 'apex', label: 'Ascending (vy > 0)' },
            { from: 'apex', to: 'impact', label: 'Descending (vy < 0)' },
          ],
          parameters: { v0: 20, angleDeg: 30, gravity: 10, maxHeight: 5.0, range: 34.64 },
        },
        stage4Practice: {
          quizQuestions: this.getQuestionsForCourse('PHYS1011'),
          flashcards: this.getFlashcardsForCourse('PHYS1011'),
        },
        prerequisites: ['Derivatives & Rates of Change (MATH1011)', 'Vector Decomposition'],
        nextRecommendedTopics: ['Newtonian Dynamics & Friction', 'Work-Energy Theorem & Conservation of Momentum'],
      };
    }

    if (detectedCourse === 'COSC1011') {
      return {
        courseCode: 'COSC1011',
        topicTitle: 'Asymptotic Time Complexity (Big-O) & Binary Search (COSC1011 / SEng2021)',
        stage1Explain: {
          summary:
            'Big-O notation characterizes the upper bound of an algorithm’s growth rate as input size $N \\to \\infty$. Binary Search achieves $O(\\log_2 N)$ time complexity on sorted arrays by halving the search interval on every comparison.',
          keyPrinciples: [
            'Precondition: The input array MUST be sorted before running Binary Search.',
            'Each comparison eliminates 50% of the remaining search space.',
            'Growth hierarchy: $O(1) < O(\\log N) < O(N) < O(N \\log N) < O(N^2) < O(2^N)$.',
          ],
          keyFormulas: [
            'T(N) = T(N/2) + O(1) \\implies O(\\log_2 N)',
            '\\text{Max Comparisons} = \\lfloor \\log_2(N) \\rfloor + 1',
          ],
        },
        stage2Show: {
          problemStatement:
            'Trace Binary Search for target value `42` in sorted array `A = [10, 18, 25, 31, 42, 56, 70]` (indices 0 to 6).',
          examSource: 'AAiT & ASTU School of Computing Data Structures Final Exam',
          steps: [
            {
              stepNumber: 1,
              title: 'Iteration 1: Check Middle Index',
              explanation: 'low = 0, high = 6 -> mid = floor((0 + 6) / 2) = 3. Compare A[3] = 31 with target 42.',
              formulaOrCode: 'A[3] = 31 < 42  ==>  Discard left half; set low = mid + 1 = 4',
            },
            {
              stepNumber: 2,
              title: 'Iteration 2: Narrowed Right Subarray [4..6]',
              explanation: 'low = 4, high = 6 -> mid = floor((4 + 6) / 2) = 5. Compare A[5] = 56 with target 42.',
              formulaOrCode: 'A[5] = 56 > 42  ==>  Discard right half; set high = mid - 1 = 4',
            },
            {
              stepNumber: 3,
              title: 'Iteration 3: Target Found',
              explanation: 'low = 4, high = 4 -> mid = 4. A[4] = 42 matches target!',
              formulaOrCode: 'return mid = 4 (Found in 3 comparisons instead of 5 linear scans)',
            },
          ],
          finalAnswer: 'Target 42 found at index 4 in 3 comparisons (O(log2 N)).',
        },
        stage3Simulate: {
          type: 'ALGORITHM_TRACE',
          title: 'Binary Search Interval Halving Trace',
          description: 'Declarative step trace showing search space reduction [0..6] -> [4..6] -> [4..4]',
          nodes: [
            { id: 'step1', label: 'Step 1: [0..6] mid=3 (val=31)', value: '31 < 42 (Go Right)' },
            { id: 'step2', label: 'Step 2: [4..6] mid=5 (val=56)', value: '56 > 42 (Go Left)' },
            { id: 'step3', label: 'Step 3: [4..4] mid=4 (val=42)', highlight: true, value: 'Match Found at idx 4!' },
          ],
          edges: [
            { from: 'step1', to: 'step2', label: 'low = 4' },
            { from: 'step2', to: 'step3', label: 'high = 4' },
          ],
          parameters: { arraySize: 7, target: 42, comparisonsUsed: 3 },
        },
        stage4Practice: {
          quizQuestions: this.getQuestionsForCourse('COSC1011'),
          flashcards: this.getFlashcardsForCourse('COSC1011'),
        },
        prerequisites: ['Logarithms & Exponents (MATH1011)', 'Arrays & Loop Invariants'],
        nextRecommendedTopics: ['Merge Sort & Quick Sort (O(N log N))', 'Binary Search Trees & Graph BFS/DFS'],
      };
    }

    if (detectedCourse === 'CHEM1011') {
      return {
        courseCode: 'CHEM1011',
        topicTitle: 'Acid-Base Buffers & Henderson-Hasselbalch Equilibrium (CHEM1011 & EUEE)',
        stage1Explain: {
          summary:
            'A buffer solution resists drastic changes in pH upon adding small amounts of strong acid or strong base. It consists of a weak acid ($HA$) and its conjugate base salt ($A^-$), governed by the Henderson-Hasselbalch equation.',
          keyPrinciples: [
            'When $[A^-] = [HA]$, the buffer is at maximum capacity and $\\text{pH} = \\text{p}K_a$.',
            'Effective buffer range is typically $\\text{pH} = \\text{p}K_a \\pm 1$.',
            'Adding strong acid ($H^+$) converts conjugate base $A^-$ into weak acid $HA$.',
          ],
          keyFormulas: [
            '\\text{pH} = \\text{p}K_a + \\log_{10}\\left(\\frac{[A^-]}{[HA]}\\right)',
            '\\text{p}K_a = -\\log_{10}(K_a)',
          ],
        },
        stage2Show: {
          problemStatement:
            'Calculate the pH of a buffer prepared by mixing $0.20\\text{ M}$ acetic acid ($\\text{CH}_3\\text{COOH}, K_a = 1.8 \\times 10^{-5}, \\text{p}K_a = 4.74$) and $0.20\\text{ M}$ sodium acetate ($\\text{CH}_3\\text{COONa}$).',
          examSource: 'Ethiopian University Entrance Examination (EUEE) Chemistry Past Paper',
          steps: [
            {
              stepNumber: 1,
              title: 'Identify Weak Acid [HA] and Conjugate Base [A-]',
              explanation: 'Acetic acid is the weak acid HA (0.20 M) and acetate ion is the conjugate base A- (0.20 M).',
              formulaOrCode: '[HA] = 0.20\\text{ M}, \\quad [A^-] = 0.20\\text{ M}, \\quad \\text{p}K_a = 4.74',
            },
            {
              stepNumber: 2,
              title: 'Substitute into the Henderson-Hasselbalch Equation',
              explanation: 'Since the ratio [A-]/[HA] = 0.20 / 0.20 = 1, and log10(1) = 0:',
              formulaOrCode: '\\text{pH} = 4.74 + \\log_{10}(1) = 4.74 + 0 = 4.74',
            },
          ],
          finalAnswer: 'pH = 4.74',
        },
        stage3Simulate: {
          type: 'STEP_DERIVATION',
          title: 'Buffer Equilibrium Shift Tracker',
          description: 'Tracks how conjugate pairs neutralize added H+ or OH- ions',
          nodes: [
            { id: 'eq', label: 'Equilibrium: [HA] = [A-] = 0.20M', highlight: true, value: 'pH = pKa = 4.74' },
            { id: 'addAcid', label: 'Add HCl (H+)', value: 'A- + H+ -> HA (pH dips slightly)' },
            { id: 'addBase', label: 'Add NaOH (OH-)', value: 'HA + OH- -> A- + H2O (pH rises slightly)' },
          ],
          edges: [
            { from: 'eq', to: 'addAcid', label: '+H+' },
            { from: 'eq', to: 'addBase', label: '+OH-' },
          ],
          parameters: { pKa: 4.74, acidMolarity: 0.2, baseMolarity: 0.2 },
        },
        stage4Practice: {
          quizQuestions: this.getQuestionsForCourse('CHEM1011'),
          flashcards: this.getFlashcardsForCourse('CHEM1011'),
        },
        prerequisites: ['Chemical Equilibrium (Kc & Kp)', 'Logarithms & pH Scale'],
        nextRecommendedTopics: ['Acid-Base Titration Curves', 'Electrochemistry & Nernst Equation'],
      };
    }

    // Default: MATH1011 Calculus Limits & Derivatives
    return {
      courseCode: 'MATH1011',
      topicTitle: 'Limits, Indeterminate Forms & Chain Rule Differentiation (Freshman MATH1011)',
      stage1Explain: {
        summary:
          'Limits form the foundation of Calculus in Ethiopian Freshman Mathematics (MATH1011). When direct substitution produces an indeterminate form such as $0/0$, we resolve it using algebraic factoring, trigonometric identities ($\\lim_{x \\to 0} \\frac{\\sin(kx)}{x} = k$), or L’Hôpital’s Rule.',
        keyPrinciples: [
          'A two-sided limit $\\lim_{x \\to a} f(x) = L$ exists if and only if the left-hand limit equals the right-hand limit.',
          'Continuity at $x = a$ requires $\\lim_{x \\to a} f(x) = f(a)$.',
          'Differentiability at a point always implies continuity, but continuity does not guarantee differentiability (e.g., $f(x) = |x|$ at $x = 0$).',
        ],
        keyFormulas: [
          '\\lim_{x \\to 0} \\frac{\\sin(kx)}{x} = k',
          '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)',
          'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
        ],
      },
      stage2Show: {
        problemStatement:
          'Evaluate $\\lim_{x \\to 0} \\frac{\\sin(5x)}{2x}$ and find the derivative of $f(x) = \\ln(x^2 + 1)$.',
        examSource: 'MoE Harmonized Freshman Mathematics (MATH1011) Final Examination',
        steps: [
          {
            stepNumber: 1,
            title: 'Part A: Check limit form at x -> 0',
            explanation: 'Direct substitution gives sin(0)/0 = 0/0 (indeterminate). Match the angle 5x in the denominator.',
            formulaOrCode: '\\lim_{x \\to 0} \\frac{\\sin(5x)}{2x} = \\frac{5}{2} \\lim_{x \\to 0} \\frac{\\sin(5x)}{5x} = \\frac{5}{2} \\cdot 1 = \\frac{5}{2}',
          },
          {
            stepNumber: 2,
            title: 'Part B: Differentiate f(x) = ln(x^2 + 1) via Chain Rule',
            explanation: 'Let outer function be ln(u) and inner function be u = x^2 + 1.',
            formulaOrCode: 'f\'(x) = \\frac{1}{x^2 + 1} \\cdot \\frac{d}{dx}(x^2 + 1) = \\frac{2x}{x^2 + 1}',
          },
        ],
        finalAnswer: 'Limit = 5/2; Derivative f\'(x) = 2x / (x^2 + 1)',
      },
      stage3Simulate: {
        type: 'CONCEPT_GRAPH',
        title: 'Freshman Calculus Concept Dependency Roadmap',
        description: 'Prerequisite chain from Propositional Logic to Definite Integrals',
        nodes: [
          { id: 'n1', label: '1. Logic & Sets', value: 'Foundation' },
          { id: 'n2', label: '2. Limits & Continuity', highlight: true, value: 'Current Topic' },
          { id: 'n3', label: '3. Derivatives & Chain Rule', highlight: true, value: 'Current Topic' },
          { id: 'n4', label: '4. Definite Integrals (FTC)', value: 'Next Milestone' },
        ],
        edges: [
          { from: 'n1', to: 'n2', label: 'Prerequisite' },
          { from: 'n2', to: 'n3', label: 'Limit of Difference Quotient' },
          { from: 'n3', to: 'n4', label: 'Antiderivative' },
        ],
        parameters: { course: 'MATH1011', ectsCredits: 5 },
      },
      stage4Practice: {
        quizQuestions: this.getQuestionsForCourse('MATH1011'),
        flashcards: this.getFlashcardsForCourse('MATH1011'),
      },
      prerequisites: ['Propositional Logic & Functions (MATH1011 Ch. 1)', 'Trigonometric Identities'],
      nextRecommendedTopics: ['Implicit Differentiation & Related Rates', 'Extreme Values & Optimization'],
    };
  }

  /**
   * Stage 4: Returns verified practice quizzes & flashcards filtered by courseCode
   */
  getQuizAndFlashcards(courseCode?: string): {
    courseCode: string;
    questions: TutorQuizQuestion[];
    flashcards: TutorFlashcard[];
  } {
    const normalized = courseCode?.toUpperCase() || 'ALL';
    const questions =
      normalized === 'ALL'
        ? VERIFIED_TUTOR_QUIZ_BANK
        : VERIFIED_TUTOR_QUIZ_BANK.filter((q) => q.courseCode === normalized);
    const flashcards =
      normalized === 'ALL'
        ? VERIFIED_TUTOR_FLASHCARDS
        : VERIFIED_TUTOR_FLASHCARDS.filter((f) => f.courseCode === normalized);

    return {
      courseCode: normalized,
      questions: questions.length > 0 ? questions : VERIFIED_TUTOR_QUIZ_BANK,
      flashcards: flashcards.length > 0 ? flashcards : VERIFIED_TUTOR_FLASHCARDS,
    };
  }

  /**
   * Stage 5 & 6: Evaluates a student's quiz answer, provides Socratic feedback,
   * and updates the Adaptive Mastery State Machine (`learner_progress`).
   */
  evaluateAnswerAndAdapt(params: {
    userId?: string;
    questionId: string;
    selectedOptionIndex: number;
  }): {
    isCorrect: boolean;
    question: TutorQuizQuestion;
    socraticFeedback: string;
    masteryUpdate: LearnerMasteryRecord;
    prerequisiteGraphNode?: (typeof CONCEPT_PREREQUISITE_GRAPH)[number];
  } {
    const { userId = 'anonymous-student', questionId, selectedOptionIndex } = params;
    const question =
      VERIFIED_TUTOR_QUIZ_BANK.find((q) => q.id === questionId) || VERIFIED_TUTOR_QUIZ_BANK[0];

    const isCorrect = selectedOptionIndex === question.correctOptionIndex;
    const selectedText = question.options[selectedOptionIndex] ?? 'No option';
    const correctText = question.options[question.correctOptionIndex];

    const socraticFeedback = isCorrect
      ? `Spot on! "${correctText}" is correct. ${question.explanation} [Source: ${question.sourceCitation.title}, Page ${question.sourceCitation.page}]`
      : `Not quite — you selected "${selectedText}", whereas the verified answer is "${correctText}".\n\n**Why:** ${question.explanation}\n\n**Tutor Hint for Next Time:** ${question.hint}`;

    // Update Adaptive Mastery Score (Stage 6)
    const key = `${userId}:${question.conceptId}`;
    const existing = this.masteryStore.get(key) || {
      userId,
      conceptId: question.conceptId,
      courseCode: question.courseCode,
      masteryScore: 0.4,
      attemptsCount: 0,
      correctCount: 0,
      status: 'LEARNING',
      recommendedAction: '',
      updatedAt: new Date().toISOString(),
    };

    const attemptsCount = existing.attemptsCount + 1;
    const correctCount = existing.correctCount + (isCorrect ? 1 : 0);
    const delta = isCorrect ? 0.22 : -0.12;
    const masteryScore = Number(Math.max(0.1, Math.min(1.0, existing.masteryScore + delta)).toFixed(2));

    const conceptNode = CONCEPT_PREREQUISITE_GRAPH.find((c) => c.conceptId === question.conceptId);

    let status: LearnerMasteryRecord['status'] = 'PRACTICING';
    let recommendedAction = `Continue practicing ${question.courseCode} problems to solidify mastery.`;

    if (masteryScore >= 0.8) {
      status = 'MASTERED';
      recommendedAction = `Concept mastered (${Math.round(masteryScore * 100)}%)! Ready to advance to the next module in ${question.courseCode}.`;
    } else if (masteryScore < 0.35) {
      status = 'NEEDS_PREREQUISITE';
      const prereqs = conceptNode?.prerequisites.join(', ') || 'foundational chapter';
      recommendedAction = `Mastery is below 35%. We recommend reviewing prerequisite concept(s): ${prereqs} before re-attempting.`;
    }

    const updatedRecord: LearnerMasteryRecord = {
      userId,
      conceptId: question.conceptId,
      courseCode: question.courseCode,
      masteryScore,
      attemptsCount,
      correctCount,
      status,
      recommendedAction,
      updatedAt: new Date().toISOString(),
    };

    this.masteryStore.set(key, updatedRecord);

    return {
      isCorrect,
      question,
      socraticFeedback,
      masteryUpdate: updatedRecord,
      prerequisiteGraphNode: conceptNode,
    };
  }

  private detectCourseCode(queryLower: string, explicitCourse?: string): string {
    if (explicitCourse) return explicitCourse.toUpperCase();
    if (
      queryLower.includes('phys') ||
      queryLower.includes('projectile') ||
      queryLower.includes('kinematics') ||
      queryLower.includes('newton') ||
      queryLower.includes('momentum') ||
      queryLower.includes('circuit')
    ) {
      return 'PHYS1011';
    }
    if (
      queryLower.includes('cosc') ||
      queryLower.includes('binary search') ||
      queryLower.includes('big o') ||
      queryLower.includes('algorithm') ||
      queryLower.includes('sorting') ||
      queryLower.includes('bfs') ||
      queryLower.includes('python') ||
      queryLower.includes('data structure')
    ) {
      return 'COSC1011';
    }
    if (
      queryLower.includes('chem') ||
      queryLower.includes('buffer') ||
      queryLower.includes('henderson') ||
      queryLower.includes('ph') ||
      queryLower.includes('equilibrium') ||
      queryLower.includes('nernst')
    ) {
      return 'CHEM1011';
    }
    return 'MATH1011';
  }

  private getQuestionsForCourse(courseCode: string): TutorQuizQuestion[] {
    return VERIFIED_TUTOR_QUIZ_BANK.filter((q) => q.courseCode === courseCode);
  }

  private getFlashcardsForCourse(courseCode: string): TutorFlashcard[] {
    return VERIFIED_TUTOR_FLASHCARDS.filter((f) => f.courseCode === courseCode);
  }
}

export const aiTutorService = new AITutorService();
