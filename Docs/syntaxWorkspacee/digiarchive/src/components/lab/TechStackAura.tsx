'use client';

import { motion } from 'framer-motion';

const tools = [
  { name: "Next.js", frequency: 0.95, color: "#ffffff" },
  { name: "AI/LLM", frequency: 0.85, color: "#818cf8" },
  { name: "TypeScript", frequency: 0.9, color: "#3178c6" },
  { name: "Supabase", frequency: 0.75, color: "#3ecf8e" },
  { name: "Tailwind", frequency: 0.8, color: "#38bdf8" },
  { name: "Framer", frequency: 0.7, color: "#f472b6" },
];

export function TechStackAura() {
  return (
    <div className="relative w-full aspect-square max-w-md mx-auto flex items-center justify-center">
      {/* Background Aura Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ 
              rotate: { duration: 20 + i * 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 5 + i * 2, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 5 + i * 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute border border-white/5 rounded-full"
            style={{ width: `${60 + i * 20}%`, height: `${60 + i * 20}%` }}
          />
        ))}
      </div>

      {/* Tools Constellation */}
      <div className="relative w-full h-full">
        {tools.map((tool, i) => {
          const angle = (i * (360 / tools.length) * Math.PI) / 180;
          const distance = 40 + (1 - tool.frequency) * 20; // Core frequency distance
          const x = 50 + distance * Math.cos(angle);
          const y = 50 + distance * Math.sin(angle);

          return (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="absolute group"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative">
                {/* Glow */}
                <div 
                  className="absolute inset-0 blur-xl opacity-20 group-hover:opacity-60 transition-opacity rounded-full"
                  style={{ backgroundColor: tool.color }}
                />
                
                {/* Star */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, delay: i, repeat: Infinity }}
                  className="w-2 h-2 rounded-full relative z-10"
                  style={{ backgroundColor: tool.color }}
                />

                {/* Label */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                   <span className="text-[10px] font-mono font-bold text-neutral-500 group-hover:text-white transition-colors tracking-tighter uppercase">
                     {tool.name}
                   </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Central Core */}
      <div className="absolute w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-3xl shadow-2xl">
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-neutral-700 uppercase tracking-widest text-center w-full">
         Tech Stack Constellation • Aura Field Active
      </div>
    </div>
  );
}
