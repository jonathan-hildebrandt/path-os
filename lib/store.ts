import { create } from 'zustand';
import { ActivityRun, Interval, Overview } from './model';

export type RunStore = {
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  cursor: number | null;
  setCursor: (cursor: number | null) => void;
  runs: ActivityRun[];
  addRuns: (runs: ActivityRun[]) => void;
  addNewestRun: (run: ActivityRun) => void;
  removeRun: (id: number) => void;
};

export const useRunStore = create<RunStore>()((set) => ({
  isRunning: false,
  setIsRunning: (isRunning: boolean) => set(() => ({ isRunning })),
  cursor: 0,
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

export type OverviewStore = {
  interval: Interval;
  setInterval: (overview: Interval) => void;
  overview: Overview | null;
  setOverview: (overview: Overview | null) => void;
};

export const useOverviewStore = create<OverviewStore>()((set) => ({
  interval: 'week',
  setInterval: (interval: Interval) => set(() => ({ interval })),
  overview: null,
  setOverview: (overview: Overview | null) => set(() => ({ overview })),
}));
