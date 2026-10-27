export type PageId =
  | 'dashboard'
  | 'assessment'
  | 'recommendations'
  | 'tutor'
  | 'roadmaps'
  | 'wallet';

export type AssessmentTrack = 'java-dev' | 'fullstack' | 'aiml';

export interface QuizQuestion {
  id: string;
  concept: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
  concept: string;
  category: string;
}

export interface QuizAttempt {
  id: string;
  date: number;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  results: QuizResult[];
  weakConcepts: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  joinedDate: number;
  streak: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: number;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  duration: string;
  topics: string[];
  milestone: string;
}

export interface CareerRoadmap {
  id: AssessmentTrack;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  estTime: string;
  phases: RoadmapPhase[];
  skills: string[];
  avgSalary: string;
}

export interface SkillProgress {
  concept: string;
  category: string;
  mastery: number;
  lastAttempted: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'tutor';
  text: string;
  timestamp: number;
  isDemo: boolean;
}

export interface LearningResource {
  id: string;
  concept: string;
  title: string;
  type: 'video' | 'article' | 'exercise' | 'course';
  source: string;
  estTime: string;
  difficulty: string;
  url: string;
}
