import { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Sidebar } from '@/components/Sidebar';
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/Dashboard';
import { Assessment } from '@/pages/Assessment';
import { Recommendations } from '@/pages/Recommendations';
import { AITutor } from '@/pages/AITutor';
import { Roadmaps } from '@/pages/Roadmaps';
import { SkillWallet } from '@/pages/SkillWallet';
import type { PageId } from '@/types';

function AppContent() {
  const { user } = useApp();
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');

  if (!user) {
    return <LandingPage onNavigate={setCurrentPage} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="lg:ml-72 p-4 lg:p-8 max-w-7xl mx-auto">
        {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
        {currentPage === 'assessment' && <Assessment onNavigate={setCurrentPage} />}
        {currentPage === 'recommendations' && <Recommendations onNavigate={setCurrentPage} />}
        {currentPage === 'tutor' && <AITutor onNavigate={setCurrentPage} />}
        {currentPage === 'roadmaps' && <Roadmaps onNavigate={setCurrentPage} />}
        {currentPage === 'wallet' && <SkillWallet onNavigate={setCurrentPage} />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
