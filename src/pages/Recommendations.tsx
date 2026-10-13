import { Lightbulb, AlertTriangle, TrendingUp, ArrowRight, Video, FileText, Dumbbell, BookOpen, Clock, BarChart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { LEARNING_RESOURCES } from '@/data/content';
import { QUIZ_QUESTIONS } from '@/data/quizData';
import { Card, Badge, PageHeader, ProgressBar } from '@/components/ui';
import type { PageId, LearningResource } from '@/types';

interface RecommendationsProps {
  onNavigate: (page: PageId) => void;
}

const RESOURCE_ICONS = {
  video: Video,
  article: FileText,
  exercise: Dumbbell,
  course: BookOpen,
};

const RESOURCE_COLORS = {
  video: 'from-red-500 to-rose-600',
  article: 'from-blue-500 to-indigo-600',
  exercise: 'from-amber-500 to-orange-600',
  course: 'from-green-500 to-emerald-600',
};

export function Recommendations({ onNavigate }: RecommendationsProps) {
  const { skillProgress, attempts } = useApp();

  const weakConcepts = skillProgress
    .filter((s) => s.mastery < 60)
    .sort((a, b) => a.mastery - b.mastery);

  const mediumConcepts = skillProgress
    .filter((s) => s.mastery >= 60 && s.mastery < 80)
    .sort((a, b) => a.mastery - b.mastery);

  const untestedConcepts = [...new Set(QUIZ_QUESTIONS.map((q) => q.concept))]
    .filter((concept) => !skillProgress.some((s) => s.concept === concept));

  const getResourcesForConcept = (concept: string): LearningResource[] =>
    LEARNING_RESOURCES.filter((r) => r.concept === concept);

  // Priority order: weak → medium → untested
  const priorityConcepts = [
    ...weakConcepts.map((s) => ({ ...s, priority: 'high' as const })),
    ...mediumConcepts.map((s) => ({ ...s, priority: 'medium' as const })),
  ];

  if (attempts.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Learning Recommendations"
          subtitle="Personalized study plan based on your assessment results"
          icon={<Lightbulb size={22} />}
        />
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-4">
            <Lightbulb size={28} className="text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No recommendations yet</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Take a skill assessment first. Our AI will analyze your results and generate a personalized study plan with targeted resources.
          </p>
          <button
            onClick={() => onNavigate('assessment')}
            className="mt-5 px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            Take Assessment <ArrowRight size={18} />
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Recommendations"
        subtitle="Personalized study plan based on your assessment results"
        icon={<Lightbulb size={22} />}
      />

      {/* Priority summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{weakConcepts.length}</p>
              <p className="text-xs text-gray-500">High priority gaps</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mediumConcepts.length}</p>
              <p className="text-xs text-gray-500">Needs practice</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <BarChart size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{untestedConcepts.length}</p>
              <p className="text-xs text-gray-500">Untested concepts</p>
            </div>
          </div>
        </Card>
      </div>

      {/* High priority recommendations */}
      {priorityConcepts.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" /> Priority Learning Plan
          </h3>
          <p className="text-xs text-gray-400 mb-5">
            Concepts are ordered by priority — start from the top and work your way down.
          </p>
          <div className="space-y-6">
            {priorityConcepts.map((concept) => {
              const resources = getResourcesForConcept(concept.concept);
              return (
                <div key={concept.concept}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{concept.concept}</span>
                      {concept.priority === 'high' ? (
                        <Badge color="red">High Priority</Badge>
                      ) : (
                        <Badge color="amber">Practice</Badge>
                      )}
                    </div>
                    <span className={`text-xs font-semibold ${concept.mastery < 60 ? 'text-red-500' : 'text-amber-600'}`}>
                      {concept.mastery}% mastery
                    </span>
                  </div>
                  <ProgressBar value={concept.mastery} className="mb-3" />
                  {resources.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {resources.map((r) => {
                        const Icon = RESOURCE_ICONS[r.type];
                        const color = RESOURCE_COLORS[r.type];
                        return (
                          <a
                            key={r.id}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all group"
                          >
                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                              <Icon className="text-white" size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{r.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-gray-400">{r.source}</span>
                                <span className="text-[11px] text-gray-400 flex items-center gap-0.5"><Clock size={10} /> {r.estTime}</span>
                              </div>
                            </div>
                            <ArrowRight size={14} className="text-gray-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-gray-50 text-sm text-gray-400">
                      Ask the AI Tutor for help with this concept — no specific resources linked yet.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Untested concepts */}
      {untestedConcepts.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <BarChart size={16} className="text-indigo-500" /> Untested Concepts
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            These concepts haven't been assessed yet. Take another quiz to evaluate them.
          </p>
          <div className="flex flex-wrap gap-2">
            {untestedConcepts.map((concept) => (
              <div key={concept} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-100">
                <span className="text-sm text-gray-700">{concept}</span>
                <Badge color="indigo">New</Badge>
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate('assessment')}
            className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            Retake Assessment <ArrowRight size={16} />
          </button>
        </Card>
      )}

      {/* AI tutor CTA */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-cyan-50 border-indigo-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-md">
            <Lightbulb className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">Need more help?</h3>
            <p className="text-sm text-gray-500 mt-0.5">Ask your AI Tutor for explanations on any weak concept.</p>
          </div>
          <button
            onClick={() => onNavigate('tutor')}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            Ask Tutor <ArrowRight size={16} />
          </button>
        </div>
      </Card>
    </div>
  );
}
