'use client';

import { useSpotify } from "@/hooks/useSpotify";
import { InfoCard } from "@/components/bento/InfoCard";
import { Radio, ListMusic, Play, ArrowUpRight, Music, Mic2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";

export function SpotifyCard() {
  const { data, playlists, topTracks, topArtists, profileUrl, loading, error } = useSpotify();
  const [view, setView] = useState<'player' | 'playlists' | 'hits' | 'artists'>('player');
  const isPlaying = data?.isPlaying;

  const isListView = view !== 'player';

  return (
    <InfoCard 
      className={cn(
        "md:col-span-4 flex flex-col justify-between group relative overflow-hidden bg-black/40 transition-all duration-700",
        isListView ? "md:min-h-[450px] md:row-span-2" : "min-h-[160px] md:row-span-1"
      )} 
      // Only link whole card if in player mode and playing, otherwise allow inner clicks
      href={view === 'player' && isPlaying ? data.songUrl : undefined}
    >
      {/* Background Album Art Blur (Global) */}
      {view === 'player' && isPlaying && data?.albumImageUrl && (
         <div 
           className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 transition-opacity duration-700 group-hover:opacity-30 pointer-events-none"
           style={{ backgroundImage: `url(${data.albumImageUrl})` }} 
         />
      )}

      {/* Header / Tabs */}
      <div className="flex items-center justify-between relative z-20 mb-2">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
           <button 
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); setView('player'); }}
             className={cn(
               "p-2 rounded-full transition-all duration-300 flex items-center gap-2",
               view === 'player' ? "bg-green-500/20 text-green-400" : "text-gray-500 hover:text-gray-300"
             )}
           >
             <Radio className={cn("w-4 h-4", isPlaying && view === 'player' ? "animate-pulse" : "")} />
             <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Frequency</span>
           </button>
           <button 
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); setView('playlists'); }}
             className={cn(
               "p-2 rounded-full transition-all duration-300 flex items-center gap-2",
               view === 'playlists' ? "bg-purple-500/20 text-purple-400" : "text-gray-500 hover:text-gray-300"
             )}
           >
             <ListMusic className="w-4 h-4" />
             <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Library</span>
           </button>
           <button 
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); setView('hits'); }}
             className={cn(
               "p-2 rounded-full transition-all duration-300 flex items-center gap-2",
               view === 'hits' ? "bg-blue-500/20 text-blue-400" : "text-gray-500 hover:text-gray-300"
             )}
           >
             <Music className="w-4 h-4" />
             <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Monthly Hits</span>
           </button>
           <button 
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); setView('artists'); }}
             className={cn(
               "p-2 rounded-full transition-all duration-300 flex items-center gap-2",
               view === 'artists' ? "bg-yellow-500/20 text-yellow-400" : "text-gray-500 hover:text-gray-300"
             )}
           >
             <Mic2 className="w-4 h-4" />
             <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Top Artists</span>
           </button>
        </div>
        
        <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-500 font-mono">
            {view === 'player' && isPlaying && (
              <>
                <div className="flex gap-0.5 items-end h-3">
                  <span className="w-0.5 bg-green-500/50 h-1 animate-[music-bar_1s_ease-in-out_infinite]" />
                  <span className="w-0.5 bg-green-500/50 h-2 animate-[music-bar_1.2s_ease-in-out_infinite_0.1s]" />
                  <span className="w-0.5 bg-green-500/50 h-3 animate-[music-bar_0.8s_ease-in-out_infinite_0.2s]" />
                </div>
                <span className="text-green-500/70">ON AIR</span>
              </>
            )}
        </div>
      </div>
      {/* View Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-2">
        {view === 'player' ? (
          // PLAYER VIEW
          <div className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-6 md:gap-10">
              <div className="relative w-20 h-20 shrink-0 md:w-24 md:h-24">
                {isPlaying && data?.albumImageUrl ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={data.albumImageUrl} 
                      alt="Album Art" 
                      className="w-full h-full rounded-md object-cover shadow-2xl border border-white/10 relative z-10" 
                    />
                    <div className="absolute inset-0 bg-neutral-900 rounded-full border-4 border-neutral-800 animate-[spin_3s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity -right-4 shadow-lg scale-95" />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-md bg-neutral-800/50 flex items-center justify-center border border-white/5 backdrop-blur-sm">
                    <Radio className="w-10 h-10 text-gray-600 animate-pulse" />
                  </div>
                )}
              </div>

              <div className="overflow-hidden space-y-1">
                <p className="text-[10px] text-green-500 uppercase tracking-[0.2em] font-mono font-bold">
                  {loading ? "SEARCHING..." : (isPlaying ? "BROADCASTING LIVE" : "STATION OFFLINE")}
                </p>
                <div className="flex flex-col">
                  <h4 className="text-xl md:text-3xl font-display font-bold truncate max-w-[200px] md:max-w-[500px] text-white tracking-tight">
                    {loading ? "Initializing..." : (isPlaying ? data.title : "Static / Silence")}
                  </h4>
                  <p className="text-sm md:text-lg text-gray-400 truncate max-w-[150px] md:max-w-[400px] font-light">
                    {isPlaying ? data.artist : "Nexus Frequency"}
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-8 pr-4">
               <div className="flex flex-col items-end gap-1 font-mono">
                  <span className="text-[10px] text-green-400">SIGNAL STRENGTH</span>
                  <div className="flex gap-0.5">
                     {[...Array(5)].map((_, i) => (
                       <div key={i} className={cn("w-1 h-3 rounded-xs", i < 4 ? "bg-green-500" : "bg-green-500/20")} />
                     ))}
                  </div>
               </div>
               
               <div className="flex flex-col items-end gap-1 font-mono">
                  <span className="text-[10px] text-gray-500">FORMAT</span>
                  <span className="text-[10px] text-white bg-white/10 px-1.5 py-0.5 rounded">LOSSLESS</span>
               </div>

               <div className="h-12 w-px bg-white/10" />

               <div className="flex flex-col items-end gap-1 font-mono text-right">
                  <span className="text-[10px] text-gray-500 uppercase">Current Band</span>
                  <span className="text-xs text-white">432.00 MHz</span>
               </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 w-full h-full">
            {/* Mobile Scroll View */}
            <div className="flex md:hidden gap-6 overflow-x-auto pb-4 no-scrollbar px-4 pt-2">
               {view === 'playlists' && playlists.length > 0 && playlists.map((p) => (
                 <Link key={p.id} href={p.url} target="_blank" className="flex flex-col gap-2 min-w-[120px] max-w-[120px] group/item">
                    <div className="aspect-square w-full rounded-xl overflow-hidden border border-white/10 relative">
                      <img src={p.image || ''} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[11px] font-bold text-white truncate text-center">{p.name}</p>
                 </Link>
               ))}
               {view === 'hits' && topTracks.length > 0 && topTracks.map((t) => (
                 <Link key={t.id} href={t.url} target="_blank" className="flex flex-col gap-2 min-w-[120px] max-w-[120px] group/item">
                    <div className="aspect-square w-full rounded-xl overflow-hidden border border-white/10 relative">
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                     <div className="space-y-0.5">
                       <p className="text-[11px] font-bold text-white truncate text-center">{t.name}</p>
                       <p className="text-[9px] text-gray-500 truncate text-center">{t.artist}</p>
                     </div>
                 </Link>
               ))}
               {view === 'artists' && topArtists.length > 0 && topArtists.map((a) => (
                 <Link key={a.id} href={a.url} target="_blank" className="flex flex-col gap-2 min-w-[120px] max-w-[120px] group/item">
                    <div className="aspect-square w-full rounded-full overflow-hidden border border-white/10 relative">
                      <img src={a.image} alt={a.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[11px] font-bold text-white truncate text-center">{a.name}</p>
                 </Link>
               ))}
            </div>

            {/* Desktop Grid View */}
            <div className="hidden md:grid grid-cols-5 lg:grid-cols-7 gap-6 px-4 pt-2 h-full content-start">
               {view === 'playlists' && playlists.map((p) => (
                   <Link key={p.id} href={p.url} target="_blank" className="flex flex-col gap-2 group/item transition-transform duration-300 hover:-translate-y-1">
                      <div className="aspect-square w-full rounded-xl overflow-hidden border border-white/10 relative shadow-2xl">
                        <img src={p.image || ''} alt={p.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all duration-300">
                          <div className="bg-green-500 p-3 rounded-full scale-50 group-hover/item:scale-100 transition-transform duration-300 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                            <Play className="w-6 h-6 text-black fill-current" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-0.5 px-1">
                        <p className="text-[11px] font-bold text-white truncate w-full group-hover/item:text-green-400 transition-colors uppercase tracking-tight">{p.name}</p>
                        <p className="text-[9px] text-gray-500 font-mono tracking-tighter">{p.tracks} TRACKS</p>
                      </div>
                   </Link>
               ))}

               {view === 'hits' && topTracks.map((t) => (
                   <Link key={t.id} href={t.url} target="_blank" className="flex flex-col gap-2 group/item transition-transform duration-300 hover:-translate-y-1">
                      <div className="aspect-square w-full rounded-xl overflow-hidden border border-white/10 relative shadow-2xl">
                        <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all duration-300">
                          <div className="bg-blue-500 p-3 rounded-full scale-50 group-hover/item:scale-100 transition-transform duration-300 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                            <Play className="w-6 h-6 text-white fill-current" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-0.5 px-1">
                        <p className="text-[11px] font-bold text-white truncate w-full group-hover/item:text-blue-400 transition-colors uppercase tracking-tight">{t.name}</p>
                        <p className="text-[9px] text-gray-500 font-mono tracking-tighter">{t.artist}</p>
                      </div>
                   </Link>
               ))}

               {view === 'artists' && topArtists.map((a) => (
                   <Link key={a.id} href={a.url} target="_blank" className="flex flex-col gap-2 group/item transition-transform duration-300 hover:-translate-y-1">
                      <div className="aspect-square w-full rounded-full overflow-hidden border border-white/10 relative shadow-2xl">
                        <img src={a.image} alt={a.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all duration-300">
                          <div className="bg-yellow-500 p-3 rounded-full scale-50 group-hover/item:scale-100 transition-transform duration-300 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                            <Play className="w-6 h-6 text-black fill-current" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-0.5 px-1 text-center">
                        <p className="text-[11px] font-bold text-white truncate w-full group-hover/item:text-yellow-400 transition-colors uppercase tracking-tight">{a.name}</p>
                        <p className="text-[9px] text-gray-500 font-mono tracking-tighter uppercase">{a.genres.join(' • ')}</p>
                      </div>
                   </Link>
               ))}

                {/* Empty States */}
                {view === 'playlists' && playlists.length === 0 && (
                  <div className="col-span-full text-center text-sm text-gray-500 py-12 border-2 border-dashed border-white/5 rounded-2xl">
                    {loading ? "Decrypting Library..." : (error || "No public playlists found. Synchronizing...")}
                  </div>
                )}
                {view === 'hits' && topTracks.length === 0 && (
                  <div className="col-span-full text-center text-sm text-gray-500 py-12 border-2 border-dashed border-white/5 rounded-2xl">
                    {loading ? "Analyzing Frequencies..." : (error || "Insufficient data for this cycle. Keep playing.")}
                  </div>
                )}
                {view === 'artists' && topArtists.length === 0 && (
                  <div className="col-span-full text-center text-sm text-gray-500 py-12 border-2 border-dashed border-white/5 rounded-2xl">
                     {loading ? "Scanning Aura..." : (error || "Aura signal weak. More input required.")}
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-3 right-3 z-20 flex gap-2">
        {view === 'playlists' && profileUrl && (
           <a href={profileUrl} target="_blank" className="text-[10px] bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 backdrop-blur-md">
             Visit Full Frequency <ArrowUpRight className="w-3 h-3" />
           </a>
        )}
      </div>
    </InfoCard>
  );
}

