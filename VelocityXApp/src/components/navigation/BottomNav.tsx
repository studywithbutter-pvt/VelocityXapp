import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Sparkles } from 'lucide-react';
import { MainTab } from '../../types';

interface BottomNavProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
}

export default function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-6 left-0 right-0 z-30 flex justify-center pointer-events-none px-4">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="pointer-events-auto flex items-center p-1.5 rounded-full bg-[#0a0f1a]/80 border border-white/15 backdrop-blur-2xl shadow-2xl shadow-black/80"
      >
        {/* Velocity Tab */}
        <button
          onClick={() => onSelectTab('velocity')}
          className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
            activeTab === 'velocity'
              ? 'text-white'
              : 'text-white/40 hover:text-white/80'
          }`}
        >
          {activeTab === 'velocity' && (
            <motion.div
              layoutId="bottomNavPill"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-400/40 shadow-lg shadow-cyan-500/20"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Rocket className={`w-3.5 h-3.5 z-10 ${activeTab === 'velocity' ? 'text-cyan-300' : ''}`} />
          <span className="z-10 font-medium">VELOCITY</span>
        </button>

        {/* Prism Tab */}
        <button
          onClick={() => onSelectTab('prism')}
          className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
            activeTab === 'prism'
              ? 'text-white'
              : 'text-white/40 hover:text-white/80'
          }`}
        >
          {activeTab === 'prism' && (
            <motion.div
              layoutId="bottomNavPill"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/40 shadow-lg shadow-purple-500/20"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <Sparkles className={`w-3.5 h-3.5 z-10 ${activeTab === 'prism' ? 'text-purple-300' : ''}`} />
          <span className="z-10 font-medium">PRISM</span>
        </button>
      </motion.div>
    </nav>
  );
}
