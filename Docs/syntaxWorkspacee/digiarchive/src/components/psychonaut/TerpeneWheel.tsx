"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { terpenes, Terpene } from "@/data/psychonautData";
import { cn } from "@/lib/utils";

export const TerpeneWheel: React.FC = () => {
  const [selected, setSelected] = useState<Terpene>(terpenes[0]);
  const [rotation, setRotation] = useState(0);
  const [radius, setRadius] = useState(220);
  const [centerSize, setCenterSize] = useState(48); // in rem units * 4 (e.g. w-48)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRadius(120);
        setCenterSize(32);
      } else if (window.innerWidth < 1024) {
        setRadius(180);
        setCenterSize(40);
      } else {
        setRadius(220);
        setCenterSize(48);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelect = (index: number) => {
    setSelected(terpenes[index]);
    setRotation(index * (360 / terpenes.length));
  };

  return (
    <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 border border-white/5 rounded-full scale-[0.95]" />
      <div className="absolute inset-0 border border-white/5 rounded-full scale-[0.7]" />
      <div className="absolute inset-0 border border-white/5 rounded-full scale-[0.4]" />

      {/* Radial Menu */}
      <motion.div
        animate={{ rotate: -rotation }}
        transition={{ type: "spring", stiffness: 50, damping: 15 }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {terpenes.map((terpene, i) => {
          const angle = i * (360 / terpenes.length);
          return (
            <motion.button
              key={terpene.name}
              onClick={() => handleSelect(i)}
              className={cn(
                "absolute p-3 sm:p-4 md:p-6 rounded-full border border-white/10 backdrop-blur-xl transition-all hover:scale-110 group",
                selected.name === terpene.name ? "bg-white/10 border-white/30" : "bg-black/40"
              )}
              style={{
                transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
              }}
            >
              <div 
                className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full mb-1 mx-auto"
                style={{ backgroundColor: terpene.color }} 
              />
              <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-widest text-white font-mono">
                {terpene.name}
              </span>
              
              {/* Tooltip on hover */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-[10px] p-2 rounded border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                {terpene.effect}
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Center Display: Chemical Structure (Hexagon) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{ width: centerSize * 4, height: centerSize * 4 }}
          className="border border-white/10 bg-white/5 rounded-full backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-8 text-center relative overflow-hidden"
        >
          <div 
            className="absolute inset-0 opacity-10"
            style={{ 
              background: `radial-gradient(circle, ${selected.color} 0%, transparent 70%)` 
            }} 
          />
          
          {/* Hexagon Placeholder for "Chemical Structure" */}
          <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-16 md:h-16 mb-2 md:mb-4 text-white/40">
            <path
              d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <motion.path
              key={selected.name}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z"
              fill="none"
              stroke={selected.color}
              strokeWidth="2"
            />
          </svg>

          <AnimatePresence mode="wait">
            <motion.div
              key={selected.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-0.5 md:space-y-1"
            >
              <h3 className="text-sm md:text-xl font-bold text-white tracking-tight">{selected.name}</h3>
              <p className="text-[8px] md:text-[10px] font-mono text-white/50 uppercase tracking-wider">{selected.aroma}</p>
              <div className="h-px w-6 md:w-8 bg-white/20 mx-auto my-1 md:my-2" />
              <p className="text-[10px] md:text-xs text-white/70 leading-relaxed max-w-[80px] md:max-w-[120px] line-clamp-3 md:line-clamp-none">
                {selected.description}
              </p>
              <p className="text-[8px] md:text-[9px] font-mono text-white/40 mt-1 md:mt-2">
                BP: {selected.boilingPoint}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
