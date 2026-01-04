'use client';

import { useSpotify } from "@/hooks/useSpotify";
import { cn } from "@/lib/utils";
import { Link2, Radio } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function GlobalPlayer() {
  const { data } = useSpotify();
  const isPlaying = data?.isPlaying;

  if (!isPlaying || !data) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="fixed bottom-24 md:bottom-8 md:right-8 z-40 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0"
      >
        <a 
          href={data.songUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-black/80 backdrop-blur-xl border border-white/10 pr-4 pl-1.5 py-1.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-green-500/50 transition-all duration-300 group scale-90 md:scale-100 ring-1 ring-white/5"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
             <img 
               src={data.albumImageUrl} 
               alt={data.album} 
               className="w-full h-full object-cover animate-[spin_8s_linear_infinite]" 
               style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
             />
             <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full backdrop-blur-sm" />
             </div>
          </div>
          
          <div className="flex flex-col min-w-[80px] max-w-[140px] md:max-w-[160px]">
             <span className="text-[10px] font-bold text-white truncate w-full group-hover:text-green-400 transition-colors leading-tight">
               {data.title}
             </span>
             <div className="flex items-center gap-1.5 mt-0.5">
               <span className="text-[9px] text-gray-400 truncate w-full">
                 {data.artist}
               </span>
               <div className="flex gap-0.5 items-end h-2 shrink-0">
                    <span className="w-0.5 bg-green-500 h-1 animate-[music-bar_0.5s_ease-in-out_infinite] shadow-[0_0_5px_#22c55e]" />
                    <span className="w-0.5 bg-green-500 h-2 animate-[music-bar_0.6s_ease-in-out_infinite_0.1s] shadow-[0_0_5px_#22c55e]" />
                    <span className="w-0.5 bg-green-500 h-1.5 animate-[music-bar_0.7s_ease-in-out_infinite_0.2s] shadow-[0_0_5px_#22c55e]" />
               </div>
             </div>
          </div>
        </a>
      </motion.div>
    </AnimatePresence>
  );
}
