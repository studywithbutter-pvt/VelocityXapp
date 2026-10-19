import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MissionRecord } from '../../types';
import { Sparkles, CheckCircle2, ArrowRight, Compass } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

interface MissionSuccessModalProps {
  mission: MissionRecord | null;
  onClose: () => void;
  onViewRocketX: () => void;
}

export default function MissionSuccessModal({
  mission,
  onClose,
  onViewRocketX,
}: MissionSuccessModalProps) {
  useEffect(() => {
    if (mission) {
      audioEngine.playSuccessChime();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#818cf8', '#fbbf24', '#ffffff'],
      });
    }
  }, [mission]);

  if (!mission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-lg"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative z-10 w-full max-w-md bg-[#0a0f1a]/95 border border-cyan-400/40 rounded-3xl p-6 shadow-2xl text-white text-center backdrop-blur-2xl"
      >
        {/* Glow badge */}
        <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
          <CheckCircle2 className="w-8 h-8 text-cyan-300" />
        </div>

        <h2 className="font-display text-4xl tracking-tight text-white mb-1">
          Mission Success
        </h2>
        <p className="text-cyan-300 font-mono text-xs tracking-widest uppercase mb-6">
          Safe Landing Confirmed
        </p>

        {/* Mission Stats Breakdown */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left font-mono text-xs mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-white/50">MISSION:</span>
            <span className="text-white font-medium">{mission.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">SUBJECT:</span>
            <span className="text-cyan-300 font-medium">{mission.subject}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">TIME FOCUSED:</span>
            <span className="text-white font-medium">{mission.actualDuration} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">ROCKETX GRID:</span>
            <span className="text-indigo-300 font-medium">Sector [{mission.gridX}, {mission.gridY}]</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/10">
            <span className="text-white/50">REWARDS EARNED:</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> +{mission.coinsEarned} VC
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              onClose();
              onViewRocketX();
            }}
            className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <span>View in RocketX 16×16 Field</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-mono text-xs transition cursor-pointer"
          >
            Return to Launchpad
          </button>
        </div>
      </motion.div>
    </div>
  );
}

