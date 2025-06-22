import { create } from 'zustand';
import { ActivityRun, Interval, Overview } from './model';

export type RunStore = {
  runs: ActivityRun[];
  addRuns: (runs: ActivityRun[]) => void;
  addNewestRun: (run: ActivityRun) => void;
  cursor: number | null;
  setCursor: (cursor: number | null) => void;
  interval: Interval;
  setInterval: (overview: Interval) => void;
  overview: Overview | null;
  setOverview: (overview: Overview | null) => void;
};

export const useRunStore = create<RunStore>()((set) => ({
  cursor: 0,
  interval: 'week',
  setInterval: (interval: Interval) => set(() => ({ interval })),
  overview: null,
  setOverview: (overview: Overview | null) => set(() => ({ overview })),
  setCursor: (cursor: number | null) => set(() => ({ cursor })),
  runs: [],
  addRuns: (runs: ActivityRun[]) =>
    set((state) => ({
      runs: [...state.runs, ...runs],
    })),
  addNewestRun: async (newestRun: ActivityRun) =>
    set((state) => ({
      runs: [newestRun, ...state.runs],
      cursor: state.cursor === null ? null : state.cursor + 1,
    })),
}));
