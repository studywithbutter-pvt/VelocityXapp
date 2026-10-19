import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface RadialTimerProps {
  duration: number; // in minutes (0 to 300)
  onSelect: (duration: number) => void;
  maxDuration?: number; // default 300
  size?: number; // px size
  interactive?: boolean;
}

export default function RadialTimer({
  duration,
  onSelect,
  maxDuration = 300,
  size = 280,
  interactive = true,
}: RadialTimerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Angle from 0 to 360 degrees (0 at 12 o'clock)
  const angle = (duration / maxDuration) * 360;

  // Calculate duration from pointer event
  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;

      // atan2(dx, -dy) gives angle from top (12 o'clock) in radians [ -PI, PI ]
      let rad = Math.atan2(dx, -dy);
      if (rad < 0) {
        rad += Math.PI * 2;
      }

      // Normalized 0 to 1
      const normalized = rad / (Math.PI * 2);
      const rawMins = normalized * maxDuration;
      
      // Step by 5 minutes
      const stepped = Math.round(rawMins / 5) * 5;
      const clamped = Math.max(0, Math.min(maxDuration, stepped));
      onSelect(clamped);
    },
    [maxDuration, onSelect]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging && interactive) {
      updateFromPointer(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    }
  };

  // SVG parameters
  const strokeWidth = 8;
  const radius = (size - 40) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * (duration / maxDuration));

  // Ticks calculation (every 15 min major, every 5 min minor)
  const ticks = [];
  const totalTicks = maxDuration / 5; // 60 ticks
  for (let i = 0; i <= totalTicks; i++) {
    const tickAngle = (i / totalTicks) * 360 - 90; // -90 so 0 is at 12 o'clock
    const rad = (tickAngle * Math.PI) / 180;
    const isMajor = (i * 5) % 15 === 0;
    const isHour = (i * 5) % 60 === 0;
    const tickLen = isHour ? 10 : isMajor ? 6 : 3;
    const outerR = radius + 14;
    const innerR = outerR - tickLen;

    const x1 = center + innerR * Math.cos(rad);
    const y1 = center + innerR * Math.sin(rad);
    const x2 = center + outerR * Math.cos(rad);
    const y2 = center + outerR * Math.sin(rad);

    ticks.push({
      key: i,
      x1,
      y1,
      x2,
      y2,
      isMajor,
      isHour,
      mins: i * 5,
    });
  }

  // Handle marker knob position
  const knobAngleRad = ((angle - 90) * Math.PI) / 180;
  const knobX = center + radius * Math.cos(knobAngleRad);
  const knobY = center + radius * Math.sin(knobAngleRad);

  return (
    <div className="flex flex-col items-center select-none">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`relative touch-none flex items-center justify-center ${
          interactive ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        style={{ width: size, height: size }}
      >
        {/* Glow backdrop ring */}
        <div 
          className="absolute inset-4 rounded-full bg-cyan-500/5 blur-xl transition-all duration-300"
          style={{ opacity: duration > 0 ? 0.8 : 0.2 }}
        />

        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <filter id="knobGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dial Ticks */}
          {ticks.map((t) => (
            <line
              key={t.key}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={
                t.mins <= duration && duration > 0
                  ? '#38bdf8'
                  : t.isMajor
                  ? 'rgba(255,255,255,0.4)'
                  : 'rgba(255,255,255,0.15)'
              }
              strokeWidth={t.isHour ? 2 : t.isMajor ? 1.5 : 1}
              className="transition-colors duration-150"
            />
          ))}

          {/* Background Track Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />

          {/* Progress Active Arc (Starts at 12 o'clock = -90 deg) */}
          {duration > 0 && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="url(#timerGrad)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${center} ${center})`}
              className="transition-all duration-75"
            />
          )}

          {/* Interactive Marker Knob */}
          {duration > 0 && (
            <g filter="url(#knobGlow)">
              <circle
                cx={knobX}
                cy={knobY}
                r={9}
                fill="#ffffff"
                className="transition-transform duration-75"
              />
              <circle
                cx={knobX}
                cy={knobY}
                r={4}
                fill="#38bdf8"
              />
            </g>
          )}

          {/* 12 o'clock start indicator dot */}
          <circle
            cx={center}
            cy={center - radius}
            r={2.5}
            fill={duration === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'}
          />
        </svg>

        {/* Center Text Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-white/40 text-xs tracking-widest uppercase font-mono mb-1">
            {duration === 0 ? 'Target Focus' : 'Duration'}
          </span>
          <div className="flex items-baseline justify-center gap-1">
            <span className="font-display text-5xl md:text-6xl text-white font-medium tracking-tight">
              {duration === 0 ? '0' : duration}
            </span>
            <span className="text-white/60 text-lg font-body">
              min
            </span>
          </div>
          {duration > 0 && (
            <span className="text-cyan-400/80 text-[11px] font-mono mt-1">
              {Math.floor(duration / 60) > 0 ? `${Math.floor(duration / 60)}h ${duration % 60}m` : 'Mission Time'}
            </span>
          )}
          {duration === 0 && (
            <span className="text-white/30 text-[11px] font-mono mt-1">
              Drag dial to set
            </span>
          )}
        </div>
      </div>

      {/* Quick Presets (15m, 25m, 45m, 60m, 90m) */}
      {interactive && (
        <div className="flex items-center gap-2 mt-4 z-20">
          {[15, 25, 45, 60, 90].map((preset) => (
            <button
              key={preset}
              onClick={() => onSelect(preset)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer ${
                duration === preset
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/20'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {preset}m
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
