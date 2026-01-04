'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';

interface Perspective {
  title: string;
  subtitle: string;
  points: string[];
}

const statusQuo: Perspective = {
  title: "The Status Quo",
  subtitle: "Colonial & Societal Programming",
  points: [
    "Productivity defined by labor hours",
    "Individualistic success metrics",
    "Hierarchical power structures",
    "Devaluation of indigenous knowledge"
  ]
};

const unlearned: Perspective = {
  title: "The Unlearned View",
  subtitle: "Indigenous & Critical Thought",
  points: [
    "Productivity defined by energy & rhythm",
    "Communal and generational health",
    "Horizontal, decentralized networks",
    "Revival of ancestral wisdom"
  ]
};

export function ParadigmShifter() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(50);
  const springX = useSpring(x, { stiffness: 400, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((clientX - rect.left) / rect.width) * 100;
    const boundedPos = Math.max(0, Math.min(100, position));
    setSliderPos(boundedPos);
    x.set(boundedPos);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      className="relative w-full aspect-video md:aspect-21/9 rounded-3xl overflow-hidden border border-white/10 group cursor-ew-resize bg-neutral-900"
    >
      {/* Left Side: Status Quo */}
      <div 
        className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center p-8 md:p-12 text-center"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <div className="max-w-md">
          <Lock className="w-12 h-12 text-neutral-500 mb-6 mx-auto" />
          <h3 className="text-2xl md:text-3xl font-bold text-neutral-400 mb-2">{statusQuo.title}</h3>
          <p className="text-neutral-600 font-mono text-xs uppercase tracking-widest mb-8">{statusQuo.subtitle}</p>
          <ul className="space-y-3 text-neutral-500 text-sm md:text-base">
            {statusQuo.points.map((p, i) => (
              <li key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side: Unlearned Perspective */}
      <div 
        className="absolute inset-0 bg-yellow-500/5 flex flex-col items-center justify-center p-8 md:p-12 text-center"
        style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
      >
        <div className="max-w-md">
          <div className="relative mb-6 mx-auto w-12 h-12">
            <Unlock className="w-12 h-12 text-yellow-500" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-yellow-500 blur-xl rounded-full"
            />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-yellow-100 mb-2">{unlearned.title}</h3>
          <p className="text-yellow-500/70 font-mono text-xs uppercase tracking-widest mb-8">{unlearned.subtitle}</p>
          <ul className="space-y-3 text-neutral-300 text-sm md:text-base">
            {unlearned.points.map((p, i) => (
              <li key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Slider Handle */}
      <motion.div 
        style={{ left: `${sliderPos}%` }}
        className="absolute top-0 bottom-0 w-1 bg-yellow-500 z-10"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-yellow-500 border-4 border-neutral-900 shadow-xl flex items-center justify-center">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-neutral-900 rounded-full" />
            <div className="w-0.5 h-4 bg-neutral-900 rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/5 pointer-events-none group-hover:opacity-0 transition-opacity">
        Slide to shift paradigms
      </div>
    </div>
  );
}
