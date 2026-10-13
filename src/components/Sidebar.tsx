import { LayoutDashboard, FileQuestion, Lightbulb, MessageSquare, Map, Wallet, LogOut, GraduationCap, Menu, X } from 'lucide-react';
import type { PageId } from '@/types';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

const NAV_ITEMS: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assessment', label: 'Skill Assessment', icon: FileQuestion },
  { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
  { id: 'tutor', label: 'AI Tutor', icon: MessageSquare },
  { id: 'roadmaps', label: 'Career Roadmaps', icon: Map },
  { id: 'wallet', label: 'Skill Wallet', icon: Wallet },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { user, logout, totalXP, level } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-lg rounded-xl p-2 border border-gray-200"
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={20} className="text-indigo-600" /> : <Menu size={20} className="text-indigo-600" />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-40 transition-transform duration-300 flex flex-col ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-md">
              <GraduationCap className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">LearnXAI</h1>
              <p className="text-[11px] text-gray-400 leading-tight">AI-Powered Learning</p>
            </div>
          </div>
        </div>

        {/* User card */}
        {user && (
          <div className="px-4 py-4 mx-3 mt-3 rounded-xl bg-gradient-to-br from-indigo-50 to-cyan-50 border border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 text-[11px]">
              <span className="text-indigo-600 font-semibold">Level {level}</span>
              <span className="text-gray-500">{totalXP} XP</span>
            </div>
            <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${totalXP % 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                }`}
              >
                <Icon size={18} className={active ? 'text-white' : 'text-gray-400'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={18} className="text-gray-400" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
