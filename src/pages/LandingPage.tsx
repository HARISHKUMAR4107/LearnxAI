import { useState } from 'react';
import { GraduationCap, Sparkles, TrendingUp, BrainCircuit, Map, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { PageId } from '@/types';

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { login } = useApp();
  const [email, setEmail] = useState('demo@learnxai.com');
  const [name, setName] = useState('Alex Chen');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(name || 'Demo User', email || 'demo@learnxai.com');
      onNavigate('dashboard');
    }, 600);
  };

  const features = [
    { icon: BrainCircuit, title: 'AI-Powered Tutoring', desc: 'Get instant answers and explanations from your personal AI tutor.' },
    { icon: TrendingUp, title: 'Skill Gap Detection', desc: 'Automatic analysis identifies your weak concepts and learning gaps.' },
    { icon: Map, title: 'Career Roadmaps', desc: 'Follow structured paths for Java, Full-Stack, and AI/ML careers.' },
    { icon: Trophy, title: 'Achievement System', desc: 'Earn badges, track XP, and stay motivated with gamified progress.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-md">
              <GraduationCap className="text-white" size={20} />
            </div>
            <span className="text-lg font-bold text-gray-900">LearnXAI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#careers" className="hover:text-indigo-600 transition-colors">Career Paths</a>
          </div>
          <button
            onClick={() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <Sparkles size={14} /> AI-Powered Learning Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Master skills with <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">AI-driven</span> personalized learning
            </h1>
            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              Assess your skills, discover knowledge gaps, get tailored recommendations, and follow career roadmaps — all powered by intelligent analysis.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Start Learning Free <ArrowRight size={18} />
              </button>
              <a
                href="#features"
                className="inline-flex items-center gap-2 text-gray-700 bg-white border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:border-indigo-300 transition-all"
              >
                Explore Features
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> No credit card needed</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Demo-ready</div>
            </div>
          </div>

          {/* Hero visual card */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Your Progress</p>
                  <p className="text-2xl font-bold text-gray-900">Java Skills</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
                  <Trophy className="text-white" size={22} />
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Fundamentals', val: 85 },
                  { label: 'OOP', val: 72 },
                  { label: 'Collections', val: 90 },
                  { label: 'Concurrency', val: 45 },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 font-medium">{s.label}</span>
                      <span className="text-gray-400">{s.val}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full" style={{ width: `${s.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs text-amber-800 font-medium flex items-center gap-2">
                  <Sparkles size={14} /> AI Tip: Focus on Concurrency to close your biggest gap
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything you need to grow</h2>
            <p className="mt-3 text-gray-500">A complete learning intelligence platform built for modern learners</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center mb-4 shadow-md">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-6 bg-gradient-to-br from-indigo-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How LearnXAI works</h2>
            <p className="mt-3 text-gray-500">From assessment to mastery in four simple steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Assess', desc: 'Take a skill assessment quiz to evaluate your knowledge.' },
              { step: '02', title: 'Analyze', desc: 'AI detects gaps and identifies your weakest concepts.' },
              { step: '03', title: 'Learn', desc: 'Get personalized recommendations and chat with your AI tutor.' },
              { step: '04', title: 'Grow', desc: 'Track achievements and follow career roadmaps to advance.' },
            ].map((s, i) => (
              <div key={s.step} className="relative">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">{s.step}</span>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900">{s.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
                </div>
                {i < 3 && <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-indigo-200" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career paths preview */}
      <section id="careers" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Career paths designed for you</h2>
            <p className="mt-3 text-gray-500">Structured roadmaps to take you from where you are to where you want to be</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Java Developer', icon: '☕', desc: 'Backend development with Spring Boot and enterprise architecture.', salary: '$85k–$140k' },
              { title: 'Full-Stack Developer', icon: '⚡', desc: 'End-to-end web apps from database to pixel-perfect UI.', salary: '$80k–$160k' },
              { title: 'AI/ML Engineer', icon: '🧠', desc: 'Build intelligent systems with ML, deep learning, and LLMs.', salary: '$110k–$200k' },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="text-4xl mb-3">{c.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{c.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{c.salary}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth section */}
      <section id="auth" className="py-20 px-6 bg-gradient-to-br from-indigo-600 to-cyan-500">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 items-center justify-center mb-3 shadow-md">
                <GraduationCap className="text-white" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {mode === 'login' ? 'Sign in to continue learning' : 'Start your personalized learning journey'}
              </p>
            </div>

            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-5">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'signup' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                    placeholder="Alex Chen"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Password</label>
                <input
                  type="password"
                  defaultValue="demopassword"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-md hover:shadow-lg transition-all disabled:opacity-60"
              >
                {loading ? 'Signing in…' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-gray-400">
              Demo mode — no real credentials needed. Just click Sign In.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
              <GraduationCap className="text-white" size={16} />
            </div>
            <span className="text-white font-bold">LearnXAI</span>
          </div>
          <p className="text-sm text-gray-400">AI-Powered Personalized Learning & Career Intelligence</p>
          <p className="mt-2 text-xs text-gray-500">A prototype project for educational purposes. All AI responses are simulated.</p>
        </div>
      </footer>
    </div>
  );
}
