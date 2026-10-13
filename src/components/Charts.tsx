import { RadarChart, PolarAngleAxis, PolarGrid, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import type { SkillProgress } from '@/types';

const CATEGORY_COLORS: Record<string, string> = {
  Fundamentals: '#6366f1',
  'Object-Oriented Programming': '#06b6d4',
  Collections: '#10b981',
  Exceptions: '#f59e0b',
  Concurrency: '#ef4444',
  'Modern Java': '#8b5cf6',
  'JVM Internals': '#ec4899',
};

export function SkillRadarChart({ skills }: { skills: SkillProgress[] }) {
  const data = skills.map((s) => ({ concept: s.concept, mastery: s.mastery }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Take an assessment to see your skill map
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data} outerRadius="70%">
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="concept" tick={{ fontSize: 9, fill: '#64748b' }} />
        <Radar dataKey="mastery" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function CategoryBarChart({ skills }: { skills: SkillProgress[] }) {
  const categoryMap = new Map<string, { total: number; count: number }>();
  for (const s of skills) {
    const existing = categoryMap.get(s.category) || { total: 0, count: 0 };
    categoryMap.set(s.category, { total: existing.total + s.mastery, count: existing.count + 1 });
  }
  const data = Array.from(categoryMap.entries()).map(([cat, { total, count }]) => ({
    category: cat.length > 15 ? cat.slice(0, 13) + '…' : cat,
    avg: Math.round(total / count),
    fullCat: cat,
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        No category data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} />
        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
          formatter={(v) => [`${v}%`, 'Avg Mastery']}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.fullCat || ''}
        />
        <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={CATEGORY_COLORS[entry.fullCat] || '#6366f1'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ProgressRing({ value, size = 120 }: { value: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="8"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        className="transform rotate-90"
        style={{ fontSize: size * 0.18, fontWeight: 700, fill: '#1e293b', transformOrigin: 'center' }}
      >
        {value}%
      </text>
    </svg>
  );
}
