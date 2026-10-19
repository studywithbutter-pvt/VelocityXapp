import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/globals.css';
import './components/liquid-glass.css';

import {
  Rocket,
  MissionRecord,
  UserStats,
  ActiveSession,
  Subject,
  ViewMode,
  MainTab,
} from './types';

import {
  getSavedStats,
  saveStats,
  getSavedMissions,
  saveMission,
  getSavedRockets,
  saveRockets,
  getSelectedRocketId,
  saveSelectedRocketId,
  getActiveSession,
  saveActiveSession,
} from './services/storageService';

import { audioEngine } from './services/audioEngine';

import BottomNav from './components/navigation/BottomNav';
import HeaderMenu from './components/navigation/HeaderMenu';
import LaunchpadView from './components/launchpad/LaunchpadView';
import FlightView from './components/mission/FlightView';
import MissionSuccessModal from './components/mission/MissionSuccessModal';
import RocketSelectorModal from './components/launchpad/RocketSelectorModal';
import ZenMode from './components/zen/ZenMode';
import RocketXField from './components/rocketx/RocketXField';
import RocketStore from './components/store/RocketStore';
import InsightsView from './components/insights/InsightsView';
import PrismView from './components/prism/PrismView';

export default function App() {
  // Navigation State
  const [mainTab, setMainTab] = useState<MainTab>('velocity');
  const [activeView, setActiveView] = useState<ViewMode>('pomox');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // App Data State
  const [stats, setStats] = useState<UserStats>(getSavedStats);
  const [missions, setMissions] = useState<MissionRecord[]>(getSavedMissions);
  const [rockets, setRockets] = useState<Rocket[]>(getSavedRockets);
  const [selectedRocketId, setSelectedRocketId] = useState<string>(getSelectedRocketId);

  // Launchpad Setup State
  const [duration, setDuration] = useState<number>(25); // default 25 min Pomodoro
  const [subject, setSubject] = useState<Subject>('Physics');
  const [missionTitle, setMissionTitle] = useState<string>('Orbital Deep Work #1');

  // Active Session & Flight State
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(getActiveSession);
  const [isRocketSelectorOpen, setIsRocketSelectorOpen] = useState(false);
  const [isZenModeOpen, setIsZenModeOpen] = useState(false);
  const [completedMission, setCompletedMission] = useState<MissionRecord | null>(null);

  const selectedRocket =
    rockets.find((r) => r.id === selectedRocketId) || rockets[0];

  // Monotonic timer loop using requestAnimationFrame + Date.now()
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!activeSession || activeSession.status !== 'flying' || activeSession.isPaused) {
      return;
    }

    lastTickRef.current = Date.now();
    const interval = window.setInterval(() => {
      const now = Date.now();
      const deltaSec = Math.floor((now - lastTickRef.current) / 1000);

      if (deltaSec >= 1) {
        lastTickRef.current = now;
        setActiveSession((prev) => {
          if (!prev) return null;
          const newElapsed = prev.elapsedSeconds + deltaSec;
          const totalSec = prev.targetDuration * 60;

          if (newElapsed >= totalSec) {
            // Mission automatically completed
            window.setTimeout(() => handleCompleteMission(), 100);
          }

          const updated: ActiveSession = {
            ...prev,
            elapsedSeconds: newElapsed,
          };
          saveActiveSession(updated);
          return updated;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession?.status, activeSession?.isPaused]);

  // Launch Mission Handlers
  const handleLaunchMission = () => {
    if (duration <= 0) return;
    audioEngine.ensureContext();

    const newSession: ActiveSession = {
      rocketId: selectedRocket.id,
      subject,
      title: missionTitle || 'Orbital Focus',
      targetDuration: duration,
      elapsedSeconds: 0,
      startTimestamp: Date.now(),
      isPaused: false,
      status: 'launching',
    };

    setActiveSession(newSession);
    saveActiveSession(newSession);

    // Transition from launching to flying after liftoff animation
    window.setTimeout(() => {
      setActiveSession((prev) => {
        if (!prev) return null;
        const flying: ActiveSession = { ...prev, status: 'flying' };
        saveActiveSession(flying);
        return flying;
      });
    }, 2500);
  };

  const handlePauseMission = () => {
    setActiveSession((prev) => {
      if (!prev) return null;
      const updated = { ...prev, isPaused: true, status: 'paused' as const };
      saveActiveSession(updated);
      return updated;
    });
  };

  const handleResumeMission = () => {
    lastTickRef.current = Date.now();
    setActiveSession((prev) => {
      if (!prev) return null;
      const updated = { ...prev, isPaused: false, status: 'flying' as const };
      saveActiveSession(updated);
      return updated;
    });
  };

  const handleForfeitMission = () => {
    if (!activeSession) return;
    audioEngine.playCrashSound();

    const actualMins = Math.max(1, Math.round(activeSession.elapsedSeconds / 60));
    const gridX = Math.floor(Math.random() * 16);
    const gridY = Math.floor(Math.random() * 16);

    const forfeitedRecord: MissionRecord = {
      id: `m_${Date.now()}`,
      rocketId: activeSession.rocketId,
      rocketName: selectedRocket.name,
      subject: activeSession.subject,
      title: activeSession.title,
      targetDuration: activeSession.targetDuration,
      actualDuration: actualMins,
      outcome: 'forfeited',
      timestamp: Date.now(),
      gridX,
      gridY,
      coinsEarned: 0,
    };

    saveMission(forfeitedRecord);
    setMissions(getSavedMissions());

    const updatedStats: UserStats = {
      ...stats,
      forfeitedMissions: stats.forfeitedMissions + 1,
    };
    saveStats(updatedStats);
    setStats(updatedStats);

    setActiveSession(null);
    saveActiveSession(null);
    setIsZenModeOpen(false);
  };

  const handleCompleteMission = () => {
    if (!activeSession) return;

    const actualMins = Math.max(
      1,
      Math.round(activeSession.elapsedSeconds / 60) || activeSession.targetDuration
    );

    // Economy calculation from prompt:
    // Qualifying 15+ min session earns coins
    let coinsEarned = 15;
    if (actualMins >= 25) coinsEarned = 25;
    if (actualMins >= 45) coinsEarned = 50;
    if (actualMins >= 90) coinsEarned = 120;

    const gridX = Math.floor(Math.random() * 16);
    const gridY = Math.floor(Math.random() * 16);

    const successRecord: MissionRecord = {
      id: `m_${Date.now()}`,
      rocketId: activeSession.rocketId,
      rocketName: selectedRocket.name,
      subject: activeSession.subject,
      title: activeSession.title,
      targetDuration: activeSession.targetDuration,
      actualDuration: actualMins,
      outcome: 'success',
      timestamp: Date.now(),
      gridX,
      gridY,
      coinsEarned,
    };

    saveMission(successRecord);
    setMissions(getSavedMissions());

    const updatedStats: UserStats = {
      ...stats,
      coins: stats.coins + coinsEarned,
      totalFocusMinutes: stats.totalFocusMinutes + actualMins,
      completedMissions: stats.completedMissions + 1,
      streakDays: Math.max(stats.streakDays, 1),
    };
    saveStats(updatedStats);
    setStats(updatedStats);

    setActiveSession(null);
    saveActiveSession(null);
    setIsZenModeOpen(false);
    setCompletedMission(successRecord);
  };

  // Rocket Inventory & Store Handlers
  const handleSelectRocket = (id: string) => {
    setSelectedRocketId(id);
    saveSelectedRocketId(id);
  };

  const handleBuyRocket = (rocketId: string) => {
    const rocket = rockets.find((r) => r.id === rocketId);
    if (!rocket || stats.coins < rocket.price) return;

    const updatedStats = { ...stats, coins: stats.coins - rocket.price };
    saveStats(updatedStats);
    setStats(updatedStats);

    const updatedRockets = rockets.map((r) =>
      r.id === rocketId ? { ...r, unlocked: true } : r
    );
    saveRockets(updatedRockets);
    setRockets(updatedRockets);
    handleSelectRocket(rocketId);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#070b14] text-white overflow-x-hidden font-body selection:bg-cyan-500/30">
      {/* Fullscreen Video Background with fallback */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 z-0 h-full w-full object-cover opacity-60 pointer-events-none"
        src="/launchpad.mp4"
        onError={(e) => {
          // Fallback to CloudFront URL if local asset fails
          const target = e.currentTarget;
          if (!target.src.includes('cloudfront.net')) {
            target.src =
              'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';
          }
        }}
      />

      {/* Subtle Atmospheric Gradient Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#070b14]/50 via-transparent to-[#070b14]/80" />

      {/* Header Menu & Currency Bar (Top Left Menu Drawer from Sketch 1) */}
      <HeaderMenu
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen(!isMenuOpen)}
        activeView={activeView}
        onSelectView={(view) => {
          setActiveView(view);
          setMainTab('velocity');
        }}
        coins={stats.coins}
      />

      {/* Main Content Area */}
      <main className="relative z-10 w-full min-h-screen">
        {mainTab === 'prism' ? (
          <PrismView />
        ) : activeView === 'rocketx' ? (
          <RocketXField
            missions={missions}
            onClose={() => setActiveView('pomox')}
          />
        ) : activeView === 'store' ? (
          <RocketStore
            rockets={rockets}
            coins={stats.coins}
            selectedRocketId={selectedRocketId}
            onBuyRocket={handleBuyRocket}
            onEquipRocket={(id) => {
              handleSelectRocket(id);
              setActiveView('pomox');
            }}
            onClose={() => setActiveView('pomox')}
          />
        ) : activeView === 'insights' ? (
          <InsightsView
            stats={stats}
            missions={missions}
            onClose={() => setActiveView('pomox')}
          />
        ) : activeSession ? (
          /* Active Flight / Mission Screen */
          <FlightView
            session={activeSession}
            rocket={selectedRocket}
            onPause={handlePauseMission}
            onResume={handleResumeMission}
            onForfeit={handleForfeitMission}
            onComplete={handleCompleteMission}
            onOpenZenMode={() => setIsZenModeOpen(true)}
          />
        ) : (
          /* PomoX Launchpad (Sketch 1 layout) */
          <LaunchpadView
            duration={duration}
            onSelectDuration={(d) => setDuration(d)}
            selectedRocket={selectedRocket}
            onOpenRocketSelector={() => setIsRocketSelectorOpen(true)}
            onOpenZenMode={() => setIsZenModeOpen(true)}
            onLaunchMission={handleLaunchMission}
            subject={subject}
            onChangeSubject={(s) => setSubject(s)}
            missionTitle={missionTitle}
            onChangeMissionTitle={(t) => setMissionTitle(t)}
          />
        )}
      </main>

      {/* Bottom Navigation (Velocity | Prism) */}
      <BottomNav
        activeTab={mainTab}
        onSelectTab={(tab) => {
          setMainTab(tab);
          if (tab === 'velocity') {
            setActiveView('pomox');
          }
        }}
      />

      {/* Fleet / Rocket Selector Modal */}
      <RocketSelectorModal
        isOpen={isRocketSelectorOpen}
        onClose={() => setIsRocketSelectorOpen(false)}
        rockets={rockets}
        selectedRocketId={selectedRocketId}
        onSelectRocket={(id) => {
          handleSelectRocket(id);
          setIsRocketSelectorOpen(false);
        }}
        coins={stats.coins}
        onOpenStore={() => {
          setIsRocketSelectorOpen(false);
          setActiveView('store');
        }}
      />

      {/* Zen Mode (Singularity Black Hole Focus Container from Sketch 2 & 3) */}
      <ZenMode
        isOpen={isZenModeOpen}
        onClose={() => setIsZenModeOpen(false)}
        session={activeSession}
        onPause={handlePauseMission}
        onResume={handleResumeMission}
        duration={duration}
      />

      {/* Mission Success Celebration Dialog */}
      <MissionSuccessModal
        mission={completedMission}
        onClose={() => setCompletedMission(null)}
        onViewRocketX={() => {
          setCompletedMission(null);
          setActiveView('rocketx');
        }}
      />
    </div>
  );
}
