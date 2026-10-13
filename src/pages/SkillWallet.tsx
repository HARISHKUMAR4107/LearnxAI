import { Wallet, Trophy, Lock, Zap, Star, Flame, Footprints, Compass, MessageCircle, Award, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, Badge, PageHeader, ProgressBar } from '@/components/ui';
import type { PageId } from '@/types';

interface SkillWalletProps {
  onNavigate: (page: PageId) => void;
}

const ACHIEVEMENT_ICONS: Record<string, typeof Trophy> = {
  'first-quiz': Footprints,
  'perfect-score': Trophy,
  'high-scorer': Star,
  'persistent': Flame,
  'explorer': Compass,
  'curious-mind': MessageCircle,
  'concept-master': Award,
  'level-up': TrendingUp,
};

export function SkillWallet({ onNavigate }: SkillWalletProps) {
  const { achievements, skillProgress, attempts, totalXP, level, user } = useApp();

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  const masteredConcepts = skillProgress.filter((s) => s.mastery >= 80);
  const inProgressConcepts = skillProgress.filter((s) => s.mastery >= 40 && s.mastery < 80);
  const weakConcepts = skillProgress.filter((s) => s.mastery < 40);

  const xpToNextLevel = 100 - (totalXP % 100);
  const levelProgress = totalXP % 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Wallet"
        subtitle="Your achievements, XP, and concept mastery portfolio"
        icon={<Wallet size={22} />}
      />

      {/* XP & Level card */}
      <Card className="p-6 bg-gradient-to-br from-indigo-600 to-cyan-500 text-white border-0">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <span className="text-2xl font-bold">{level}</span>
              </div>
              <div>
                <p className="text-sm text-white/80">Current Level</p>
                <p className="text-2xl font-bold">{user?.name?.split(' ')[0] || 'Learner'}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{totalXP} XP</p>
            <p className="text-sm text-white/80">{xpToNextLevel} XP to Level {level + 1}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Stats overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-2">
            <Trophy size={20} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{unlocked.length}</p>
          <p className="text-xs text-gray-500">Achievements</p>
        </Card>
        <Card className="p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mx-auto mb-2">
            <Zap size={20} className="text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{masteredConcepts.length}</p>
          <p className="text-xs text-gray-500">Mastered</p>
        </Card>
        <Card className="p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-2">
            <Star size={20} className="text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{inProgressConcepts.length}</p>
          <p className="text-xs text-gray-500">In Progress</p>
        </Card>
        <Card className="p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-2">
            <Flame size={20} className="text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{attempts.length}</p>
          <p className="text-xs text-gray-500">Assessments</p>
        </Card>
      </div>

      {/* Achievements grid */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Trophy size={16} className="text-amber-500" /> Achievements
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map((a) => {
            const Icon = ACHIEVEMENT_ICONS[a.id] || Trophy;
            return (
              <div
                key={a.id}
                className={`p-4 rounded-xl border text-center transition-all ${
                  a.unlocked
                    ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-sm'
                    : 'border-gray-100 bg-gray-50 opacity-70'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                  a.unlocked
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-md'
                    : 'bg-gray-200'
                }`}>
                  {a.unlocked ? (
                    <Icon className="text-white" size={22} />
                  ) : (
                    <Lock className="text-gray-400" size={20} />
                  )}
                </div>
                <p className={`text-sm font-semibold ${a.unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                  {a.title}
                </p>
                <p className={`text-xs mt-1 ${a.unlocked ? 'text-gray-500' : 'text-gray-400'}`}>
                  {a.description}
                </p>
                {a.unlocked && a.unlockedDate && (
                  <p className="text-[10px] text-amber-600 mt-2 font-medium">
                    {new Date(a.unlockedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Skill portfolio */}
      {skillProgress.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-500" /> Skill Portfolio
          </h3>
          <div className="space-y-3">
            {skillProgress
              .sort((a, b) => b.mastery - a.mastery)
              .map((s) => (
                <div key={s.concept} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 truncate">{s.concept}</span>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <Badge color="gray">{s.category}</Badge>
                        <span className={`text-xs font-bold ${
                          s.mastery >= 80 ? 'text-green-600' : s.mastery >= 60 ? 'text-amber-600' : 'text-red-500'
                        }`}>
                          {s.mastery}%
                        </span>
                      </div>
                    </div>
                    <ProgressBar value={s.mastery} />
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Empty state CTA */}
      {attempts.length === 0 && (
        <Card className="p-8 text-center bg-gradient-to-br from-indigo-50 to-cyan-50 border-indigo-100">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mx-auto mb-4">
            <Wallet className="text-indigo-600" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Start building your skill wallet</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Take an assessment to begin earning XP, unlocking achievements, and building your skill portfolio.
          </p>
          <button
            onClick={() => onNavigate('assessment')}
            className="mt-5 px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            Start Assessment <ArrowRight size={18} />
          </button>
        </Card>
      )}

      {/* Concept mastery breakdown */}
      {skillProgress.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={16} className="text-green-500" />
              <h4 className="text-sm font-semibold text-gray-700">Mastered (80%+)</h4>
            </div>
            <p className="text-2xl font-bold text-green-600">{masteredConcepts.length}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {masteredConcepts.map((s) => (
                <Badge key={s.concept} color="green">{s.concept}</Badge>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Star size={16} className="text-amber-500" />
              <h4 className="text-sm font-semibold text-gray-700">In Progress (40–79%)</h4>
            </div>
            <p className="text-2xl font-bold text-amber-600">{inProgressConcepts.length}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {inProgressConcepts.map((s) => (
                <Badge key={s.concept} color="amber">{s.concept}</Badge>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Flame size={16} className="text-red-500" />
              <h4 className="text-sm font-semibold text-gray-700">Needs Focus (&lt;40%)</h4>
            </div>
            <p className="text-2xl font-bold text-red-500">{weakConcepts.length}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {weakConcepts.map((s) => (
                <Badge key={s.concept} color="red">{s.concept}</Badge>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
