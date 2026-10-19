import React, { useState } from 'react';
import { CloudRain, CloudLightning, Compass, Music, Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

export default function AmbientMixer() {
  const [volumes, setVolumes] = useState({
    rain: 0,
    space: 0.3,
    thunder: 0,
    lofi: 0,
  });

  const [isMuted, setIsMuted] = useState(false);

  const handleSliderChange = (channel: 'rain' | 'space' | 'thunder' | 'lofi', val: number) => {
    audioEngine.ensureContext();
    const newVolumes = { ...volumes, [channel]: val };
    setVolumes(newVolumes);
    if (!isMuted) {
      audioEngine.setVolume(channel, val);
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (nextMute) {
      audioEngine.setVolume('master', 0);
    } else {
      audioEngine.setVolume('master', 0.8);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 font-mono text-xs">
      <div className="flex items-center justify-between text-white/50 text-[11px] pb-1 border-b border-white/10">
        <span>AMBIENT SOUNDSCAPES</span>
        <button
          onClick={toggleMute}
          className="text-white/70 hover:text-white transition cursor-pointer flex items-center gap-1"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{isMuted ? 'UNMUTE' : 'MUTE'}</span>
        </button>
      </div>

      {/* Rain Slider */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-white/70 w-24">
          <CloudRain className="w-3.5 h-3.5 text-blue-400" />
          <span>Rain</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volumes.rain}
          onChange={(e) => handleSliderChange('rain', parseFloat(e.target.value))}
          className="flex-1 accent-cyan-400 cursor-pointer h-1 rounded-lg bg-white/10"
        />
        <span className="text-white/40 text-[10px] w-7 text-right">
          {Math.round(volumes.rain * 100)}%
        </span>
      </div>

      {/* Deep Space Drone Slider */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-white/70 w-24">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span>Space</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volumes.space}
          onChange={(e) => handleSliderChange('space', parseFloat(e.target.value))}
          className="flex-1 accent-indigo-400 cursor-pointer h-1 rounded-lg bg-white/10"
        />
        <span className="text-white/40 text-[10px] w-7 text-right">
          {Math.round(volumes.space * 100)}%
        </span>
      </div>

      {/* Thunder Slider */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-white/70 w-24">
          <CloudLightning className="w-3.5 h-3.5 text-purple-400" />
          <span>Thunder</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volumes.thunder}
          onChange={(e) => handleSliderChange('thunder', parseFloat(e.target.value))}
          className="flex-1 accent-purple-400 cursor-pointer h-1 rounded-lg bg-white/10"
        />
        <span className="text-white/40 text-[10px] w-7 text-right">
          {Math.round(volumes.thunder * 100)}%
        </span>
      </div>

      {/* Lo-Fi Chords Slider */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-white/70 w-24">
          <Music className="w-3.5 h-3.5 text-amber-400" />
          <span>Lo-Fi</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volumes.lofi}
          onChange={(e) => handleSliderChange('lofi', parseFloat(e.target.value))}
          className="flex-1 accent-amber-400 cursor-pointer h-1 rounded-lg bg-white/10"
        />
        <span className="text-white/40 text-[10px] w-7 text-right">
          {Math.round(volumes.lofi * 100)}%
        </span>
      </div>
    </div>
  );
}

