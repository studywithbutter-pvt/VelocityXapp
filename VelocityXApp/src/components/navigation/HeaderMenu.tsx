import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Rocket, Compass, BarChart3, ShoppingBag, Sparkles } from 'lucide-react';
import { ViewMode } from '../../types';

interface HeaderMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  activeView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  coins: number;
}

export default function HeaderMenu({
  isOpen,
  onToggle,
  activeView,
  onSelectView,
  coins,
}: HeaderMenuProps) {
  const navItems: { id: ViewMode; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'pomox',
      label: 'PomoX',
      desc: 'Launchpad & Mission Timer',
      icon: Rocket,
    },
    {
      id: 'rocketx',
      label: 'RocketX Field',
      desc: '16×16 Landing Grid & Missions',
      icon: Compass,
    },
    {
      id: 'insights',
      label: 'Study Insights',
      desc: 'Focus History & Analytics',
      icon: BarChart3,
    },
    {
      id: 'store',
      label: 'RocketX Store',
      desc: 'Fleet Upgrades & Hangar',
      icon: ShoppingBag,
    },
  ];

  return (
    <>
      {/* Top Bar Floating Controls */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-6 pointer-events-none">
        {/* Menu Toggle Button (Hand-drawn Sketch 1 top-left) */}
        <button
          onClick={onToggle}
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-xl text-white transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          {isOpen ? <X className="w-4 h-4 text-cyan-300" /> : <Menu className="w-4 h-4 text-cyan-300" />}
          <span className="text-xs font-mono tracking-wider uppercase font-medium">Menu</span>
        </button>

        {/* Currency / Coins Pill (Top Right) */}
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-white font-medium">{coins}</span>
          <span className="text-white/40 text-[10px]">VC</span>
        </div>
      </header>

      {/* Slide-out Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10 w-80 max-w-[85vw] h-full bg-[#0a0f1a]/95 border-r border-white/10 backdrop-blur-2xl p-6 flex flex-col justify-between shadow-2xl text-white"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div>
                    <h2 className="font-display text-3xl tracking-tight text-white">Velocity</h2>
                    <p className="text-white/40 text-[11px] font-mono mt-0.5">Orbital Productivity OS</p>
                  </div>
                  <button
                    onClick={onToggle}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Destinations */}
                <nav className="mt-6 flex flex-col gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectView(item.id);
                          onToggle();
                        }}
                        className={`flex items-center gap-3.5 p-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-cyan-500/15 border border-cyan-400/40 text-white shadow-md shadow-cyan-500/10'
                            : 'bg-white/5 border border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl ${
                            isActive ? 'bg-cyan-400 text-[#0a0f1a]' : 'bg-white/10 text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium tracking-wide">{item.label}</div>
                          <div className="text-[11px] text-white/40 font-mono">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Footer Info */}
              <div className="pt-6 border-t border-white/10 text-[11px] text-white/40 font-mono flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>SYSTEM STATUS</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    NOMINAL
                  </span>
                </div>
                <span>VELOCITY PROTOCOL V2.4</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

