import { create } from "zustand";

/** Filters are kept in a store so they persist across navigation (Phase 5+). */
interface FilterState {
  department: string | null;
  year: string | null;
  semester: string | null;
  subject: string | null;
  resourceType: string;
  setFilter: (patch: Partial<Omit<FilterState, "setFilter" | "resetFilters">>) => void;
  resetFilters: () => void;
}

const initial = {
  department: null,
  year: null,
  semester: null,
  subject: null,
  resourceType: "All",
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initial,
  setFilter: (patch) => set(patch),
  resetFilters: () => set(initial),
}));
