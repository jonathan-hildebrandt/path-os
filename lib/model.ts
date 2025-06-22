import { z } from 'zod/v4';
import {
  formatDurationDynamic,
  getDistanceDynamic,
  getDistanceUnit,
  getDurationUnit,
} from './utils';
import { format } from 'date-fns';

export enum RunStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABORTED = 'aborted',
}

export type Interval = 'year' | 'week' | 'month' | 'all';

export const CompletedRunSchema = z.object({
  id: z.number().nonnegative(),
  status: z.enum(RunStatus),
  durationInSeconds: z.number().nonnegative(),
  distanceInMeters: z.number().nonnegative(),
  avgPaceInSeconds: z.number().nonnegative(),
  elevationGainInMeters: z.number(),
  timestamp: z.number().nonnegative(),
});

export type CompletedRun = z.infer<typeof CompletedRunSchema>;

export const UncompletedRunSchema = z.object({
  id: z.number().nonnegative(),
  status: z.enum(RunStatus),
  durationInSeconds: z.number().nonnegative().nullable(),
  distanceInMeters: z.number().nonnegative().nullable(),
  avgPaceInSeconds: z.number().nonnegative().nullable(),
  elevationGainInMeters: z.number().nullable(),
  timestamp: z.number().nonnegative().nullable(),
});

export type UncompletedRun = z.infer<typeof UncompletedRunSchema>;

export const UncompletedSplitSchema = z.object({
  runId: z.number().nonnegative(),
  km: z.number().nonnegative(),
  avgPaceInSeconds: z.number().nonnegative(),
  elevationGainInMeters: z.number(),
});

export type UncompletedSplit = z.infer<typeof UncompletedSplitSchema>;

export const CompletedSplitSchema = z.object({
  id: z.number().nonnegative(),
  runId: z.number().nonnegative(),
  km: z.number().nonnegative(),
  avgPaceInSeconds: z.number().nonnegative(),
  elevationGainInMeters: z.number(),
});

export type CompletedSplit = z.infer<typeof CompletedSplitSchema>;

export const CompletedLocationSchema = z.object({
  id: z.number().nonnegative(),
  runId: z.number().nonnegative(),
  latitude: z.number(),
  longitude: z.number(),
  altitudeInMeters: z.number().nullable(),
  timestamp: z.number().nonnegative(),
});

export type CompletedLocation = z.infer<typeof CompletedLocationSchema>;

export const UncompletedLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  altitudeInMeters: z.number().nullable(),
  timestamp: z.number().nonnegative(),
});

export type UncompletedLocation = z.infer<typeof UncompletedLocationSchema>;

export const RunIdSchema = z.object({
  runId: z.number().nonnegative(),
});

export const OverviewSchema = z.object({
  totalRuns: z
    .number()
    .nonnegative()
    .transform((value) => value.toString())
    .nullable(),
  totalDistance: z
    .number()
    .nonnegative()
    .transform((value) => ({
      distance: getDistanceDynamic(value),
      unit: getDistanceUnit(value),
    }))
    .nullable(),
  totalDuration: z
    .number()
    .nonnegative()
    .transform((value) => ({
      duration: formatDurationDynamic(value),
      unit: getDurationUnit(value),
    }))
    .nullable(),
  avgPace: z
    .number()
    .nonnegative()
    .transform((value) => {
      const paceInMinutes = value / 60;

      return (
        Math.floor(paceInMinutes).toString().padStart(2, '0') +
        ':' +
        Math.round((paceInMinutes % 1) * 60)
          .toString()
          .padStart(2, '0')
      );
    })
    .nullable(),
});

export type Overview = z.infer<typeof OverviewSchema>;

export const ActivityRunSchema = z.object({
  id: z.number().nonnegative(),
  status: z.enum(RunStatus),
  duration: z
    .number()
    .nonnegative()
    .transform((value) => ({
      duration: formatDurationDynamic(value),
      unit: getDurationUnit(value),
    })),
  distance: z
    .number()
    .nonnegative()
    .transform((value) => ({
      distance: getDistanceDynamic(value),
      unit: getDistanceUnit(value),
    })),
  avgPace: z
    .number()
    .nonnegative()
    .transform((value) => {
      const paceInMinutes = value / 60;

      return (
        Math.floor(paceInMinutes).toString().padStart(2, '0') +
        ':' +
        Math.round((paceInMinutes % 1) * 60)
          .toString()
          .padStart(2, '0')
      );
    }),
  date: z
    .number()
    .nonnegative()
    .transform((value) => {
      const date = new Date(value);
      return format(date, 'dd.MM.yyyy');
    }),
});

export type ActivityRun = z.infer<typeof ActivityRunSchema>;

export const CursorSchema = z.object({
  cursor: z.number().nonnegative(),
});

export type Cursor = z.infer<typeof CursorSchema>;

export const RunSchema = z.object({
  id: z.number().nonnegative(),
  status: z.enum(RunStatus),
  duration: z
    .number()
    .nonnegative()
    .transform((value) => ({
      duration: formatDurationDynamic(value),
      unit: getDurationUnit(value),
    })),
  distance: z
    .number()
    .nonnegative()
    .transform((value) => ({
      distance: getDistanceDynamic(value),
      unit: getDistanceUnit(value),
    })),
  avgPace: z
    .number()
    .nonnegative()
    .transform((value) => {
      const paceInMinutes = value / 60;

      return (
        Math.floor(paceInMinutes).toString().padStart(2, '0') +
        ':' +
        Math.round((paceInMinutes % 1) * 60)
          .toString()
          .padStart(2, '0')
      );
    }),
  elevationGain: z.number(),
  date: z
    .number()
    .nonnegative()
    .transform((value) => {
      const date = new Date(value);
      return format(date, 'dd.MM.yyyy');
    }),
  splits: z.array(
    z.object({
      id: z.number().nonnegative(),
      km: z.number().nonnegative(),
      splitPace: z
        .number()
        .nonnegative()
        .transform((value) => {
          const paceInMinutes = value / 60;

          return (
            Math.floor(paceInMinutes).toString().padStart(2, '0') +
            ':' +
            Math.round((paceInMinutes % 1) * 60)
              .toString()
              .padStart(2, '0')
          );
        }),
      splitElevation: z.number(),
    })
  ),
});

export type Run = z.infer<typeof RunSchema>;
