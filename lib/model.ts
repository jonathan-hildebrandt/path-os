import { z } from 'zod/v4';

export enum RunStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABORTED = 'aborted',
}

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
