import React, { useState } from 'react';
import { Youtube, Play, X, ExternalLink, Sparkles } from 'lucide-react';

interface YouTubePlayerProps {
  videoId: string | null;
  onSelectVideoId: (id: string | null) => void;
}

const PRESET_STREAMS = [
  {
    title: 'Lofi Girl — Beats to relax/study to',
    id: 'jfKfPfyJRdk',
    tag: 'Lo-Fi Chill',
  },
  {
    title: 'Space Ambient Music for Deep Focus',
    id: 'S_MOd40tx54',
    tag: 'Space Drone',
  },
  {
    title: 'Interstellar Focus Soundscape',
    id: 'tNkZsRW7h2c',
    tag: 'Cinematic',
  },
];

export default function YouTubePlayer({ videoId, onSelectVideoId }: YouTubePlayerProps) {
  const [customUrl, setCustomUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleLoadCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!customUrl.trim()) return;

    const id = extractYouTubeId(customUrl.trim());
    if (id) {
      onSelectVideoId(id);
      setCustomUrl('');
    } else {
      setError('Please paste a valid YouTube URL (e.g., https://youtube.com/watch?v=...)');
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between text-white/50 text-[11px] pb-1 border-b border-white/10">
        <span className="flex items-center gap-1.5">
          <Youtube className="w-3.5 h-3.5 text-red-400" />
          YOUTUBE CENTERPIECE
        </span>
        {videoId && (
          <button
            onClick={() => onSelectVideoId(null)}
            className="text-white/60 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>CLEAR</span>
          </button>
        )}
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-col gap-1.5">
        <span className="text-white/40 text-[10px]">CURATED STUDY STREAMS:</span>
        {PRESET_STREAMS.map((stream) => (
          <button
            key={stream.id}
            onClick={() => onSelectVideoId(stream.id)}
            className={`p-2 rounded-xl text-left transition flex items-center justify-between cursor-pointer ${
              videoId === stream.id
                ? 'bg-red-500/20 border border-red-400/40 text-white'
                : 'bg-white/5 border border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="truncate pr-2">{stream.title}</span>
            <span className="text-[10px] text-white/40 font-mono shrink-0">
              {stream.tag}
            </span>
          </button>
        ))}
      </div>

      {/* Custom URL Input Form */}
      <form onSubmit={handleLoadCustomUrl} className="mt-1 flex flex-col gap-1.5">
        <span className="text-white/40 text-[10px]">OR PASTE ANY YOUTUBE LINK:</span>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 text-[11px] outline-none focus:border-red-400/40"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-medium text-[11px] transition cursor-pointer"
          >
            Load
          </button>
        </div>
        {error && <p className="text-rose-400 text-[10px] mt-0.5">{error}</p>}
      </form>
    </div>
  );
}

