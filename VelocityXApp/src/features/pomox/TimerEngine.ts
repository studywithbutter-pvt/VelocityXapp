export type SessionState = 'ready' | 'running' | 'paused' | 'completed' | 'forfeited';
export interface Session { id: string; duration: number; actualFocused: number; state: SessionState; title?: string; subject?: string; rocket?: string; startedAt?: number; pausedAt?: number; completedAt?: number; }
export function startSession(durationMin: number): Session {
  return { id: crypto.randomUUID(), duration: durationMin, actualFocused: 0, state: 'running', startedAt: Date.now() };
}
export function getRemaining(s: Session): number {
  if (s.state !== 'running') return 0;
  const elapsed = Math.floor((Date.now() - (s.startedAt||0)) / 60000);
  return Math.max(0, s.duration - elapsed);
}
