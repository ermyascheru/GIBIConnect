import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, HelpCircle, RotateCcw, 
  Award, BookOpen, Sparkles, ChevronRight, Check
} from 'lucide-react';
import { getApiUrl } from '../../config/api';

export interface QuizQuestion {
  id: string;
  conceptId?: string;
  courseCode: string;
  question: string;
  options: string[];
  correctOptionIndex?: number;
  explanation: string;
  examSource?: string;
}

interface InteractiveQuizRunnerProps {
  isDark?: boolean;
  onClose?: () => void;
}

const COURSES = [
  { code: 'PHYS1011', name: 'Freshman General Physics', icon: '⚡' },
  { code: 'MATH1011', name: 'Applied Mathematics & Calculus', icon: '📐' },
  { code: 'COSC1011', name: 'Computer Programming (C++)', icon: '💻' },
  { code: 'CHEM1011', name: 'General Chemistry', icon: '🧪' },
];

export const InteractiveQuizRunner: React.FC<InteractiveQuizRunnerProps> = ({
  isDark = false,
  onClose,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('PHYS1011');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fallback questions if backend is offline
  const fallbackQuestions: Record<string, QuizQuestion[]> = {
    PHYS1011: [
      {
        id: 'q-phys-01',
        courseCode: 'PHYS1011',
        question: 'A projectile is launched from level ground with initial speed v0 = 20 m/s at an angle of 30° above the horizontal (take g = 10 m/s²). What is the maximum height reached?',
        options: ['2.5 m', '5.0 m', '10.0 m', '20.0 m'],
        correctOptionIndex: 1,
        explanation: 'At apex, vy = 0. H_max = (v0 * sin(30°))² / (2g) = (20 * 0.5)² / (2 * 10) = 100 / 20 = 5.0 meters.',
        examSource: 'AAU Freshman General Physics (PHYS1011) Midterm',
      },
      {
        id: 'q-phys-02',
        courseCode: 'PHYS1011',
        question: 'Which of the following pairs of launch angles produces the exact same horizontal range R on level ground (neglecting air friction)?',
        options: ['20° and 80°', '30° and 60°', '45° and 55°', '15° and 65°'],
        correctOptionIndex: 1,
        explanation: 'The horizontal range formula R = (v0² sin(2θ)) / g is symmetrical about 45°. Any complementary angles summing to 90° (like 30° + 60° = 90°) produce identical ranges.',
        examSource: 'ASTU Engineering Mechanics Entry Evaluation',
      },
      {
        id: 'q-phys-03',
        courseCode: 'PHYS1011',
        question: 'A 5 kg block rests on a horizontal frictionless surface. A constant horizontal force of 25 N is applied. What is its acceleration?',
        options: ['2 m/s²', '5 m/s²', '125 m/s²', '0.2 m/s²'],
        correctOptionIndex: 1,
        explanation: 'By Newton\'s Second Law: a = F / m = 25 N / 5 kg = 5 m/s².',
        examSource: 'JU Freshman Engineering Physics Exam',
      },
    ],
    MATH1011: [
      {
        id: 'q-math-01',
        courseCode: 'MATH1011',
        question: 'Evaluate the limit: lim(x -> 0) [ sin(4x) / x ].',
        options: ['0', '1', '4', 'Undefined'],
        correctOptionIndex: 2,
        explanation: 'Using the fundamental trigonometric limit lim(u -> 0) [sin(u)/u] = 1, lim(x -> 0) [sin(4x)/x] = 4 * lim [sin(4x)/(4x)] = 4 * 1 = 4.',
        examSource: 'AAiT Freshman Applied Mathematics I Midterm Paper',
      },
      {
        id: 'q-math-02',
        courseCode: 'MATH1011',
        question: 'What is the derivative of f(x) = ln(3x² + 1) with respect to x?',
        options: ['1 / (3x² + 1)', '6x / (3x² + 1)', '3x / (3x² + 1)', '6x * ln(3x² + 1)'],
        correctOptionIndex: 1,
        explanation: 'By the Chain Rule: d/dx [ln(u)] = (1/u) * u\'. Here u = 3x² + 1 and u\' = 6x, giving f\'(x) = 6x / (3x² + 1).',
        examSource: 'BDU Institute of Technology Calculus Final',
      },
    ],
    COSC1011: [
      {
        id: 'q-cosc-01',
        courseCode: 'COSC1011',
        question: 'In C++, what will the following snippet output?\nint a = 10;\nint* ptr = &a;\n*ptr = 25;\ncout << a;',
        options: ['10', 'Address of a', '25', 'Compilation Error'],
        correctOptionIndex: 2,
        explanation: 'Dereferencing the pointer (*ptr = 25) directly modifies the memory address where variable a is stored, so cout << a outputs 25.',
        examSource: 'ASTU Computer Science Freshman Programming Exam',
      },
      {
        id: 'q-cosc-02',
        courseCode: 'COSC1011',
        question: 'What is the index of the last element in an array declared as: int arr[10];?',
        options: ['10', '9', '11', '0'],
        correctOptionIndex: 1,
        explanation: 'C++ arrays are 0-indexed. An array of size 10 has valid indices from 0 through 9.',
        examSource: 'AAU Department of Computer Science Syllabi',
      },
    ],
    CHEM1011: [
      {
        id: 'q-chem-01',
        courseCode: 'CHEM1011',
        question: 'What is the pH of a 0.001 M solution of Hydrochloric acid (HCl)?',
        options: ['1', '2', '3', '7'],
        correctOptionIndex: 2,
        explanation: 'HCl is a strong monoprotic acid that dissociates completely. [H+] = 10^-3 M. pH = -log10(10^-3) = 3.0.',
        examSource: 'Hawassa University Pre-Med General Chemistry Paper',
      },
    ],
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowHint(false);
    setScore(0);
    setIsFinished(false);

    fetch(getApiUrl(`/api/v1/ai/tutor/quiz?courseCode=${selectedCourse}`))
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.data?.questions) && data.data.questions.length > 0) {
          setQuestions(data.data.questions);
        } else if (isMounted) {
          setQuestions(fallbackQuestions[selectedCourse] || fallbackQuestions['PHYS1011']);
        }
      })
      .catch(() => {
        if (isMounted) {
          setQuestions(fallbackQuestions[selectedCourse] || fallbackQuestions['PHYS1011']);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCourse]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === (currentQ.correctOptionIndex ?? 0);
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowHint(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className={`rounded-3xl border shadow-xl p-6 sm:p-8 transition-all ${
      isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0C373D] text-[#5AA7A7] flex items-center justify-center font-bold text-lg">
            <Sparkles className="w-5 h-5 text-[#5AA7A7]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5AA7A7]">
                6-Stage Adaptive Practice
              </span>
              <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                100% Ethiopian Syllabi Grounded
              </span>
            </div>
            <h2 className="text-lg font-serif font-bold mt-0.5">
              Interactive STEM Tutor & Quiz Runner
            </h2>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white px-2 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 cursor-pointer"
          >
            Close Quiz
          </button>
        )}
      </div>

      {/* Course Selector Tabs */}
      <div className="mt-5 flex flex-wrap gap-2">
        {COURSES.map((c) => (
          <button
            key={c.code}
            onClick={() => setSelectedCourse(c.code)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              selectedCourse === c.code
                ? 'bg-[#0C373D] text-[#5AA7A7] border-[#5AA7A7] shadow-sm'
                : (isDark 
                    ? 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300')
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.code}</span>
            <span className="text-[10px] opacity-75 hidden sm:inline">• {c.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Quiz Body */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-[#5AA7A7] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Retrieving official syllabus questions...</p>
        </div>
      ) : isFinished ? (
        /* Results Screen */
        <div className="py-12 text-center max-w-md mx-auto animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif font-bold">Quiz Completed!</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            You practiced <strong>{selectedCourse}</strong> freshman university assessment questions.
          </p>

          <div className="my-6 p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
            <div className="text-3xl font-serif font-bold text-[#0C373D] dark:text-[#5AA7A7]">
              {score} / {questions.length}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mt-1">
              Score: {Math.round((score / questions.length) * 100)}%
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800 text-xs">
              {score === questions.length ? (
                <span className="text-emerald-600 font-semibold">
                  🌟 Outstanding! You have demonstrated full mastery of this syllabus topic.
                </span>
              ) : score >= questions.length / 2 ? (
                <span className="text-amber-600 font-semibold">
                  👍 Solid performance! Review the step-by-step explanations to lock in full marks.
                </span>
              ) : (
                <span className="text-rose-600 font-semibold">
                  📖 Recommended: Ask the AI Advisor to explain the prerequisite concepts step-by-step.
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0C373D] hover:bg-[#072428] text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#5AA7A7]" />
              <span>Retry Quiz</span>
            </button>
          </div>
        </div>
      ) : currentQ ? (
        <div className="mt-8 animate-fadeIn">
          {/* Progress Bar & Counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 mb-2">
            <span className="font-semibold">
              Question <span className="text-[#0C373D] dark:text-[#5AA7A7]">{currentIndex + 1}</span> of {questions.length}
            </span>
            <span className="text-[11px] font-mono">
              Score: {score} Correct
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden mb-6">
            <div 
              className="h-full bg-[#5AA7A7] transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800">
            {currentQ.examSource && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5AA7A7] block mb-2">
                Exam Source: {currentQ.examSource}
              </span>
            )}
            <h3 className="text-sm sm:text-base font-serif font-bold leading-relaxed whitespace-pre-line">
              {currentQ.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="mt-5 space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx); // 'A', 'B', 'C', 'D'
              const isSelected = selectedOption === optIdx;
              const isCorrect = optIdx === (currentQ.correctOptionIndex ?? 0);

              let optionStyle = isDark 
                ? 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:border-zinc-700' 
                : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200';
                }
              } else if (isSelected) {
                optionStyle = 'bg-[#EBF4F7] dark:bg-zinc-800 border-[#5AA7A7] text-[#0C373D] dark:text-[#5AA7A7] font-semibold';
              }

              return (
                <button
                  key={optIdx}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${optionStyle}`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isAnswerSubmitted && isCorrect
                      ? 'bg-emerald-600 text-white'
                      : isAnswerSubmitted && isSelected && !isCorrect
                      ? 'bg-rose-600 text-white'
                      : isSelected
                      ? 'bg-[#0C373D] text-[#5AA7A7]'
                      : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-600')
                  }`}>
                    {isAnswerSubmitted && isCorrect ? <Check className="w-3.5 h-3.5" /> : letter}
                  </span>
                  <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                    {option}
                  </div>
                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 self-center" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 self-center" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Hint Accordion */}
          {!isAnswerSubmitted && (
            <div className="mt-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#5AA7A7] transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Hint' : 'Need a hint?'}</span>
              </button>
              {showHint && (
                <div className="mt-2 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-200 leading-relaxed animate-fadeIn">
                  💡 <strong>Study Hint:</strong> Recall the standard freshman syllabus principles. Check the units and identify whether horizontal or vertical components dominate the state!
                </div>
              )}
            </div>
          )}

          {/* Explanation Breakdown after submission */}
          {isAnswerSubmitted && (
            <div className="mt-6 p-5 rounded-2xl bg-[#EBF4F7] dark:bg-zinc-950 border border-[#5AA7A7]/40 animate-fadeIn">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-[#0C373D] dark:text-[#5AA7A7]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0C373D] dark:text-[#5AA7A7]">
                  Step-by-Step Pedagogical Explanation
                </h4>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-zinc-200 whitespace-pre-line">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {isAnswerSubmitted ? 'Click Next to proceed' : 'Select an option to confirm'}
            </span>

            {!isAnswerSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0C373D] hover:bg-[#072428] disabled:opacity-40 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
              >
                <span>Submit Answer</span>
                <Check className="w-3.5 h-3.5 text-[#5AA7A7]" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0C373D] hover:bg-[#072428] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
              >
                <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#5AA7A7]" />
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
