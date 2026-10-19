import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ActiveSession, Subject } from '../../types';
import { Play, Pause, AlertTriangle, CheckCircle2, Sparkles, Compass } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

interface FlightViewProps {
  session: ActiveSession;
  rocket: Rocket;
  onPause: () => void;
  onResume: () => void;
  onForfeit: () => void;
  onComplete: () => void;
  onOpenZenMode: () => void;
}

export default function FlightView({
  session,
  rocket,
  onPause,
  onResume,
  onForfeit,
  onComplete,
  onOpenZenMode,
}: FlightViewProps) {
  const [showForfeitConfirm, setShowForfeitConfirm] = useState(false);

  // Time calculations
  const totalSeconds = session.targetDuration * 60;
  const remainingSeconds = Math.max(0, totalSeconds - session.elapsedSeconds);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const progressPercent = Math.min(100, (session.elapsedSeconds / totalSeconds) * 100);

  // Sound effects when launching
  useEffect(() => {
    if (session.status === 'launching') {
      audioEngine.playIgnition();
    }
  }, [session.status]);

  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-between p-6 pt-20 pb-28 text-white select-none">
      {/* Launch Liftoff Overlay Sequence (if status is launching) */}
      <AnimatePresence>
        {session.status === 'launching' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 200, scale: 0.8 }}
              animate={{ y: -500, scale: 1.1 }}
              transition={{ duration: 2.5, ease: 'easeIn' }}
              className="relative flex flex-col items-center"
            >
              {/* Rocket Body */}
              <div
                className="w-8 h-24 rounded-t-full relative shadow-2xl"
                style={{ backgroundColor: rocket.color }}
              >
                {/* Nose Cone */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/80 rounded-t-full" />
                {/* Windows */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-cyan-200 rounded-full border border-black/30" />
                {/* Fins */}
                <div className="absolute bottom-0 -left-3 w-3 h-8 bg-white/40 skew-y-12" />
                <div className="absolute bottom-0 -right-3 w-3 h-8 bg-white/40 -skew-y-12" />
              </div>

              {/* Exhaust Plume Fire */}
              <motion.div
                animate={{ scaleY: [1, 1.4, 1], scaleX: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.15 }}
                className="w-12 h-36 bg-gradient-to-b from-amber-400 via-orange-500 to-transparent blur-xs rounded-b-full origin-top"
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.1, 1.2, 1.4] }}
              transition={{ duration: 2.2 }}
              className="font-display text-4xl md:text-6xl text-cyan-300 font-bold tracking-widest mt-12"
            >
              IGNITION & LIFTOFF
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flight HUD Header */}
      <div className="w-full max-w-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full animate-ping"
            style={{ backgroundColor: rocket.color }}
          />
          <div>
            <div className="text-xs font-mono text-cyan-300 tracking-wider">
              MISSION IN PROGRESS
            </div>
            <div className="text-sm font-medium text-white/90">
              {session.title} · {session.subject}
            </div>
          </div>
        </div>

        {/* Zen Mode Button (Z) accessible in-flight */}
        <button
          onClick={onOpenZenMode}
          title="Switch to Zen Mode"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-mono backdrop-blur-xl transition active:scale-95 cursor-pointer shadow-lg shadow-purple-500/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>ZEN MODE</span>
        </button>
      </div>

      {/* Center Flight Visual: Orbiting Rocket & Circular Progress HUD */}
      <div className="flex flex-col items-center justify-center my-6 relative">
        {/* Animated Warp Stars Layer */}
        <div className="absolute inset-0 -m-16 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute w-1 h-24 bg-white/60 blur-[0.5px] top-10 left-12 animate-pulse" />
          <div className="absolute w-1.5 h-32 bg-cyan-300/40 blur-[0.5px] bottom-16 right-16 animate-pulse" />
        </div>

        {/* Circular Countdown Ring */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            {/* Background Track */}
            <circle
              cx="144"
              cy="144"
              r="120"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="6"
              fill="none"
            />
            {/* Active Remaining Progress Arc */}
            <circle
              cx="144"
              cy="144"
              r="120"
              stroke="url(#flightGrad)"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="flightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Digital Clock & Flight Status */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {/* Rocket Icon in Cruise */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="mb-2"
            >
              <div
                className="w-5 h-12 rounded-t-full relative mx-auto shadow-lg"
                style={{ backgroundColor: rocket.color }}
              >
                <div className="w-1.5 h-1.5 bg-cyan-200 rounded-full mx-auto mt-2" />
                {/* Gentle Thruster Glow */}
                <div
                  className="w-3 h-5 blur-[2px] mx-auto rounded-b-full animate-pulse"
                  style={{ backgroundColor: rocket.flameColor }}
                />
              </div>
            </motion.div>

            {/* Countdown Numbers */}
            <div className="font-mono text-5xl font-medium tracking-tight text-white drop-shadow-md">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            <div className="text-white/40 text-[11px] font-mono mt-1">
              {session.isPaused ? 'MISSION PAUSED' : `${Math.round(progressPercent)}% TRAJECTORY COMPLETE`}
            </div>
          </div>
        </div>
      </div>

      {/* Flight Controls Bar */}
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 w-full">
          {/* Pause / Resume Button */}
          <button
            onClick={session.isPaused ? onResume : onPause}
            className="flex-1 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-xl text-white font-mono text-xs tracking-wider flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-lg"
          >
            {session.isPaused ? (
              <>
                <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>RESUME</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 text-amber-300" />
                <span>PAUSE</span>
              </>
            )}
          </button>

          {/* Safe Landing Complete Button */}
          <button
            onClick={onComplete}
            className="py-3 px-4 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 font-mono text-xs tracking-wider flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-lg shadow-emerald-500/10"
            title="Complete Mission and Record Safe Landing"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>LAND</span>
          </button>

          {/* Forfeit Mission Button */}
          <button
            onClick={() => setShowForfeitConfirm(true)}
            className="py-3 px-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-mono transition active:scale-95 cursor-pointer"
            title="Abort Mission (Crash Sequence)"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>

        {/* Confirmation Modal for Forfeit */}
        <AnimatePresence>
          {showForfeitConfirm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full p-4 rounded-2xl bg-red-950/80 border border-red-500/40 text-left backdrop-blur-xl"
            >
              <div className="flex items-center gap-2 text-rose-300 font-mono text-xs font-semibold mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>WARNING: MISSION ABORT SEQUENCE</span>
              </div>
              <p className="text-white/70 text-xs mb-3">
                Aborting now will result in rocket crash wreckage and lost rewards. Are you sure you want to forfeit?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowForfeitConfirm(false);
                    onForfeit();
                  }}
                  className="flex-1 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs transition cursor-pointer"
                >
                  Confirm Abort & Crash
                </button>
                <button
                  onClick={() => setShowForfeitConfirm(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-xs font-mono transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

