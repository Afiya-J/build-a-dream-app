import { create } from "zustand";

import type { MockStudent } from "@/data/mock";

/**
 * Placeholder auth store shape for Phase 2.
 * No authentication happens in Phase 1 — this only reserves the structure.
 */
interface AuthState {
  profile: MockStudent | null;
  role: "student" | "admin" | null;
  isLoading: boolean;
  setProfile: (profile: MockStudent | null) => void;
  setRole: (role: AuthState["role"]) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  role: null,
  isLoading: false,
  setProfile: (profile) => set({ profile }),
  setRole: (role) => set({ role }),
  clear: () => set({ profile: null, role: null }),
}));
