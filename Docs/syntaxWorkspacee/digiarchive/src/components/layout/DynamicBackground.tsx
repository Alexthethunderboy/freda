'use client';

import { useSpotify } from "@/hooks/useSpotify";

export function DynamicBackground() {
  const { data } = useSpotify();
  const isPlaying = data?.isPlaying || false;
  const energy = data?.energy || 0.5;
  const tempo = data?.tempo || 120;

  // Calculate dynamic values based on energy and tempo
  const stormIntensity = isPlaying ? 0.5 + energy * 0.5 : 0.3;
  const pulseSpeed = isPlaying ? (60 / tempo) * 2 : 8; // Adjust pulse speed to BPM
  const blurAmount = 100 + energy * 100;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-midnight">
      {/* Base Gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-midnight via-[#0a120a] to-midnight opacity-90" />

      {/* Atmospheric Fog Layers - Vibe-Synced */}
      <div 
        className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-forest-floor-light opacity-20 rounded-full mix-blend-screen transition-all duration-1000"
        style={{ 
          filter: `blur(${blurAmount}px)`,
          animation: `pulse ${pulseSpeed}s ease-in-out infinite`,
          transform: `scale(${1 + energy * 0.2})`
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-electric-storm-dark opacity-10 rounded-full mix-blend-screen transition-all duration-1000"
        style={{ 
          filter: `blur(${blurAmount * 1.2}px)`,
          animation: `pulse ${pulseSpeed * 1.5}s ease-in-out infinite`,
          transform: `scale(${1 + energy * 0.3})`
        }}
      />
      
      {/* Noise Texture Overlay for "Realness" */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%221%22/%3E%3C/svg%3E")' }} 
      />
    </div>
  );
}
