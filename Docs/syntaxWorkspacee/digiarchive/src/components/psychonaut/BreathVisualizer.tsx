'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';

export function BreathVisualizer() {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Pause');
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (phase === 'Inhale' && timer > 4) {
      setPhase('Hold');
      setTimer(1);
    } else if (phase === 'Hold' && timer > 7) {
      setPhase('Exhale');
      setTimer(1);
    } else if (phase === 'Exhale' && timer > 8) {
      setPhase('Inhale');
      setTimer(1);
    }
  }, [timer, phase]);

  const toggleBreathing = () => {
    if (!isActive) {
      setPhase('Inhale');
      setTimer(1);
    }
    setIsActive(!isActive);
  };

  const resetBreathing = () => {
    setIsActive(false);
    setPhase('Pause');
    setTimer(0);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-12">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border border-green-500/20" />
        
        {/* Pulse Ring */}
        <AnimatePresence>
          {isActive && (
            <motion.div 
              key={phase}
              initial={{ scale: phase === 'Inhale' ? 0.8 : 1.2, opacity: 0 }}
              animate={{ 
                scale: phase === 'Inhale' ? 1.2 : phase === 'Exhale' ? 0.8 : phase === 'Hold' ? 1.2 : 1,
                opacity: 0.1
              }}
              transition={{ 
                duration: phase === 'Inhale' ? 4 : phase === 'Exhale' ? 8 : phase === 'Hold' ? 7 : 1,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full bg-green-500 blur-2xl"
            />
          )}
        </AnimatePresence>

        {/* Core Circle */}
        <motion.div 
          animate={{ 
            scale: phase === 'Inhale' ? [1, 1.5] : phase === 'Exhale' ? [1.5, 1] : phase === 'Hold' ? 1.5 : 1,
          }}
          transition={{ 
            duration: phase === 'Inhale' ? 4 : phase === 'Exhale' ? 8 : phase === 'Hold' ? 7 : 0.5,
            ease: "easeInOut"
          }}
          className="w-32 h-32 rounded-full bg-linear-to-br from-green-400 to-green-600 shadow-[0_0_50px_rgba(74,222,128,0.3)] flex items-center justify-center z-10"
        >
          <Wind className="w-10 h-10 text-green-950" />
        </motion.div>

        {/* Phase Text */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center w-full">
          <motion.div 
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-display font-bold text-green-100"
          >
            {phase === 'Pause' ? 'Ready to ground?' : phase}
          </motion.div>
          <AnimatePresence>
            {isActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-green-500/50 font-mono text-sm mt-1"
              >
                {timer}s
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleBreathing}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 text-green-950 font-bold hover:bg-green-400 transition-all active:scale-95"
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          {isActive ? 'Pause' : 'Start 4-7-8'}
        </button>
        <button 
          onClick={resetBreathing}
          className="p-3 rounded-full bg-white/5 text-green-500 hover:bg-white/10 transition-all border border-green-500/20"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <p className="max-w-xs text-center text-xs text-neutral-500 leading-relaxed font-mono uppercase tracking-tighter">
        Inhale 4s • Hold 7s • Exhale 8s<br/>Focus on the rhythm to ground your consciousness.
      </p>
    </div>
  );
}
