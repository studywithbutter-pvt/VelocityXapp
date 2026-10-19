import React from 'react';
import { Rocket } from '../../types';
import { ShoppingBag, X, Check, Lock, Sparkles, Shield, Zap, Compass } from 'lucide-react';

interface RocketStoreProps {
  rockets: Rocket[];
  coins: number;
  selectedRocketId: string;
  onBuyRocket: (rocketId: string) => void;
  onEquipRocket: (rocketId: string) => void;
  onClose: () => void;
}

export default function RocketStore({
  rockets,
  coins,
  selectedRocketId,
  onBuyRocket,
  onEquipRocket,
  onClose,
}: RocketStoreProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#070b14] text-white p-4 md:p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-300">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-3xl tracking-tight text-white">
              RocketX Store & Fleet Hangar
            </h2>
            <p className="text-white/40 text-xs font-mono">
              Purchase and configure spacecraft using earned Velocity Coins
            </p>
          </div>
        </div>

        {/* Currency & Close */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold text-sm">{coins}</span>
            <span className="text-white/50">VC</span>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 max-w-5xl w-full mx-auto">
        {rockets.map((rocket) => {
          const isEquipped = rocket.id === selectedRocketId;
          const canAfford = coins >= rocket.price;

          return (
            <div
              key={rocket.id}
              className={`p-6 rounded-3xl border transition-all duration-300 relative flex flex-col justify-between ${
                isEquipped
                  ? 'bg-cyan-500/10 border-cyan-400/60 shadow-xl shadow-cyan-500/10'
                  : rocket.unlocked
                  ? 'bg-white/5 border-white/10 hover:border-white/20'
                  : 'bg-black/50 border-white/5'
              }`}
            >
              <div>
                {/* Top Title & Badge */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-cyan-300 tracking-wider uppercase">
                      {rocket.variant}
                    </span>
                    <h3 className="font-display text-3xl text-white mt-0.5">{rocket.name}</h3>
                  </div>

                  {isEquipped ? (
                    <span className="flex items-center gap-1 text-xs font-mono text-cyan-300 bg-cyan-400/20 px-3 py-1 rounded-full border border-cyan-400/40">
                      <Check className="w-3.5 h-3.5" /> EQUIPPED
                    </span>
                  ) : rocket.unlocked ? (
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-mono text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                      <Lock className="w-3.5 h-3.5" /> {rocket.price} VC
                    </span>
                  )}
                </div>

                {/* Rocket Visual Graphic */}
                <div className="my-6 py-8 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center relative overflow-hidden">
                  <div
                    className="w-10 h-28 rounded-t-full shadow-2xl relative"
                    style={{ backgroundColor: rocket.color }}
                  >
                    <div className="w-3 h-3 bg-cyan-200 rounded-full mx-auto mt-4 border border-black/30" />
                    <div className="absolute bottom-0 -left-4 w-4 h-10 bg-white/30 skew-y-12" />
                    <div className="absolute bottom-0 -right-4 w-4 h-10 bg-white/30 -skew-y-12" />
                  </div>
                </div>

                <p className="text-white/60 text-xs leading-relaxed mb-6">
                  {rocket.description}
                </p>

                {/* Rocket Specifications */}
                <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-mono mb-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-white/40 text-[10px] flex items-center gap-1">
                      <Zap className="w-3 h-3 text-cyan-400" /> THRUST
                    </span>
                    <span className="text-white font-semibold">{rocket.stats.thrust}%</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-white/40 text-[10px] flex items-center gap-1">
                      <Compass className="w-3 h-3 text-indigo-400" /> RANGE
                    </span>
                    <span className="text-white font-semibold">{rocket.stats.efficiency}%</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-white/40 text-[10px] flex items-center gap-1">
                      <Shield className="w-3 h-3 text-purple-400" /> SHIELDS
                    </span>
                    <span className="text-white font-semibold">{rocket.stats.shields}%</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isEquipped ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-2xl bg-cyan-500/20 text-cyan-300 font-mono text-xs tracking-wider uppercase border border-cyan-400/30 cursor-default"
                  >
                    Currently Equipped on Pad
                  </button>
                ) : rocket.unlocked ? (
                  <button
                    onClick={() => onEquipRocket(rocket.id)}
                    className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs tracking-wider uppercase transition cursor-pointer border border-white/20"
                  >
                    Equip to Launchpad
                  </button>
                ) : (
                  <button
                    onClick={() => onBuyRocket(rocket.id)}
                    disabled={!canAfford}
                    className={`w-full py-3 rounded-2xl font-mono text-xs tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-2 ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow-lg shadow-amber-500/20'
                        : 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Purchase ({rocket.price} VC)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

