import { create } from "zustand";

/** Lightweight global UI state (Phase 1). */
interface UIState {
  fabOpen: boolean;
  setFabOpen: (open: boolean) => void;
  toggleFab: () => void;
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  fabOpen: false,
  setFabOpen: (fabOpen) => set({ fabOpen }),
  toggleFab: () => set((s) => ({ fabOpen: !s.fabOpen })),
  navOpen: false,
  setNavOpen: (navOpen) => set({ navOpen }),
}));
