'use client';

import { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { Radio } from "lucide-react";

export function Header() {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const checkLive = async () => {
      try {
        const res = await fetch('/api/twitch/is-live');
        if (res.ok) {
          const data = await res.json();
          setIsLive(data.isLive);
        }
      } catch (e) {
        console.error("Failed to check Twitch status", e);
      }
    };
    checkLive();
    const interval = setInterval(checkLive, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`fixed top-0 left-0 z-50 p-6 w-full pointer-events-none transition-all duration-700 ${isLive ? 'bg-red-950/20 shadow-[0_0_50px_rgba(239,68,68,0.2)]' : ''}`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="pointer-events-auto block w-fit group">
          <div className="relative flex items-center gap-3">
            <div className="relative">
              {/* Glow effect - Thunder Yellow / Red if live */}
              <div className={`absolute inset-0 blur-xl transition-all duration-700 rounded-full ${isLive ? 'bg-red-500/50 opacity-100 animate-pulse' : 'bg-yellow-400/30 opacity-40 group-hover:opacity-80'}`} />
              
              <div className={`relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border backdrop-blur-sm flex items-center justify-center transition-colors duration-700 ${isLive ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] bg-red-950/80' : 'border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.3)] bg-midnight/80'}`}>
                <Image
                  src="/logo.png"
                  alt="Thunderboy Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover scale-110" 
                  priority
                />
              </div>
            </div>
            
            <div className="hidden md:flex flex-col">
              <span className={`text-sm font-display font-bold tracking-wider transition-colors duration-700 ${isLive ? 'text-red-500' : 'text-yellow-500 opacity-0 group-hover:opacity-100'}`}>
                {isLive ? 'LIVE NOW' : 'THUNDERBOY'}
              </span>
              <AnimatePresence>
                {isLive && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-1 text-[8px] font-mono text-red-400/70"
                  >
                    <Radio className="w-2 h-2" />
                    STREAMING ECOSYSTEMS
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
