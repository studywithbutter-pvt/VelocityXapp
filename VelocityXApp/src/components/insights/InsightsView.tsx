import React from 'react';
import { MissionRecord, UserStats } from '../../types';
import { BarChart3, X, Clock, Flame, CheckCircle2, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';

interface InsightsViewProps {
  stats: UserStats;
  missions: MissionRecord[];
  onClose: () => void;
}

export default function InsightsView({ stats, missions, onClose }: InsightsViewProps) {
  // Aggregate subject minutes
  const subjectTimeMap: Record<string, number> = {};
  missions.forEach((m) => {
    if (m.outcome === 'success') {
      subjectTimeMap[m.subject] = (subjectTimeMap[m.subject] || 0) + m.actualDuration;
    }
  });

  const totalSubjectMinutes = Object.values(subjectTimeMap).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#070b14] text-white p-4 md:p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 text-indigo-300">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-3xl tracking-tight text-white">
              Study Insights & Flight Logs
            </h2>
            <p className="text-white/40 text-xs font-mono">
              Orbital telemetry, focus streaks, and mission analytics
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-5xl w-full mx-auto my-6 flex flex-col gap-8">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono mb-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>TOTAL FOCUS</span>
            </div>
            <div className="font-display text-3xl text-white">
              {Math.floor(stats.totalFocusMinutes / 60)}h {stats.totalFocusMinutes % 60}m
            </div>
            <div className="text-[11px] font-mono text-cyan-300 mt-1">
              {stats.totalFocusMinutes} mins recorded
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono mb-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>CURRENT STREAK</span>
            </div>
            <div className="font-display text-3xl text-white">
              {stats.streakDays} Days
            </div>
            <div className="text-[11px] font-mono text-amber-300 mt-1">
              Active daily momentum
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>MISSIONS LANDED</span>
            </div>
            <div className="font-display text-3xl text-white">
              {stats.completedMissions}
            </div>
            <div className="text-[11px] font-mono text-emerald-300 mt-1">
              {stats.forfeitedMissions} aborted missions
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>VELOCITY COINS</span>
            </div>
            <div className="font-display text-3xl text-amber-400 font-bold">
              {stats.coins} VC
            </div>
            <div className="text-[11px] font-mono text-white/40 mt-1">
              Fleet treasury
            </div>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl text-white">Subject Distribution</h3>
            <span className="text-xs font-mono text-white/40">
              {Object.keys(subjectTimeMap).length} Active Subjects
            </span>
          </div>

          {Object.keys(subjectTimeMap).length === 0 ? (
            <p className="text-white/40 text-xs font-mono py-4">
              Complete your first focus mission to generate subject telemetry.
            </p>
          ) : (
            <div className="space-y-3">
              {Object.entries(subjectTimeMap).map(([subj, mins]) => {
                const pct = totalSubjectMinutes > 0 ? (mins / totalSubjectMinutes) * 100 : 0;
                return (
                  <div key={subj} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white/80">{subj}</span>
                      <span className="text-white/50">{mins} mins ({Math.round(pct)}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Flight Mission Logs */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <h3 className="font-display text-xl text-white mb-4">Mission History Log</h3>

          {missions.length === 0 ? (
            <div className="text-center py-8 text-white/40 font-mono text-xs">
              No flight missions logged yet. Launch your first mission from the launchpad!
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {missions.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    {m.outcome === 'success' ? (
                      <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-400/20">
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                    )}
                    <div>
                      <div className="text-white font-medium text-sm">{m.title}</div>
                      <div className="text-white/40 text-[11px]">
                        {m.subject} · {m.rocketName} · Sector [{m.gridX}, {m.gridY}]
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-white font-semibold">{m.actualDuration} min</div>
                    <div className="text-amber-400 text-[11px]">+{m.coinsEarned} VC</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

