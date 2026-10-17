import { motion } from 'framer-motion';
export default function App() {
  return (
    <div className="relative h-screen w-full bg-[#0a0f1a] text-white overflow-hidden font-body">
      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
      />
      <main className="relative z-10 h-full flex flex-col items-center justify-center p-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="font-display text-6xl md:text-8xl tracking-tight mb-8"
        >
          Velocity
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-white/70 text-lg mb-12"
        >
          Focus like a mission
        </motion.p>
        <nav className="fixed bottom-0 left-0 right-0 p-4 flex justify-center gap-12 bg-white/[0.02] backdrop-blur-md border-t border-white/10 z-20">
          <a href="#" className="text-white font-medium tracking-wide hover:text-cyan-300 transition">Velocity</a>
          <a href="#" className="text-white/40 font-medium tracking-wide">Prism</a>
        </nav>
      </main>
    </div>
  );
}
``