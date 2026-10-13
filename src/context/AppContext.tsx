import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { QuizAttempt, Achievement, SkillProgress, UserProfile } from '@/types';
import { ACHIEVEMENTS } from '@/data/content';
import { QUIZ_QUESTIONS } from '@/data/quizData';

interface AppContextValue {
  user: UserProfile | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  attempts: QuizAttempt[];
  addAttempt: (attempt: QuizAttempt) => void;
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  skillProgress: SkillProgress[];
  updateSkillProgress: (results: QuizAttempt['results']) => void;
  viewedRoadmaps: string[];
  markRoadmapViewed: (id: string) => void;
  hasChattedWithTutor: boolean;
  markTutorChatted: () => void;
  totalXP: number;
  level: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<UserProfile | null>('learnxai_user', null);
  const [attempts, setAttempts] = useLocalStorage<QuizAttempt[]>('learnxai_attempts', []);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('learnxai_achievements', ACHIEVEMENTS);
  const [skillProgress, setSkillProgress] = useLocalStorage<SkillProgress[]>('learnxai_skills', []);
  const [viewedRoadmaps, setViewedRoadmaps] = useLocalStorage<string[]>('learnxai_roadmaps_viewed', []);
  const [hasChattedWithTutor, setHasChattedWithTutor] = useLocalStorage<boolean>('learnxai_tutor_chatted', false);

  const login = (name: string, email: string) => {
    setUser({
      name,
      email,
      avatar: name.charAt(0).toUpperCase() + (name.split(' ')[1]?.charAt(0)?.toUpperCase() || ''),
      joinedDate: Date.now(),
      streak: 1,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const unlockAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === id && !a.unlocked ? { ...a, unlocked: true, unlockedDate: Date.now() } : a))
    );
  };

  const addAttempt = (attempt: QuizAttempt) => {
    setAttempts((prev) => [...prev, attempt]);
    // Achievement checks
    unlockAchievement('first-quiz');
    if (attempt.score === 100) unlockAchievement('perfect-score');
    if (attempt.score >= 80) unlockAchievement('high-scorer');
    if (attempts.length + 1 >= 3) unlockAchievement('persistent');
    if (user && user.streak >= 5) unlockAchievement('level-up');
  };

  const updateSkillProgress = (results: QuizAttempt['results']) => {
    setSkillProgress((prev) => {
      const map = new Map(prev.map((s) => [s.concept, s]));
      for (const r of results) {
        const existing = map.get(r.concept);
        if (existing) {
          const totalAttempts = 1; // each quiz contributes one data point per concept
          const newMastery = Math.round(
            (existing.mastery * 0.7) + (r.correct ? 100 : 0) * 0.3
          );
          map.set(r.concept, {
            ...existing,
            mastery: Math.max(newMastery, r.correct ? Math.max(existing.mastery, newMastery) : existing.mastery - 5),
            lastAttempted: Date.now(),
          });
          if (map.get(r.concept)!.mastery >= 90) unlockAchievement('concept-master');
        } else {
          map.set(r.concept, {
            concept: r.concept,
            category: r.category,
            mastery: r.correct ? 70 : 30,
            lastAttempted: Date.now(),
          });
          if (r.correct) {
            // Check mastery after initial set
          }
        }
      }
      return Array.from(map.values());
    });
  };

  const markRoadmapViewed = (id: string) => {
    setViewedRoadmaps((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      if (next.length >= 3) unlockAchievement('explorer');
      return next;
    });
  };

  const markTutorChatted = () => {
    setHasChattedWithTutor(true);
    unlockAchievement('curious-mind');
  };

  const totalXP = attempts.reduce((sum, a) => sum + a.correctAnswers * 10, 0);
  const level = Math.floor(totalXP / 100) + 1;

  // Auto-unlock concept master if any skill is >= 90
  useEffect(() => {
    if (skillProgress.some((s) => s.mastery >= 90)) {
      unlockAchievement('concept-master');
    }
  }, [skillProgress]);

  // Count unique concepts for reference
  const _conceptCount = QUIZ_QUESTIONS.length; // referenced to avoid unused warning

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        attempts,
        addAttempt,
        achievements,
        unlockAchievement,
        skillProgress,
        updateSkillProgress,
        viewedRoadmaps,
        markRoadmapViewed,
        hasChattedWithTutor,
        markTutorChatted,
        totalXP,
        level,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
