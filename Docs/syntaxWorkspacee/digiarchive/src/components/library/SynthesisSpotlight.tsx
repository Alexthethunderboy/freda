'use client';

import { motion } from 'framer-motion';
import { Star, Quote, ArrowRight, ExternalLink } from 'lucide-react';

export function SynthesisSpotlight() {
  return (
    <div className="relative group">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-linear-to-r from-electric-storm/10 via-transparent to-electric-storm/5 blur-3xl opacity-50" />
      
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-md p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-neutral-500 font-mono text-[10px] uppercase tracking-[0.2em]">
              <div className="w-1.5 h-1.5 rounded-full bg-electric-storm animate-pulse" />
              Active Investigation / 001
            </div>
            
            <h3 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-[1.1]">
              Rethinking <br/>
              <span className="text-neutral-400">Social Evolution</span>
            </h3>

            <div className="space-y-4 text-neutral-500 text-sm md:text-base leading-relaxed">
              <p className="font-serif italic text-neutral-300">
                "We are all projects of self-liberation..."
              </p>
              <p>
                Digging into *The Dawn of Everything*. It's challenging the rigid 'linear progress' narrative I was taught. If the state isn't inevitable, then our current systems aren't either.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-white text-xs font-mono uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all group">
                Open Full Notes
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative aspect-square flex items-center justify-center">
            <motion.div 
              animate={{ 
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative z-10"
            >
              <div className="w-48 h-64 bg-neutral-900 rounded-lg shadow-2xl overflow-hidden border border-white/10 relative group-hover:border-electric-storm/30 transition-colors">
                <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent shadow-inner" />
                <div className="p-6 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-6 h-0.5 bg-electric-storm/50" />
                    <div>
                      <h4 className="text-sm font-bold text-neutral-400 font-mono uppercase tracking-[0.2em] mb-1 leading-none">Origins</h4>
                      <p className="text-[8px] font-mono text-neutral-600">GRAEBER & WENGROW</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 opacity-20">
                    <div className="h-0.5 w-full bg-white/20 rounded" />
                    <div className="h-0.5 w-full bg-white/20 rounded" />
                    <div className="h-0.5 w-full bg-white/20 rounded" />
                    <div className="h-0.5 w-2/3 bg-white/20 rounded" />
                  </div>
                </div>
              </div>
              
              {/* Subtle ghost elements */}
              <div className="absolute inset-0 translate-x-2 translate-y-2 border border-white/5 rounded-lg -z-10 bg-black/40" />
            </motion.div>
            
            {/* Soft Aura */}
            <div className="absolute inset-0 bg-electric-storm/5 blur-[100px] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
