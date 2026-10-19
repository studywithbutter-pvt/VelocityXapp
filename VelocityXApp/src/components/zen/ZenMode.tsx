import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Youtube, Sliders, Eye, Play, Pause } from 'lucide-react';
import AmbientMixer from './AmbientMixer';
import YouTubePlayer from './YouTubePlayer';
import { ActiveSession } from '../../types';

interface ZenModeProps {
  isOpen: boolean;
  onClose: () => void;
  session: ActiveSession | null;
  onPause?: () => void;
  onResume?: () => void;
  duration?: number;
}

type AmbientVisual = 'nebula' | 'rain' | 'starfield';

export default function ZenMode({
  isOpen,
  onClose,
  session,
  onPause,
  onResume,
  duration = 25,
}: ZenModeProps) {
  const [activeVisual, setActiveVisual] = useState<AmbientVisual>('nebula');
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [showYoutubePanel, setShowYoutubePanel] = useState(false);
  const [showMixerPanel, setShowMixerPanel] = useState(false);

  if (!isOpen) return null;

  // Active time calculations
  const totalSeconds = session ? session.targetDuration * 60 : duration * 60;
  const elapsedSeconds = session ? session.elapsedSeconds : 0;
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const progressPercent = totalSeconds > 0 ? (elapsedSeconds / totalSeconds) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 overflow-hidden bg-[#05070d] text-white flex flex-col md:flex-row"
    >
      {/* Visual Background / Dynamic Centerpiece (Sketch 2 Center & Sketch 3 Dynamic Center) */}
      <div className="relative flex-1 h-full flex items-center justify-center p-4 md:p-8">
        {/* If YouTube video is loaded, render dynamically in the center (Sketch 3) */}
        {youtubeVideoId ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/15 shadow-2xl shadow-cyan-500/10 bg-black/80 backdrop-blur-2xl relative z-10"
          >
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&enablejsapi=1`}
              title="Zen Mode Focus Media"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-none"
            />
          </motion.div>
        ) : (
          /* Procedural Ambient Visual Centerpiece */
          <div className="relative w-full h-full flex items-center justify-center">
            {activeVisual === 'nebula' && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-cyan-500/25 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="w-[400px] h-[400px] rounded-full bg-cyan-400/15 blur-[90px] animate-pulse" style={{ animationDuration: '6s' }} />
                
                {/* Orbital Rings */}
                <div className="absolute w-[450px] h-[450px] rounded-full border border-white/5 animate-spin" style={{ animationDuration: '60s' }} />
                <div className="absolute w-[300px] h-[300px] rounded-full border border-cyan-400/10 animate-spin" style={{ animationDuration: '40s', animationDirection: 'reverse' }} />
              </div>
            )}

            {activeVisual === 'rain' && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-b from-blue-950/40 to-[#05070d]" />
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15)_0,transparent_70%)]" />
                <div className="text-white/40 font-mono text-xs tracking-widest uppercase">
                  Cozy Rainfall Against Observation Window
                </div>
              </div>
            )}

            {activeVisual === 'starfield' && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,#1e1b4b_0%,#05070d_70%)]" />
                <div className="w-2 h-2 rounded-full bg-white animate-ping absolute top-1/4 left-1/3" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping absolute top-2/3 right-1/4" style={{ animationDelay: '1.2s' }} />
                <div className="text-white/40 font-mono text-xs tracking-widest uppercase">
                  Deep Space Starfield Drift
                </div>
              </div>
            )}

            {/* Visual selector pills at the bottom center */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl z-20">
              <button
                onClick={() => setActiveVisual('nebula')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono transition cursor-pointer ${
                  activeVisual === 'nebula'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Nebula
              </button>
              <button
                onClick={() => setActiveVisual('rain')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono transition cursor-pointer ${
                  activeVisual === 'rain'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Rain
              </button>
              <button
                onClick={() => setActiveVisual('starfield')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono transition cursor-pointer ${
                  activeVisual === 'starfield'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Starfield
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Side Dock (Right side on desktop, exact hand-drawn Sketch 2 layout) */}
      <div className="w-full md:w-84 md:h-full bg-[#0a0f1a]/85 border-t md:border-t-0 md:border-l border-white/10 backdrop-blur-2xl p-6 flex flex-col justify-between z-30 shadow-2xl">
        <div className="flex flex-col gap-6">
          {/* Top of Side Dock: Exit Zen Mode Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="font-mono text-xs text-purple-300 tracking-wider">ZEN MODE ON</span>
            </div>

            {/* Zen Mode Off Button (Hand-drawn Sketch 2) */}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 hover:text-white text-xs font-mono transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit Zen Mode</span>
            </button>
          </div>

          {/* Persistent Side Dock Timer ("Timer comes to side" from Sketch 2) */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-white/40 tracking-wider uppercase">
                {session?.status === 'flying' ? 'MISSION COUNTDOWN' : 'TARGET FOCUS'}
              </div>
              <div className="font-mono text-3xl font-medium tracking-tight text-white mt-0.5">
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </div>
              <div className="text-[10px] font-mono text-cyan-300 mt-0.5">
                {session ? `${session.title} · ${session.subject}` : `${duration} min session`}
              </div>
            </div>

            {/* Circular mini progress indicator */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              {session && (
                <button
                  onClick={session.isPaused ? onResume : onPause}
                  className="absolute inset-0 flex items-center justify-center text-white hover:text-cyan-300 cursor-pointer"
                >
                  {session.isPaused ? <Play className="w-4 h-4 fill-current text-emerald-400" /> : <Pause className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Media Dock Navigation Buttons (From Sketch 2: YT button & Audio Soundscapes) */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowYoutubePanel(!showYoutubePanel);
                setShowMixerPanel(false);
              }}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-mono flex items-center justify-center gap-2 transition cursor-pointer ${
                showYoutubePanel
                  ? 'bg-red-500/20 border-red-400/40 text-red-300'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>YouTube</span>
            </button>

            <button
              onClick={() => {
                setShowMixerPanel(!showMixerPanel);
                setShowYoutubePanel(false);
              }}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-mono flex items-center justify-center gap-2 transition cursor-pointer ${
                showMixerPanel
                  ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Soundscape</span>
            </button>
          </div>

          {/* Interactive Panels */}
          {showYoutubePanel && (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <YouTubePlayer
                videoId={youtubeVideoId}
                onSelectVideoId={(id) => setYoutubeVideoId(id)}
              />
            </div>
          )}

          {showMixerPanel && (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <AmbientMixer />
            </div>
          )}

          {!showYoutubePanel && !showMixerPanel && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-white/50 text-xs font-mono leading-relaxed">
              <p className="mb-2 text-white/80 font-medium">Distraction-Free Immersion</p>
              Tap <span className="text-red-300">YouTube</span> to stream focus lo-fi directly to center screen, or <span className="text-cyan-300">Soundscape</span> to mix ambient rain, thunder, and space drone.
            </div>
          )}
        </div>

        {/* Footer info in dock */}
        <div className="pt-4 border-t border-white/10 text-[10px] font-mono text-white/30 flex justify-between">
          <span>SINGULARITY MODE</span>
          <span>ORBITAL SYNC ACTIVE</span>
        </div>
      </div>
    </motion.div>
  );
}

