import { create } from 'zustand';

interface MobileState {
  isImmersiveMode: boolean;
  isScrollDown: boolean;
  activeTouchId: string | null;
  isMenuOpen: boolean;
  isSearchOpen: boolean;
  
  setImmersiveMode: (isImmersive: boolean) => void;
  setScrollDown: (isDown: boolean) => void;
  setActiveTouchId: (id: string | null) => void;
  setMenuOpen: (isOpen: boolean) => void;
  toggleMenu: () => void;
  setSearchOpen: (isOpen: boolean) => void;
}

export const useMobileStore = create<MobileState>((set) => ({
  isImmersiveMode: false,
  isScrollDown: false,
  activeTouchId: null,
  isMenuOpen: false,
  isSearchOpen: false,

  setImmersiveMode: (isImmersive) => set({ isImmersiveMode: isImmersive }),
  setScrollDown: (isDown) => set({ isScrollDown: isDown }),
  setActiveTouchId: (id) => set({ activeTouchId: id }),
  setMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
}));
