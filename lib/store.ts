import { create } from 'zustand';
import { ActivityRun, Interval, Overview } from './model';
import { getOverview } from './query';

export type RunStore = {
  runs: ActivityRun[];
  addRuns: (runs: ActivityRun[]) => void;
  addNewestRun: (run: ActivityRun) => void;
  removeRun: (id: number) => void;
  cursor: number | null;
  setCursor: (cursor: number | null) => void;
  interval: Interval;
  setInterval: (overview: Interval) => void;
  overview: Overview | null;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  setOverview: (overview: Overview | null) => void;
};

export const useRunStore = create<RunStore>()((set) => ({
  cursor: 0,
  interval: 'week',
  isRunning: false,
  setIsRunning: (isRunning: boolean) => set(() => ({ isRunning })),
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
  removeRun: (id: number) => {
    set((state) => ({
      runs: state.runs.filter((run) => run.id !== id),
      cursor: state.cursor === null ? null : state.cursor - 1,
    }));
  },
}));
