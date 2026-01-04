"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { factsTicker } from "@/data/psychonautData";

export const KnowledgeTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % factsTicker.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black/80 border-y border-white/10 py-3 overflow-hidden backdrop-blur-md relative z-30">
      {/* Desktop Ticker (Horizontal Scroll) */}
      <div className="hidden md:block whitespace-nowrap relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-black to-transparent z-10" />
        
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="inline-flex gap-12 items-center"
        >
          {[...factsTicker, ...factsTicker, ...factsTicker].map((fact, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-white/70 uppercase tracking-widest">
                {fact}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Mobile Ticker (Vertical Fade) */}
      <div className="md:hidden h-4 flex items-center justify-center relative px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 text-center"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
            <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest leading-none">
              {factsTicker[currentIndex]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
