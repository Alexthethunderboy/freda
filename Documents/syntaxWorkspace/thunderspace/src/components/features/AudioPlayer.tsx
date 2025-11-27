'use client';

import { useAudioStore } from '../../lib/store';
import { Play, Pause, X, Volume2, SkipBack, SkipForward, ChevronDown } from 'lucide-react';
import NextImage from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileStore } from '@/lib/store/useMobileStore';

export function AudioPlayer() {
  const { currentTrack, isPlaying, setIsPlaying, setTrack } = useAudioStore();
  const { setImmersiveMode } = useMobileStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (currentTrack && isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [currentTrack, isPlaying, setIsPlaying]);

  // Handle immersive mode when expanded
  useEffect(() => {
    if (isExpanded) {
      setImmersiveMode(true);
    } else {
      setImmersiveMode(false);
    }
  }, [isExpanded, setImmersiveMode]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <AnimatePresence mode="wait">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {isExpanded ? (
        /* Full Screen Player */
        <motion.div
          layoutId="audio-player-container"
          className="fixed inset-0 z-60 bg-background/95 backdrop-blur-3xl flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <button onClick={() => setIsExpanded(false)} className="text-muted-foreground hover:text-white">
              <ChevronDown className="w-8 h-8" />
            </button>
            <span className="text-xs font-mono uppercase tracking-widest text-thunder-yellow">Now Playing</span>
            <button onClick={() => setTrack(null)} className="text-muted-foreground hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 space-y-8">
            <motion.div 
              layoutId="album-art"
              className="w-64 h-64 md:w-96 md:h-96 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(255,200,0,0.1)] border border-white/10 relative"
            >
              {currentTrack.thumbnail ? (
                <NextImage 
                  src={currentTrack.thumbnail} 
                  alt={currentTrack.title} 
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-card flex items-center justify-center">
                  <Volume2 className="w-24 h-24 text-muted-foreground" />
                </div>
              )}
            </motion.div>

            <div className="text-center space-y-2">
              <motion.h2 layoutId="track-title" className="text-2xl md:text-3xl font-bold font-headings text-white">
                {currentTrack.title}
              </motion.h2>
              <motion.p layoutId="track-artist" className="text-lg text-muted-foreground">
                {currentTrack.artist || 'Unknown Artist'}
              </motion.p>
            </div>

            {/* Waveform Visualization (Simulated) */}
            <div className="flex items-center justify-center gap-1 h-12 w-full max-w-md">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-thunder-yellow rounded-full"
                  animate={{
                    height: isPlaying ? [10, 30, 10] : 4,
                    opacity: isPlaying ? 1 : 0.3
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.05,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md space-y-2">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-thunder-yellow"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8">
              <button className="text-muted-foreground hover:text-white transition-colors">
                <SkipBack className="w-8 h-8" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 rounded-full bg-thunder-yellow text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,200,0,0.4)]"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>
              <button className="text-muted-foreground hover:text-white transition-colors">
                <SkipForward className="w-8 h-8" />
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Mini Player */
        <motion.div
          layoutId="audio-player-container"
          className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-96 z-40 bg-card/80 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl flex items-center gap-4 cursor-pointer"
          onClick={() => setIsExpanded(true)}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
        >
          <motion.div 
            layoutId="album-art"
            className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white/5 relative"
          >
            {currentTrack.thumbnail ? (
              <NextImage 
                src={currentTrack.thumbnail} 
                alt={currentTrack.title} 
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <motion.h4 layoutId="track-title" className="text-sm font-bold text-foreground truncate">
              {currentTrack.title}
            </motion.h4>
            <motion.p layoutId="track-artist" className="text-xs text-muted-foreground truncate">
              {currentTrack.artist || 'Unknown Artist'}
            </motion.p>
          </div>

          {/* Mini Waveform */}
          <div className="flex items-center gap-0.5 h-6 mr-2">
             {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 bg-thunder-yellow rounded-full"
                  animate={{
                    height: isPlaying ? [4, 12, 4] : 4,
                    opacity: isPlaying ? 1 : 0.5
                  }}
                  transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
