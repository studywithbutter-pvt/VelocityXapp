import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket as RocketType, Subject } from '../../types';
import RadialTimer from '../radial-timer/RadialTimer';
import { Sparkles, Play, ChevronRight, Edit3, Compass } from 'lucide-react';

interface LaunchpadViewProps {
  duration: number;
  onSelectDuration: (d: number) => void;
  selectedRocket: RocketType;
  onOpenRocketSelector: () => void;
  onOpenZenMode: () => void;
  onLaunchMission: () => void;
  subject: Subject;
  onChangeSubject: (s: Subject) => void;
  missionTitle: string;
  onChangeMissionTitle: (t: string) => void;
}

const DEFAULT_SUBJECTS: Subject[] = [
  'Physics',
  'Mathematics',
  'Biology',
  'Computer Science',
  'History',
  'General Study',
];

export default function LaunchpadView({
  duration,
  onSelectDuration,
  selectedRocket,
  onOpenRocketSelector,
  onOpenZenMode,
  onLaunchMission,
  subject,
  onChangeSubject,
  missionTitle,
  onChangeMissionTitle,
}: LaunchpadViewProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-28 text-white">
      {/* Visual Rocket Centerstage & Ambient Launch Area */}
      <div className="flex flex-col items-center max-w-xl w-full">
        {/* Velocity Wordmark & Status */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[11px] font-mono text-cyan-300 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            PAD-01 ACTIVE · READY FOR IGNITION
          </div>
          <h1 className="font-display text-5xl md:text-7xl tracking-tight text-white drop-shadow-md">
            Velocity
          </h1>
        </motion.div>

        {/* The Radial Duration Dial (Centerpiece) */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative flex flex-col items-center my-2"
        >
          <RadialTimer
            duration={duration}
            onSelect={onSelectDuration}
            maxDuration={300}
            size={280}
            interactive={true}
          />
        </motion.div>

        {/* Controls Row: Rocket Selector & Zen Mode Button (Exact hand-drawn Sketch 1 layout) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mt-6 mb-6 w-full max-w-xs"
        >
          {/* Rocket Selector Pill */}
          <button
            onClick={onOpenRocketSelector}
            className="flex-1 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-xl text-xs font-mono transition-all duration-200 group cursor-pointer shadow-lg active:scale-98"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-sm"
                style={{ backgroundColor: selectedRocket.color }}
              />
              <span className="text-white font-medium">{selectedRocket.name}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition" />
          </button>

          {/* Zen Mode Button (Z) (From Sketch 1) */}
          <button
            onClick={onOpenZenMode}
            title="Enter Zen Mode (Singularity Focus)"
            className="relative p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-purple-400/40 backdrop-blur-xl text-purple-200 shadow-lg shadow-purple-500/10 transition-all duration-200 active:scale-95 group cursor-pointer"
          >
            <div className="w-6 h-6 flex items-center justify-center font-display text-lg font-bold">
              Z
            </div>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            </span>
          </button>
        </motion.div>

        {/* Mission Brief & Subject Setup */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="w-full flex flex-col items-center gap-3 mb-6"
        >
          {/* Editable Mission Title */}
          <div className="flex items-center gap-2 group">
            {isEditingTitle ? (
              <input
                type="text"
                autoFocus
                value={missionTitle}
                onChange={(e) => onChangeMissionTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                className="bg-black/50 border border-cyan-400/40 rounded-xl px-3 py-1 text-center font-medium text-sm text-white outline-none"
              />
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center gap-2 cursor-pointer hover:text-cyan-300 transition text-sm text-white/80 font-medium"
              >
                <span>{missionTitle || 'Mission Briefing: Deep Work'}</span>
                <Edit3 className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
              </div>
            )}
          </div>

          {/* Subject Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-md">
            {DEFAULT_SUBJECTS.map((sub) => (
              <button
                key={sub}
                onClick={() => onChangeSubject(sub)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer ${
                  subject === sub
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                    : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Launch Mission Action CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-xs flex justify-center"
        >
          <button
            onClick={onLaunchMission}
            disabled={duration <= 0}
            className={`w-full py-4 px-8 rounded-full font-mono text-sm tracking-wider uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl cursor-pointer ${
              duration > 0
                ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-semibold border border-cyan-300/40 shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
            }`}
          >
            <Play className={`w-4 h-4 fill-current ${duration > 0 ? 'animate-pulse' : ''}`} />
            <span>Launch Mission ({duration}m)</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

