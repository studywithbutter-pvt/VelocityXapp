import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Lock, Compass } from 'lucide-react';

export default function PrismView() {
  return (
    <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-6 text-white text-center pb-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full flex flex-col items-center"
      >
        {/* Prismatic icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 blur-2xl opacity-40 animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-white/5 border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl">
            <Sparkles className="w-9 h-9 text-purple-300 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
        </div>

        {/* Title */}
        <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-3">
          Prism
        </h2>
        <p className="text-purple-300 font-mono text-xs tracking-widest uppercase mb-4">
          Autonomous Mission Intelligence
        </p>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-mono mb-8">
          <Lock className="w-3.5 h-3.5" />
          <span>Prism is in development</span>
        </div>

        <p className="text-white/60 text-sm max-w-sm leading-relaxed mb-8">
          An orbital AI co-pilot designed to analyze your study patterns, optimize focus cycles, and dynamically adjust mission trajectories.
        </p>

        {/* Disabled Futuristic Chat Preview */}
        <div className="w-full rounded-2xl bg-black/40 border border-white/10 p-3 backdrop-blur-xl flex items-center gap-3 opacity-60">
          <input
            type="text"
            disabled
            placeholder="Ask Prism to plan your next mission..."
            className="flex-1 bg-transparent border-none text-xs font-mono text-white/50 placeholder:text-white/30 outline-none cursor-not-allowed"
          />
          <button
            disabled
            className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

