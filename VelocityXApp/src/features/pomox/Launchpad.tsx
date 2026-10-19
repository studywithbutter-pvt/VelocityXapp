export default function Launchpad() {
  return (
    <div className="relative h-screen w-full bg-[#0a0f1a] overflow-hidden flex flex-col items-center justify-center">
      <h1 className="font-display text-6xl text-white mb-4">Velocity</h1>
      <div className="text-white/70 mb-8">Ready for your next mission?</div>
      <button className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur">Launch Mission</button>
    </div>
  );
}
