import { useState } from 'react';
import { 
  BarChart2, Activity, CheckCircle2, Flame, Award, 
  TrendingUp, Calendar, Clock, Target, ArrowUpRight, 
  Sparkles, Download, RefreshCw 
} from 'lucide-react';
import db from '../../services/db';
import { useToast } from '../../contexts/ToastContext';

export default function Progress() {
  const toast = useToast();
  const currentUser = db.getCurrentUser() || {};
  const [timeframe, setTimeframe] = useState('month');

  const xp = currentUser.stats?.points || currentUser.xp || 1450;
  const streak = currentUser.stats?.streakDays || currentUser.streak || 5;
  const tasksCompleted = currentUser.stats?.completedRoadmapNodes || currentUser.tasksCompleted || 8;
  const interviewsDone = currentUser.stats?.interviewsCompleted || currentUser.interviewsCompleted || 2;
  const dreamJob = currentUser.dreamJob || 'Full-Stack Software Engineer';

  const skillDomains = [
    { name: 'Data Structures & Algorithms', score: 78, level: 'Advanced', color: '#6366f1' },
    { name: 'System Architecture & Concurrency', score: 65, level: 'Proficient', color: '#8b5cf6' },
    { name: 'Modern Frontend & React 19', score: 88, level: 'Expert', color: '#ec4899' },
    { name: 'API Engineering & Distributed SQL', score: 72, level: 'Advanced', color: '#10b981' },
    { name: 'DevOps & Docker Deployment', score: 54, level: 'Intermediate', color: '#f59e0b' }
  ];

  const weeklySprints = [
    { day: 'Mon', hours: 3.5, active: true },
    { day: 'Tue', hours: 4.2, active: true },
    { day: 'Wed', hours: 2.0, active: true },
    { day: 'Thu', hours: 5.1, active: true },
    { day: 'Fri', hours: 4.8, active: true },
    { day: 'Sat', hours: 6.2, active: true },
    { day: 'Sun', hours: 3.0, active: false }
  ];

  const maxHours = Math.max(...weeklySprints.map(w => w.hours));

  const handleExportReport = () => {
    toast.success('Telemetry report generated! Downloading summary PDF...');
    const element = document.createElement('a');
    const file = new Blob([
      `NEXORA CAREER TELEMETRY REPORT\nGenerated for: ${currentUser.firstName || 'Student'} ${currentUser.lastName || ''}\nTarget Role: ${dreamJob}\nTotal XP: ${xp}\nStreak: ${streak} days\nCompleted Tasks: ${tasksCompleted}\nMock Interviews: ${interviewsDone}\nAverage Benchmark: 81.4%`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `NEXORA_Progress_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-lg pb-12">
      {/* Header with Title and Fast Actions */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
            <Activity size={14} /> Career Velocity Engine
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Progress &amp; Performance Telemetry
          </h1>
          <p className="text-muted text-sm">
            Empirical benchmark metrics calibrated for {dreamJob}.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex bg-card p-1 rounded-xl border border-border">
            {['week', 'month', 'all'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  timeframe === t ? 'bg-primary text-white' : 'text-muted hover:text-main'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            className="btn btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl cursor-pointer"
            title="Download Telemetry Report"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </header>

      {/* Hero 4-Stat Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-border">
          <div className="flex items-center justify-between text-muted text-xs mb-2">
            <span>Skill Mastery</span>
            <Target size={16} className="text-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-main">74.8%</div>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
            <ArrowUpRight size={12} /> +12.4% this cycle
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-border">
          <div className="flex items-center justify-between text-muted text-xs mb-2">
            <span>Total XP</span>
            <Award size={16} className="text-warning" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-main">{xp.toLocaleString()}</div>
          <span className="text-[11px] text-muted font-medium mt-1 block">
            Rank: Tier-1 Contender
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-border">
          <div className="flex items-center justify-between text-muted text-xs mb-2">
            <span>Active Streak</span>
            <Flame size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-main">{streak} Days</div>
          <span className="text-[11px] text-amber-400 font-medium mt-1 block">
            Top 5% consistency
          </span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-border">
          <div className="flex items-center justify-between text-muted text-xs mb-2">
            <span>Mock Rounds</span>
            <Sparkles size={16} className="text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-main">{interviewsDone}</div>
          <span className="text-[11px] text-purple-400 font-medium mt-1 block">
            Avg Score: 86.5/100
          </span>
        </div>
      </div>

      {/* Main Analysis: Weekly Velocity + Skill Competency Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Study Velocity Chart (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5 sm:p-6 rounded-2xl border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart2 size={18} className="text-primary" />
                <h2 className="text-sm sm:text-base font-bold text-main m-0">
                  Weekly Focus Velocity (Hours Invested)
                </h2>
              </div>
              <span className="text-xs text-muted font-mono">Total: 28.8 hrs</span>
            </div>
            <p className="text-muted text-xs mb-6">
              Track your daily sprint hours committed to coding sandboxes, algorithmic challenges, and system design docs.
            </p>
          </div>

          {/* Responsive Bar Chart */}
          <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 pt-6 pb-2 px-2 bg-input/40 rounded-xl border border-border/50">
            {weeklySprints.map((item) => {
              const heightPct = Math.round((item.hours / maxHours) * 100);
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-mono text-muted group-hover:text-primary transition-colors">
                    {item.hours}h
                  </span>
                  <div className="w-full max-w-[38px] bg-card rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                    <div
                      className="w-full rounded-t-lg transition-all duration-500 group-hover:opacity-90"
                      style={{
                        height: `${heightPct}%`,
                        background: item.active 
                          ? 'linear-gradient(180deg, var(--primary), rgba(99, 102, 241, 0.4))'
                          : 'rgba(255,255,255,0.1)'
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-muted group-hover:text-main transition-colors">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Competency Breakdown (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 sm:p-6 rounded-2xl border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-indigo-400" />
              <h2 className="text-sm sm:text-base font-bold text-main m-0">
                Core Competencies
              </h2>
            </div>
            <p className="text-muted text-xs mb-5">
              Calibrated against standard Tier-1 MNC hiring bars.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {skillDomains.map((skill) => (
              <div key={skill.name} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-main truncate pr-2">{skill.name}</span>
                  <span className="font-mono text-muted flex-shrink-0">{skill.score}%</span>
                </div>
                <div className="w-full h-2 bg-input rounded-full overflow-hidden border border-border/40">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${skill.score}%`,
                      background: skill.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted">
            <span>Next Milestone: Senior Readiness</span>
            <span className="font-bold text-primary">85.0% Required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
