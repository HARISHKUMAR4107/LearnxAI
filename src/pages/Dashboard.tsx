import { LayoutDashboard, TrendingUp, Trophy, Target, Clock, ArrowRight, Zap, BookOpen } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, Badge, ProgressBar, PageHeader } from '@/components/ui';
import { SkillRadarChart, CategoryBarChart, ProgressRing } from '@/components/Charts';
import { QUIZ_CATEGORIES } from '@/data/quizData';
import type { PageId } from '@/types';

interface DashboardProps {
  onNavigate: (page: PageId) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, attempts, skillProgress, achievements, totalXP, level } = useApp();

  const lastAttempt = attempts[attempts.length - 1];
  const overallScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
    : 0;

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const weakConcepts = skillProgress.filter((s) => s.mastery < 60).sort((a, b) => a.mastery - b.mastery);
  const strongConcepts = skillProgress.filter((s) => s.mastery >= 80).sort((a, b) => b.mastery - a.mastery);

  const statCards = [
    { label: 'Assessments Taken', value: attempts.length, icon: Target, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Avg Score', value: `${overallScore}%`, icon: TrendingUp, color: 'from-cyan-500 to-cyan-600' },
    { label: 'Total XP', value: totalXP, icon: Zap, color: 'from-amber-500 to-orange-500' },
    { label: 'Achievements', value: `${unlockedAchievements.length}/${achievements.length}`, icon: Trophy, color: 'from-green-500 to-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Learner'}`}
        subtitle="Here's an overview of your learning progress"
        icon={<LayoutDashboard size={22} />}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
                <Icon className="text-white" size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Overall progress ring */}
        <Card className="p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 self-start">Overall Mastery</h3>
          <ProgressRing value={overallScore} size={140} />
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Badge color={overallScore >= 80 ? 'green' : overallScore >= 60 ? 'amber' : 'red'}>
              {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Work'}
            </Badge>
            <span className="text-xs text-gray-400">Level {level}</span>
          </div>
        </Card>

        {/* Radar chart */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Skill Radar</h3>
          <div className="h-64">
            <SkillRadarChart skills={skillProgress} />
          </div>
        </Card>
      </div>

      {/* Category bar chart + weak concepts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Mastery by Category</h3>
          <div className="h-56">
            <CategoryBarChart skills={skillProgress} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Target size={16} className="text-red-500" /> Weak Concepts — Gap Detection
          </h3>
          {weakConcepts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Trophy className="text-gray-300 mb-2" size={32} />
              <p className="text-sm text-gray-400">
                {attempts.length === 0 ? 'Take an assessment to detect gaps' : 'No weak concepts detected — great job!'}
              </p>
              {attempts.length === 0 && (
                <button
                  onClick={() => onNavigate('assessment')}
                  className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  Start Assessment <ArrowRight size={14} />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {weakConcepts.slice(0, 5).map((s) => (
                <div key={s.concept}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{s.concept}</span>
                    <span className="text-red-500 font-semibold">{s.mastery}%</span>
                  </div>
                  <ProgressBar value={s.mastery} />
                </div>
              ))}
              <button
                onClick={() => onNavigate('recommendations')}
                className="w-full mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1 pt-2 border-t border-gray-100"
              >
                View Recommendations <ArrowRight size={14} />
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* Recent activity + strong concepts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-indigo-500" /> Recent Activity
          </h3>
          {attempts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <BookOpen className="text-gray-300 mb-2" size={32} />
              <p className="text-sm text-gray-400">No assessments yet</p>
              <button
                onClick={() => onNavigate('assessment')}
                className="mt-3 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Take First Assessment
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {[...attempts].reverse().slice(0, 5).map((a, i) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs ${
                      a.score >= 80 ? 'bg-green-500' : a.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}>
                      {a.score}%
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Assessment #{attempts.length - i}</p>
                      <p className="text-xs text-gray-400">{new Date(a.date).toLocaleDateString()} · {a.correctAnswers}/{a.totalQuestions} correct</p>
                    </div>
                  </div>
                  {a.weakConcepts.length > 0 && (
                    <Badge color="red">{a.weakConcepts.length} gaps</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-green-500" /> Strong Concepts
          </h3>
          {strongConcepts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <TrendingUp className="text-gray-300 mb-2" size={32} />
              <p className="text-sm text-gray-400">Score 80%+ in a concept to see it here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {strongConcepts.map((s) => (
                <div key={s.concept}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{s.concept}</span>
                    <span className="text-green-600 font-semibold">{s.mastery}%</span>
                  </div>
                  <ProgressBar value={s.mastery} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Take Assessment', desc: 'Test your Java knowledge', page: 'assessment' as PageId, color: 'from-indigo-600 to-cyan-500' },
          { label: 'Ask AI Tutor', desc: 'Get instant help', page: 'tutor' as PageId, color: 'from-cyan-500 to-teal-500' },
          { label: 'View Roadmaps', desc: 'Plan your career', page: 'roadmaps' as PageId, color: 'from-violet-500 to-purple-500' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => onNavigate(action.page)}
            className={`bg-gradient-to-br ${action.color} text-white rounded-2xl p-5 text-left shadow-md hover:shadow-xl transition-all group`}
          >
            <p className="text-lg font-bold">{action.label}</p>
            <p className="text-sm text-white/80 mt-1">{action.desc}</p>
            <div className="mt-3 flex items-center gap-1 text-sm font-semibold">
              Go <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Categories overview */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Assessment Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {QUIZ_CATEGORIES.map((cat) => {
            const catSkills = skillProgress.filter((s) => s.category === cat);
            const avg = catSkills.length > 0 ? Math.round(catSkills.reduce((sum, s) => sum + s.mastery, 0) / catSkills.length) : 0;
            return (
              <div key={cat} className="p-3 rounded-xl bg-gray-50 text-center">
                <p className="text-xs font-medium text-gray-600 leading-tight">{cat}</p>
                <p className={`text-xl font-bold mt-1 ${avg >= 80 ? 'text-green-600' : avg >= 60 ? 'text-amber-600' : avg > 0 ? 'text-red-500' : 'text-gray-300'}`}>
                  {avg > 0 ? `${avg}%` : '—'}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
