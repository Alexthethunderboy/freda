import { create } from 'zustand';

interface AudioState {
  currentTrack: {
    title: string;
    artist?: string;
    url: string;
    thumbnail?: string;
  } | null;
  isPlaying: boolean;
  volume: number;
  setTrack: (track: AudioState['currentTrack']) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  setTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
}));
