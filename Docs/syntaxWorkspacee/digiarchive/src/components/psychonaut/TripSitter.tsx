"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, X, HeartPulse } from "lucide-react";

export const TripSitter: React.FC = () => {
  const [panicMode, setPanicMode] = useState(false);

  const togglePanic = useCallback(() => {
    setPanicMode((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panicMode) {
        setPanicMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [panicMode]);

  return (
    <>
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePanic}
        className="fixed bottom-24 right-8 z-60 w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] group"
      >
        <HeartPulse className="w-6 h-6 text-white group-hover:animate-pulse" />
        <span className="absolute right-full mr-4 bg-black/80 backdrop-blur-md border border-white/10 text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          In Case of Panic
        </span>
      </motion.button>

      <AnimatePresence>
        {panicMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-70 bg-[#000510] flex items-center justify-center p-8 text-center"
          >
            {/* Background Breathing Gradient */}
            <motion.div
              animate={{
                background: [
                  "radial-gradient(circle, rgba(20, 40, 80, 0.4) 0%, #000510 100%)",
                  "radial-gradient(circle, rgba(20, 100, 120, 0.4) 0%, #000510 100%)",
                  "radial-gradient(circle, rgba(20, 40, 80, 0.4) 0%, #000510 100%)",
                ],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0"
            />

            <div className="relative z-10 space-y-12 max-w-xl flex flex-col items-center">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-blue-100">
                  You are safe.
                </h2>
                <p className="text-xl text-blue-300 font-serif italic">
                  "This is temporary. Just breathe."
                </p>
              </div>

              {/* Breathing Guide */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 2, 2, 1] }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    times: [0, 0.33, 0.66, 1],
                    ease: "easeInOut",
                  }}
                  className="w-32 h-32 rounded-full border-2 border-blue-400/30 bg-blue-500/10 backdrop-blur-xl"
                />
                <motion.div
                  className="absolute text-blue-200 font-mono text-xs uppercase tracking-widest"
                  animate={{
                    opacity: [1, 0, 1],
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    times: [0, 0.5, 1],
                  }}
                >
                  <BreathingText />
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setPanicMode(false)}
                className="px-8 py-3 rounded-full border border-white/20 text-white/50 hover:text-white hover:border-white transition-all text-xs uppercase tracking-widest flex items-center gap-2 group"
              >
                <X className="w-4 h-4" />
                Return to Dashboard
              </motion.button>
              
              <p className="text-[10px] text-white/20 font-mono uppercase tracking-[0.2em]">
                Press ESC to exit
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const BreathingText = () => {
  const [text, setText] = useState("Inhale");

  useEffect(() => {
    const sequence = [
      { text: "Inhale", duration: 4000 },
      { text: "Hold", duration: 4000 },
      { text: "Exhale", duration: 4000 },
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % sequence.length;
      setText(sequence[i].text);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return <span>{text}</span>;
};
