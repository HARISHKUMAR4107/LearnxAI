import { useState } from 'react';
import { Map, Coffee, Layers, BrainCircuit, Clock, BarChart, DollarSign, CheckCircle2, Circle, ArrowRight, ChevronDown } from 'lucide-react';
import { CAREER_ROADMAPS } from '@/data/content';
import { useApp } from '@/context/AppContext';
import { Card, Badge, PageHeader } from '@/components/ui';
import type { CareerRoadmap, PageId } from '@/types';

interface RoadmapsProps {
  onNavigate?: (page: PageId) => void;
}

const ICON_MAP: Record<string, typeof Coffee> = {
  Coffee,
  Layers,
  BrainCircuit,
};

const DIFFICULTY_COLORS: Record<string, 'green' | 'amber' | 'red'> = {
  Beginner: 'green',
  Intermediate: 'amber',
  Advanced: 'red',
};

export function Roadmaps({ onNavigate }: RoadmapsProps) {
  const { markRoadmapViewed, viewedRoadmaps } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  const selectedRoadmap = CAREER_ROADMAPS.find((r) => r.id === selectedId);

  const handleSelect = (roadmap: CareerRoadmap) => {
    setSelectedId(roadmap.id);
    markRoadmapViewed(roadmap.id);
    setExpandedPhases(new Set([roadmap.phases[0].id]));
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) next.delete(phaseId);
      else next.add(phaseId);
      return next;
    });
  };

  // Grid view
  if (!selectedRoadmap) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Career Roadmaps"
          subtitle="Structured learning paths to reach your career goals"
          icon={<Map size={22} />}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAREER_ROADMAPS.map((roadmap) => {
            const Icon = ICON_MAP[roadmap.icon] || Coffee;
            const viewed = viewedRoadmaps.includes(roadmap.id);
            return (
              <Card
                key={roadmap.id}
                onClick={() => handleSelect(roadmap)}
                hoverable
                className="p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-md">
                    <Icon className="text-white" size={24} />
                  </div>
                  {viewed && <Badge color="green"><CheckCircle2 size={10} className="mr-0.5" /> Viewed</Badge>}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{roadmap.title}</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{roadmap.description}</p>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={14} className="text-gray-400" /> {roadmap.estTime}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <BarChart size={14} className="text-gray-400" /> {roadmap.difficulty}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <DollarSign size={14} className="text-green-500" />
                  <span className="text-xs font-medium text-gray-600">{roadmap.avgSalary}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {roadmap.skills.slice(0, 4).map((s) => (
                    <Badge key={s} color="gray">{s}</Badge>
                  ))}
                  {roadmap.skills.length > 4 && (
                    <Badge color="gray">+{roadmap.skills.length - 4} more</Badge>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-indigo-600">
                  View Roadmap <ArrowRight size={16} />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Detail view
  const Icon = ICON_MAP[selectedRoadmap.icon] || Coffee;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Career Roadmaps"
        subtitle="Structured learning paths to reach your career goals"
        icon={<Map size={22} />}
        action={
          <button
            onClick={() => setSelectedId(null)}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 transition-all"
          >
            ← All Roadmaps
          </button>
        }
      />

      {/* Roadmap header */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-cyan-50 border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shrink-0">
            <Icon className="text-white" size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{selectedRoadmap.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{selectedRoadmap.description}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <Badge color={DIFFICULTY_COLORS[selectedRoadmap.difficulty]} size="md">{selectedRoadmap.difficulty}</Badge>
              <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> {selectedRoadmap.estTime}</span>
              <span className="text-xs text-gray-500 flex items-center gap-1"><DollarSign size={12} /> {selectedRoadmap.avgSalary}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Skills to learn */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Skills You'll Learn</h3>
        <div className="flex flex-wrap gap-2">
          {selectedRoadmap.skills.map((skill) => (
            <div key={skill} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100">
              <CheckCircle2 size={14} className="text-indigo-600" />
              <span className="text-sm text-gray-700">{skill}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Phases timeline */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-5">Learning Phases</h3>
        <div className="space-y-3">
          {selectedRoadmap.phases.map((phase, i) => {
            const expanded = expandedPhases.has(phase.id);
            return (
              <div key={phase.id} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{phase.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                      <Clock size={11} /> {phase.duration} · {phase.topics.length} topics
                    </p>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {expanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-gray-50">
                    <div className="ml-14 space-y-3 mt-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Topics</p>
                        <div className="space-y-1.5">
                          {phase.topics.map((topic) => (
                            <div key={topic} className="flex items-center gap-2 text-sm text-gray-700">
                              <Circle size={8} className="text-indigo-400 fill-indigo-400 shrink-0" />
                              {topic}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Milestone</p>
                        <p className="text-sm text-gray-700">{phase.milestone}</p>
                      </div>
                    </div>
                  </div>
                )}

                {i < selectedRoadmap.phases.length - 1 && (
                  <div className="ml-9 h-3 w-0.5 bg-gray-200" />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* CTA */}
      <div className="grid sm:grid-cols-2 gap-4">
        <button
          onClick={() => setSelectedId(null)}
          className="py-3 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:border-indigo-300 transition-all flex items-center justify-center gap-2"
        >
          ← All Roadmaps
        </button>
        {onNavigate && (
          <button
            onClick={() => onNavigate('assessment')}
            className="py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            Test Your Skills <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
