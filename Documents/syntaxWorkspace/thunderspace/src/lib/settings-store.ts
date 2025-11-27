import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  // Appearance
  theme: 'system' | 'light' | 'dark';
  fontSize: 'small' | 'normal' | 'large' | 'xl';
  reducedMotion: boolean;
  
  // Consumption
  audioSpeed: number;
  keepScreenAwake: boolean;
  
  // Data Saving
  lowDataMode: boolean;

  // Actions
  setTheme: (theme: SettingsState['theme']) => void;
  setFontSize: (size: SettingsState['fontSize']) => void;
  setReducedMotion: (enabled: boolean) => void;
  setAudioSpeed: (speed: number) => void;
  setKeepScreenAwake: (enabled: boolean) => void;
  setLowDataMode: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      fontSize: 'normal',
      reducedMotion: false,
      audioSpeed: 1,
      keepScreenAwake: false,
      lowDataMode: false,

      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setAudioSpeed: (audioSpeed) => set({ audioSpeed }),
      setKeepScreenAwake: (keepScreenAwake) => set({ keepScreenAwake }),
      setLowDataMode: (lowDataMode) => set({ lowDataMode }),
    }),
    {
      name: 'thunderspace-settings',
    }
  )
);
