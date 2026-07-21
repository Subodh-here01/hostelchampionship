import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INTRO_STEPS = [
  { id: 0, text: '10 TEAMS', subtitle: 'REPRESENTING EVERY BLOCK', color: 'text-accent' },
  { id: 1, text: '6 SPORTS', subtitle: 'CRICKET | TT | BADMINTON | CHESS | CARROM | BGMI', color: 'text-accent-red' },
  { id: 2, text: '1 COVETED TROPHY', subtitle: 'WHO WILL SEIZE GLORY?', color: 'text-accent' },
  { id: 3, text: 'MSRIT', subtitle: 'HOSTEL CHAMPIONSHIP 2026', color: 'text-text-bright' }
];

const AUDIO_URL = '/intro_theme.wav';

const IntroLoader = ({ onComplete }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [step, setStep] = useState(0);
  const audioRef = useRef(null);

  // 1. Pre-instantiate audio object safely
  useEffect(() => {
    audioRef.current = new Audio(AUDIO_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.55;

    return () => {
      // Cleanup: Stop audio immediately
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 2. Play and cycle phases once clicked
  useEffect(() => {
    if (!hasStarted) return;

    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted) {
        audioRef.current.play().catch((err) => {
          console.warn('Browser blocked autoplay sound despite user click handler:', err);
        });
      }
    }

    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= INTRO_STEPS.length - 1) {
          clearInterval(timer);
          setTimeout(() => {
            handleExit();
          }, 1800);
          return prev;
        }
        return prev + 1;
      });
    }, 1850);

    return () => clearInterval(timer);
  }, [hasStarted]);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (audioRef.current) {
        audioRef.current.muted = nextMuted;
        if (!nextMuted) {
          audioRef.current.play().catch((err) => console.warn(err));
        }
      }
      return nextMuted;
    });
  };

  const handleExit = () => {
    // Fade out audio smoothly if not muted
    if (audioRef.current && !isMuted) {
      let vol = audioRef.current.volume;
      const fadeInterval = setInterval(() => {
        if (vol > 0.05) {
          vol -= 0.05;
          audioRef.current.volume = Math.max(0, vol);
        } else {
          clearInterval(fadeInterval);
          if (audioRef.current) {
            audioRef.current.pause();
          }
          onComplete();
        }
      }, 50);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      onComplete();
    }
  };

  const startWithSound = () => {
    setIsMuted(false);
    setHasStarted(true);
  };

  const startSilent = () => {
    setIsMuted(true);
    setHasStarted(true);
  };

  // Entrance screen bypasses browser autoplay block
  if (!hasStarted) {
    return (
      <div className="fixed inset-0 bg-[#060608] z-[99999] flex flex-col items-center justify-center overflow-hidden font-display select-none">
        
        {/* Ambient background glows */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[300px] h-[300px] rounded-full border border-accent/20 animate-ping duration-10000"></div>
          <div className="w-[500px] h-[500px] rounded-full border border-accent-red/10 absolute animate-pulse"></div>
        </div>

        {/* Retro Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e15_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        <div className="relative z-10 text-center px-4 flex flex-col items-center gap-6">
          <span className="font-display font-extrabold uppercase tracking-[6px] text-accent text-xs md:text-sm border-b border-accent/20 pb-2">
            MSRIT HOSTEL SPORTS COUNCIL
          </span>
          <h1 className="font-display text-4xl md:text-7xl font-black uppercase tracking-wider text-text-bright leading-none mt-2">
            UNLEASH THE<br />
            <span className="bg-gradient-to-r from-accent to-accent-red bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(232,197,71,0.25)]">
              CHAMPIONSHIP
            </span>
          </h1>
          <p className="text-text-muted text-xs md:text-sm max-w-md tracking-wider uppercase leading-relaxed mt-1">
            10 teams compete in 6 sports for 1 trophy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md justify-center">
            {/* Enter with Sound */}
            <button
              onClick={startWithSound}
              className="group relative bg-accent hover:bg-accent/90 text-text-bright font-display font-black uppercase text-xs md:text-sm tracking-[2px] px-8 py-3.5 rounded shadow-2xl shadow-accent/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 overflow-hidden border border-accent-red/30"
            >
              <span className="relative z-10 flex items-center gap-2">
                <i className="fa-solid fa-volume-high text-xs animate-pulse"></i> Enter with Sound
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-red to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Enter Silent */}
            <button
              onClick={startSilent}
              className="bg-card hover:bg-muted text-text-bright border border-border font-display font-bold uppercase text-xs md:text-sm tracking-[2px] px-8 py-3.5 rounded transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-volume-xmark text-xs text-text-muted"></i> Enter Silent
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 w-full text-center">
          <span className="text-[9px] text-text-muted/40 uppercase tracking-[6px] font-bold">
            CHOOSE TO ENLIST IN THE ARENA
          </span>
        </div>

      </div>
    );
  }

  const current = INTRO_STEPS[step];

  return (
    <div className="fixed inset-0 bg-[#060608] z-[99999] flex flex-col items-center justify-center overflow-hidden font-display select-none">
      
      {/* Background glow effects */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[300px] h-[300px] rounded-full border border-accent/20 animate-ping duration-10000"></div>
        <div className="w-[500px] h-[500px] rounded-full border border-accent-red/10 absolute animate-pulse"></div>
      </div>

      {/* Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e15_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Live Mute/Unmute Speaker Icon (Top-Left) */}
      <button 
        onClick={toggleMute}
        className="absolute top-6 left-6 border border-border/60 text-text-muted hover:text-text-bright hover:border-accent text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-all duration-200 z-[100] flex items-center gap-2"
        title={isMuted ? "Unmute sound" : "Mute sound"}
      >
        <i className={`fa-solid ${isMuted ? 'fa-volume-xmark text-accent-red' : 'fa-volume-high text-accent'}`}></i>
        <span>{isMuted ? 'Unmute' : 'Mute'}</span>
      </button>

      {/* Skip button triggers fading exit */}
      <button 
        onClick={handleExit}
        className="absolute top-6 right-6 border border-border/60 text-text-muted hover:text-text-bright hover:border-accent text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-all duration-200 z-[100]"
      >
        Skip Intro
      </button>

      {/* Steps text animation */}
      <div className="relative z-10 text-center px-4 w-full max-w-4xl min-h-[220px] flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -15 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center"
          >
            
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[5px] text-accent/50 mb-3 bg-accent/5 border border-accent/15 px-3 py-0.5 rounded-sm">
              PHASE {step + 1} OF 4
            </span>

            <h1 className={`font-score text-5xl md:text-8xl font-black uppercase tracking-tight ${current.color} drop-shadow-[0_0_35px_rgba(232,197,71,0.25)] select-none`}>
              {current.text}
            </h1>

            <p className="font-display font-semibold text-text-muted text-xs md:text-base tracking-[3px] uppercase mt-4 max-w-2xl leading-relaxed">
              {current.subtitle}
            </p>

          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-10 left-0 w-full text-center">
        <span className="text-[9px] text-text-muted/40 uppercase tracking-[6px] font-bold">
          ORGANIZED BY TEAM ELITE &bull; EST. 2026
        </span>
      </div>

    </div>
  );
};

export default IntroLoader;
