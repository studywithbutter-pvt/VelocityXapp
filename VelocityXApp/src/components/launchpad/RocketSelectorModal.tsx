import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket } from '../../types';
import { X, Check, Lock, Shield, Zap, Compass } from 'lucide-react';

interface RocketSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  rockets: Rocket[];
  selectedRocketId: string;
  onSelectRocket: (id: string) => void;
  coins: number;
  onOpenStore: () => void;
}

export default function RocketSelectorModal({
  isOpen,
  onClose,
  rockets,
  selectedRocketId,
  onSelectRocket,
  coins,
  onOpenStore,
}: RocketSelectorModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative z-10 w-full max-w-2xl bg-[#0f172a]/90 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="font-display text-2xl tracking-wide">Hangar & Fleet Selection</h3>
                <p className="text-white/50 text-xs font-mono">Assign primary launch vehicle for this mission</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rockets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 max-h-[60vh] overflow-y-auto pr-1">
              {rockets.map((rocket) => {
                const isSelected = rocket.id === selectedRocketId;
                return (
                  <div
                    key={rocket.id}
                    onClick={() => {
                      if (rocket.unlocked) {
                        onSelectRocket(rocket.id);
                      }
                    }}
                    className={`relative p-4 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-400/60 shadow-lg shadow-cyan-500/10'
                        : rocket.unlocked
                        ? 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08] cursor-pointer'
                        : 'bg-black/40 border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: rocket.color }}
                          />
                          <h4 className="font-medium text-base text-white">{rocket.name}</h4>
                        </div>
                        <span className="text-[11px] text-white/50 font-mono block mt-0.5">
                          {rocket.variant}
                        </span>
                      </div>

                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">
                          <Check className="w-3 h-3" /> Ready
                        </span>
                      ) : !rocket.unlocked ? (
                        <span className="flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                          <Lock className="w-3 h-3" /> {rocket.price} VC
                        </span>
                      ) : null}
                    </div>

                    <p className="text-white/60 text-xs mt-3 line-clamp-2">{rocket.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-[11px] text-white/60 font-mono">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        <span>{rocket.stats.thrust}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Compass className="w-3 h-3 text-indigo-400" />
                        <span>{rocket.stats.efficiency}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-purple-400" />
                        <span>{rocket.stats.shields}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="text-xs text-white/50 font-mono">
                Balance: <span className="text-amber-400 font-bold">{coins}</span> Velocity Coins
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenStore();
                }}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
              >
                Visit RocketX Store →
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

