// Merged from Nexus Page
import { BentoGrid } from "@/components/bento/BentoGrid";
import { InfoCard } from "@/components/bento/InfoCard";
import { Brain, Leaf, Terminal, ArrowUpRight, Zap, Cpu, Globe } from "lucide-react";
import { SpotifyCard } from "@/components/bento/SpotifyCard";
import { QuoteCard } from "@/components/bento/QuoteCard";
import { LagosTimeCard } from "@/components/bento/LagosTimeCard";
import { GraffitiWall } from "@/components/guestbook/GraffitiWall";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col gap-12 pb-24">
      
      {/* Header Section (Nexus Style) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8 mt-8">
          <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-storm/10 border border-electric-storm/20 text-electric-storm text-xs font-mono tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-storm opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-storm"></span>
                  </span>
                  SYSTEM ONLINE
              </div>
              <h1 className="text-6xl md:text-8xl font-display font-bold bg-clip-text text-transparent bg-linear-to-r from-white via-gray-200 to-gray-500">
                  THUNDERBOY
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl">
                  Kelechi Alexander Ugoh — Psychonaut. Developer. Activist.
              </p>
          </div>

          <div className="text-right hidden md:block opacity-60 font-mono text-sm space-y-1">
              <p>Lagos, NG</p>
              <p>Building Ecosystems</p>
          </div>
      </div>

      {/* Main Content Grid (Manifesto & DNA) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* The Manifesto - Main Block */}
          <div className="md:col-span-8 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Brain className="w-24 h-24 text-white rotate-12" />
               </div>
               <h2 className="text-3xl font-display font-bold mb-6 text-white flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  The Manifesto
               </h2>
               <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
                  <p>
                      I build ecosystems, I don&apos;t just build websites. My work connects the gap between high-performance code and human-like design, fueled by a passion for music, activism, and the science of consciousness.
                  </p>
                  <blockquote className="border-l-4 border-electric-storm pl-4 italic text-white/80 my-8">
                      "Cannabis is not a crime; it&apos;s a catalyst. I am a proud enthusiast and activist fighting for legalization, education, and the safe exploration of consciousness."
                  </blockquote>
                  <p>
                      I build to dismantle old systems and unlearn outdated narratives. Whether it&apos;s through code, music, or discourse, the goal is always the same: Evolution.
                  </p>
               </div>
               <div className="mt-8 flex gap-4">
                  <Link href="/unlearn" className="px-6 py-2 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                      Unlearn Naija <ArrowUpRight className="w-4 h-4" />
                  </Link>
               </div>
          </div>

          {/* Skills / DNA Card */}
          <div className="md:col-span-4 p-8 rounded-3xl bg-forest-floor-dark/50 border border-green-500/20 backdrop-blur-sm relative overflow-hidden flex flex-col">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <h3 className="text-2xl font-display font-bold mb-6 text-green-400 flex items-center gap-2 relative z-10">
                  <Cpu className="w-6 h-6" />
                  Core DNA
              </h3>
              
              <div className="flex-1 space-y-6 relative z-10">
                  <div className="space-y-2">
                      <p className="text-xs uppercase tracking-widest text-green-500/60 font-mono">Tech Stack</p>
                      <div className="flex flex-wrap gap-2">
                          {['React', 'Next.js', 'Tailwind', 'TypeScript', 'Node.js', 'AI Integration'].map(skill => (
                              <span key={skill} className="px-3 py-1 bg-green-900/40 border border-green-500/30 rounded text-green-300 text-xs font-mono">
                                  {skill}
                              </span>
                          ))}
                      </div>
                  </div>

                  <div className="space-y-2">
                       <p className="text-xs uppercase tracking-widest text-purple-500/60 font-mono">Creative</p>
                       <div className="flex flex-wrap gap-2">
                          {['Songwriting', 'Guitar', 'Music Prod', 'Content', 'Activism'].map(skill => (
                              <span key={skill} className="px-3 py-1 bg-purple-900/40 border border-purple-500/30 rounded text-purple-300 text-xs font-mono">
                                  {skill}
                              </span>
                          ))}
                       </div>
                  </div>
              </div>

              <div className="mt-auto relative z-10 pt-6">
                  <div className="flex items-center justify-between text-xs font-mono text-gray-500 border-t border-white/5 pt-4">
                      <span>EXP LEVEL</span>
                      <span className="text-green-400">HIGH</span>
                  </div>
              </div>
          </div>
      </div>

      <div className="border-t border-white/10 pt-8">
          <h3 className="text-xl font-mono text-gray-500 mb-6 px-1 flex items-center gap-2">
             <Globe className="w-4 h-4" />
             ARCHIVE & MODULES
          </h3>
          <BentoGrid className="max-w-7xl mx-auto md:grid-cols-4 md:auto-rows-[minmax(180px,auto)]">
            {/* Unlearn Naija - Main Feature Card (Col span 2, Row span 2) */}
            <InfoCard 
              className="md:col-span-2 md:row-span-2 flex flex-col justify-between group overflow-hidden" 
              variant="unlearn"
              href="/unlearn"
            >
              {/* Decorative Blueprint Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[20px_20px] opacity-20 group-hover:opacity-40 transition-opacity" />
              
              <div className="absolute top-4 right-4 flex items-center space-x-2 text-yellow-500/70 text-xs font-mono border border-yellow-500/30 px-2 py-1 rounded bg-black/20 backdrop-blur-sm z-10">
                <span>⚠️ BLUEPRINT</span>
                <span className="animate-pulse">●</span>
              </div>

              <div className="mt-auto relative z-10 p-2">
                <h3 className="text-3xl font-display font-bold text-yellow-100 flex items-center gap-2 drop-shadow-md">
                  Unlearn Naija <ArrowUpRight className="w-6 h-6 opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </h3>
                <p className="text-sm text-yellow-200/80 mt-2 max-w-md font-medium">
                  Dismantling paradigms. A movement to rethink and rebuild. 
                </p>
                <div className="w-full bg-yellow-900/30 h-1.5 mt-4 rounded-full overflow-hidden border border-yellow-500/20">
                  <div className="bg-yellow-500 h-full w-[45%] shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                </div>
                <p className="text-[10px] text-yellow-500/70 mt-1 font-mono uppercase tracking-widest">Loading Consciousness... 45%</p>
              </div>
            </InfoCard>

            {/* Psychonaut's Corner (Col span 1, Row span 2) */}
            <InfoCard 
              className="md:col-span-1 md:row-span-2 relative group overflow-hidden" 
              variant="psychonaut" 
              href="/psychonaut"
            >
              <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
              
              <div className="relative z-20 flex flex-col h-full items-center justify-center text-center p-2">
                <div className="absolute top-4 left-4 flex gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-mono text-green-500/60 uppercase tracking-widest leading-none">Activist</span>
                </div>

                <div className="mb-8 p-6 rounded-[3rem] bg-green-500/10 border border-green-500/20 group-hover:scale-110 group-hover:bg-green-500/20 transition-all duration-700 shadow-2xl shadow-green-500/20">
                  <Leaf className="w-20 h-20 text-green-400 drop-shadow-[0_0_25px_rgba(74,222,128,0.5)]" />
                </div>
                
                <div className="space-y-1 overflow-hidden w-full">
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight leading-tight truncate">
                    Psychonaut
                  </h3>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-green-400 tracking-tight leading-none truncate">
                    Corner
                  </h3>
                </div>
                
                <div className="mt-6 flex flex-col items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="h-0.5 w-12 bg-green-500/50 rounded-full" />
                  <span className="text-[8px] font-mono text-green-200/50 uppercase tracking-tighter">Consciousness Research</span>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </InfoCard>

            {/* Library of Thought (Col span 1, Row span 1 - Compact) */}
            <InfoCard className="md:col-span-1 md:row-span-1 group p-6 overflow-hidden border-electric-storm/20" href="/library">
              <div className="relative z-20 flex items-center gap-6 h-full">
                <div className="shrink-0 p-4 rounded-3xl bg-electric-storm/10 border border-electric-storm/20 group-hover:bg-electric-storm/20 transition-all duration-700 shadow-xl shadow-electric-storm/10">
                  <Brain className="w-14 h-14 text-electric-storm-light drop-shadow-[0_0_20px_rgba(147,197,253,0.4)]" />
                </div>
                <div className="overflow-hidden space-y-1">
                  <h3 className="text-2xl font-display font-bold text-white group-hover:text-electric-storm-light transition-colors leading-none truncate">
                    Library
                  </h3>
                  <div className="flex items-center gap-1.5 opacity-40">
                    <div className="w-1 h-1 rounded-full bg-electric-storm-light" />
                    <span className="text-[10px] font-mono text-gray-400 tracking-tighter truncate">124 Nodes</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-electric-storm/10 to-transparent opacity-40 blur-2xl group-hover:opacity-60 transition-opacity" />
            </InfoCard>

            {/* The Lab (Col span 1, Row span 1 - Compact) */}
            <InfoCard className="md:col-span-1 md:row-span-1 group p-6 overflow-hidden border-blue-500/20" variant="lab" href="/lab">
              <div className="relative z-20 flex items-center gap-6 h-full">
                <div className="shrink-0 p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all duration-700 shadow-xl shadow-blue-500/10">
                  <Terminal className="w-14 h-14 text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.4)]" />
                </div>
                <div className="overflow-hidden space-y-1">
                  <h3 className="text-2xl font-display font-bold text-white group-hover:text-blue-300 transition-colors leading-none truncate">
                    The Lab
                  </h3>
                  <div className="flex items-center gap-1.5 opacity-40">
                    <span className="text-[8px] px-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-300 font-mono tracking-widest">BRANCH:MAIN</span>
                  </div>
                </div>
              </div>
            </InfoCard>

            {/* Spotify Frequency (Col span 2, Row span 1 - Wider for info) */}
            <SpotifyCard />

            {/* New Cards */}
            <QuoteCard />
            <LagosTimeCard />

          </BentoGrid>
      </div>

      <div className="mt-12">
        <GraffitiWall />
      </div>

    </div>
  );
}

