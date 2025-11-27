'use client';

import { motion } from 'framer-motion';

export function Logo() {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center group">
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-thunder-yellow drop-shadow-[0_0_8px_rgba(255,200,0,0.5)]"
      >
        {/* Main Stroke Path */}
        <motion.path
          d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 3
          }}
        />
        
        {/* Fill Pulse */}
        <motion.path
          d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
          fill="currentColor"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 0.2,
            times: [0, 0.1, 1],
            repeat: Infinity,
            repeatDelay: 4.3
          }}
        />

        {/* Secondary "Glitch" Stroke (Lagging) */}
        <motion.path
          d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
          transition={{
            duration: 1.6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 3,
            delay: 0.1 // Slight lag
          }}
          className="mix-blend-overlay"
        />
      </motion.svg>
      
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-thunder-yellow/20 blur-xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-thunder-yellow/10 blur-2xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 animate-pulse-slow" />
    </div>
  );
}
