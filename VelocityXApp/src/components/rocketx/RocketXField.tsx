import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MissionRecord } from '../../types';
import { Compass, CheckCircle2, AlertTriangle, X, Shield, Calendar, Clock } from 'lucide-react';

interface RocketXFieldProps {
  missions: MissionRecord[];
  onClose: () => void;
}

export default function RocketXField({ missions, onClose }: RocketXFieldProps) {
  const [selectedMission, setSelectedMission] = useState<MissionRecord | null>(null);
  const [filter, setFilter] = useState<'all' | 'success' | 'forfeited'>('all');

  const filteredMissions = missions.filter((m) => {
    if (filter === 'all') return true;
    return m.outcome === filter;
  });

  // Build grid map key: "x,y" -> mission
  const gridMap = new Map<string, MissionRecord>();
  filteredMissions.forEach((m) => {
    gridMap.set(`${m.gridX},${m.gridY}`, m);
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#080d19] text-white p-4 md:p-8 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-3xl tracking-tight text-white">
              RocketX · 16×16 Landing Field
            </h2>
            <p className="text-white/40 text-xs font-mono">
              Persistent mission forest and landing sectors ({missions.length} missions logged)
            </p>
          </div>
        </div>

        {/* Filters & Close */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                filter === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-white/50 hover:text-white'
              }`}
            >
              All ({missions.length})
            </button>
            <button
              onClick={() => setFilter('success')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                filter === 'success' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-white/50 hover:text-white'
              }`}
            >
              Landed ({missions.filter(m => m.outcome === 'success').length})
            </button>
            <button
              onClick={() => setFilter('forfeited')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                filter === 'forfeited' ? 'bg-rose-500/20 text-rose-300 font-semibold' : 'text-white/50 hover:text-white'
              }`}
            >
              Crashed ({missions.filter(m => m.outcome === 'forfeited').length})
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 flex flex-col items-center justify-center my-6 max-w-6xl w-full mx-auto">
        <div className="p-4 md:p-6 rounded-3xl bg-[#0a0f20]/90 border border-white/10 shadow-2xl backdrop-blur-xl">
          <div 
            className="grid gap-1 md:gap-1.5 w-full max-w-[650px] aspect-square"
            style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
          >
            {Array.from({ length: 256 }).map((_, index) => {
              const x = index % 16;
              const y = Math.floor(index / 16);
              const mission = gridMap.get(`${x},${y}`);

              return (
                <button
                  key={index}
                  onClick={() => mission && setSelectedMission(mission)}
                  className={`aspect-square rounded-md transition-all duration-150 flex items-center justify-center relative group ${
                    mission
                      ? mission.outcome === 'success'
                        ? 'bg-cyan-500/30 border border-cyan-400 hover:scale-125 hover:z-20 shadow-md shadow-cyan-500/40 cursor-pointer'
                        : 'bg-rose-500/30 border border-rose-400 hover:scale-125 hover:z-20 shadow-md shadow-rose-500/40 cursor-pointer'
                      : 'bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.08]'
                  }`}
                  title={mission ? `${mission.title} [${x}, ${y}]` : `Sector [${x}, ${y}]`}
                >
                  {mission && (
                    <span
                      className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                        mission.outcome === 'success' ? 'bg-cyan-300' : 'bg-rose-400'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 text-xs font-mono text-white/50">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-cyan-500/30 border border-cyan-400" />
            <span>Safe Landing (Landed Rocket)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-rose-500/30 border border-rose-400" />
            <span>Crash Site (Forfeited Mission)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-white/5 border border-white/10" />
            <span>Uncharted Sector</span>
          </div>
        </div>
      </div>

      {/* Selected Mission Inspector Modal */}
      <AnimatePresence>
        {selectedMission && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMission(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-sm bg-[#0a0f1a] border border-white/15 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl text-white"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  {selectedMission.outcome === 'success' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-cyan-300 bg-cyan-400/20 border border-cyan-400/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> LANDED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-rose-300 bg-rose-400/20 border border-rose-400/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> CRASHED
                    </span>
                  )}
                  <span className="font-mono text-xs text-white/50">
                    Sector [{selectedMission.gridX}, {selectedMission.gridY}]
                  </span>
                </div>
                <button
                  onClick={() => setSelectedMission(null)}
                  className="p-1 rounded-full bg-white/5 hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-display text-2xl text-white mt-3">
                {selectedMission.title}
              </h3>
              <p className="text-cyan-300 text-xs font-mono mb-4">
                {selectedMission.subject} · {selectedMission.rocketName}
              </p>

              <div className="space-y-2 text-xs font-mono text-white/70 bg-white/5 p-4 rounded-2xl mb-4">
                <div className="flex justify-between">
                  <span className="text-white/40">Focused Duration:</span>
                  <span>{selectedMission.actualDuration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Target Duration:</span>
                  <span>{selectedMission.targetDuration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Coins Earned:</span>
                  <span className="text-amber-400 font-bold">+{selectedMission.coinsEarned} VC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Timestamp:</span>
                  <span>{new Date(selectedMission.timestamp).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedMission(null)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs transition cursor-pointer"
              >
                Close Inspector
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
