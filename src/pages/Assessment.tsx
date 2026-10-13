import { useState } from 'react';
import { FileQuestion, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, AlertTriangle, Lightbulb } from 'lucide-react';
import { QUIZ_QUESTIONS } from '@/data/quizData';
import { useApp } from '@/context/AppContext';
import { Card, Badge, PageHeader, ProgressBar } from '@/components/ui';
import type { PageId, QuizResult, QuizAttempt } from '@/types';

interface AssessmentProps {
  onNavigate: (page: PageId) => void;
}

export function Assessment({ onNavigate }: AssessmentProps) {
  const { addAttempt, updateSkillProgress } = useApp();
  const [stage, setStage] = useState<'intro' | 'quiz' | 'results'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);

  const startQuiz = () => {
    setStage('quiz');
    setCurrentIndex(0);
    setAnswers({});
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    setAnswers((prev) => ({ ...prev, [QUIZ_QUESTIONS[currentIndex].id]: index }));
  };

  const nextQuestion = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const results: QuizResult[] = QUIZ_QUESTIONS.map((q) => {
      const selected = answers[q.id];
      return {
        questionId: q.id,
        selectedIndex: selected ?? -1,
        correct: selected === q.correctIndex,
        concept: q.concept,
        category: q.category,
      };
    });

    const correctCount = results.filter((r) => r.correct).length;
    const score = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
    const weakConcepts = results.filter((r) => !r.correct).map((r) => r.concept);
    const uniqueWeak = [...new Set(weakConcepts)];

    const newAttempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      date: Date.now(),
      totalQuestions: QUIZ_QUESTIONS.length,
      correctAnswers: correctCount,
      score,
      results,
      weakConcepts: uniqueWeak,
    };

    setAttempt(newAttempt);
    addAttempt(newAttempt);
    updateSkillProgress(results);
    setStage('results');
  };

  const restart = () => {
    setStage('intro');
    setAttempt(null);
    setAnswers({});
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  // INTRO STAGE
  if (stage === 'intro') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Java Skill Assessment"
          subtitle="Test your Java knowledge across 7 key categories"
          icon={<FileQuestion size={22} />}
        />
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About this assessment</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              This quiz covers {QUIZ_QUESTIONS.length} questions across fundamentals, OOP, collections, exceptions,
              concurrency, modern Java, and JVM internals. After completion, you'll receive an automatic score,
              detailed gap analysis, and personalized learning recommendations.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-indigo-50 rounded-xl">
                <p className="text-2xl font-bold text-indigo-600">{QUIZ_QUESTIONS.length}</p>
                <p className="text-xs text-gray-500 mt-1">Questions</p>
              </div>
              <div className="text-center p-4 bg-cyan-50 rounded-xl">
                <p className="text-2xl font-bold text-cyan-600">7</p>
                <p className="text-xs text-gray-500 mt-1">Categories</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">~10</p>
                <p className="text-xs text-gray-500 mt-1">Minutes</p>
              </div>
            </div>
            <button
              onClick={startQuiz}
              className="mt-6 w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Start Assessment <ArrowRight size={18} />
            </button>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories covered</h3>
            <div className="space-y-2">
              {[
                'Fundamentals',
                'Object-Oriented Programming',
                'Collections',
                'Exceptions',
                'Concurrency',
                'Modern Java',
                'JVM Internals',
              ].map((cat, i) => {
                const count = QUIZ_QUESTIONS.filter((q) => q.category === cat).length;
                return (
                  <div key={cat} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                    <span className="text-sm text-gray-700">{cat}</span>
                    <Badge color="indigo">{count} Qs</Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // QUIZ STAGE
  if (stage === 'quiz') {
    const q = QUIZ_QUESTIONS[currentIndex];
    const progress = ((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100;
    const isCorrect = selectedAnswer === q.correctIndex;

    return (
      <div className="space-y-6">
        <PageHeader
          title="Assessment in Progress"
          subtitle={`Question ${currentIndex + 1} of ${QUIZ_QUESTIONS.length}`}
          icon={<FileQuestion size={22} />}
        />

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge color="cyan">{q.category}</Badge>
            <span className="text-xs text-gray-400">{Math.round(progress)}% complete</span>
          </div>
          <ProgressBar value={progress} className="mb-6" />

          <div className="flex items-start gap-2 mb-6">
            <span className="text-sm font-bold text-indigo-600">Q{currentIndex + 1}.</span>
            <p className="text-base font-medium text-gray-900 leading-relaxed">{q.question}</p>
          </div>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let style = 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50';
              if (showFeedback) {
                if (i === q.correctIndex) {
                  style = 'border-green-400 bg-green-50';
                } else if (i === selectedAnswer) {
                  style = 'border-red-400 bg-red-50';
                } else {
                  style = 'border-gray-200 opacity-50';
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showFeedback}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3 ${style}`}
                >
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                    showFeedback && i === q.correctIndex
                      ? 'border-green-500 bg-green-500 text-white'
                      : showFeedback && i === selectedAnswer
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm text-gray-700 flex-1">{opt}</span>
                  {showFeedback && i === q.correctIndex && <CheckCircle2 size={18} className="text-green-500" />}
                  {showFeedback && i === selectedAnswer && i !== q.correctIndex && <XCircle size={18} className="text-red-500" />}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className={`mt-5 p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircle2 size={18} className="text-green-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                )}
                <div>
                  <p className={`text-sm font-semibold ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                    {isCorrect ? 'Correct!' : 'Not quite right'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{q.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {showFeedback && (
            <button
              onClick={nextQuestion}
              className="mt-5 w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight size={18} />
            </button>
          )}
        </Card>
      </div>
    );
  }

  // RESULTS STAGE
  if (stage === 'results' && attempt) {
    const wrongResults = attempt.results.filter((r) => !r.correct);

    return (
      <div className="space-y-6">
        <PageHeader
          title="Assessment Results"
          subtitle="Your score, gap analysis, and recommendations"
          icon={<Trophy size={22} />}
        />

        {/* Score hero */}
        <Card className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg ${
              attempt.score >= 80 ? 'bg-gradient-to-br from-green-500 to-emerald-600'
              : attempt.score >= 60 ? 'bg-gradient-to-br from-amber-500 to-orange-500'
              : 'bg-gradient-to-br from-red-500 to-rose-600'
            }`}>
              {attempt.score}%
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">
              {attempt.score >= 80 ? 'Excellent Work!' : attempt.score >= 60 ? 'Good Progress!' : 'Keep Learning!'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              You answered {attempt.correctAnswers} out of {attempt.totalQuestions} questions correctly
            </p>
            <div className="flex gap-3 mt-4">
              <Badge color={attempt.score >= 80 ? 'green' : attempt.score >= 60 ? 'amber' : 'red'} size="md">
                Score: {attempt.score}%
              </Badge>
              <Badge color="indigo" size="md">
                {attempt.weakConcepts.length} gaps detected
              </Badge>
            </div>
          </div>
        </Card>

        {/* Gap detection */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" /> Weak Concepts Detected
            </h3>
            {attempt.weakConcepts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <Trophy className="text-green-400 mb-2" size={28} />
                <p className="text-sm text-gray-500">Perfect score — no gaps detected!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {attempt.weakConcepts.map((concept) => (
                  <div key={concept} className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                    <XCircle size={18} className="text-red-500 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{concept}</p>
                      <p className="text-xs text-gray-400">
                        {QUIZ_QUESTIONS.find((q) => q.concept === concept)?.category}
                      </p>
                    </div>
                    <Badge color="red">Gap</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" /> Strong Concepts
            </h3>
            {attempt.results.filter((r) => r.correct).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <p className="text-sm text-gray-500">No correct answers yet — keep practicing!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...new Set(attempt.results.filter((r) => r.correct).map((r) => r.concept))].map((concept) => (
                  <div key={concept} className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                    <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{concept}</p>
                      <p className="text-xs text-gray-400">
                        {QUIZ_QUESTIONS.find((q) => q.concept === concept)?.category}
                      </p>
                    </div>
                    <Badge color="green">Mastered</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Question review */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Question Review</h3>
          <div className="space-y-3">
            {attempt.results.map((r, i) => {
              const q = QUIZ_QUESTIONS.find((qq) => qq.id === r.questionId)!;
              return (
                <div key={r.questionId} className={`p-4 rounded-xl border ${r.correct ? 'border-green-100 bg-green-50/50' : 'border-red-100 bg-red-50/50'}`}>
                  <div className="flex items-start gap-2">
                    {r.correct ? (
                      <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Q{i + 1}: {q.question}</p>
                      {!r.correct && (
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="text-red-500 font-medium">Your answer:</span> {r.selectedIndex >= 0 ? q.options[r.selectedIndex] : 'No answer'}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">
                        <span className="text-green-600 font-medium">Correct answer:</span> {q.options[q.correctIndex]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          <button
            onClick={restart}
            className="py-3 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} /> Retake Quiz
          </button>
          <button
            onClick={() => onNavigate('recommendations')}
            className="py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Lightbulb size={18} /> View Recommendations
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="py-3 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
          >
            Back to Dashboard <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
