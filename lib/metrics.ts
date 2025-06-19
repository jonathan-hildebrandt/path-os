import { getDistance } from 'geolib';
import { UncompletedLocation, UncompletedSplit } from './model';

/**
 * Calculates the run metrics based on the provided locations.
 * @param locations - An array of UncompletedLocation objects representing the run.
 * @returns An object containing the run metrics:
 */
export function calculateRunMetrics(locations: UncompletedLocation[]): {
  durationInSeconds: number;
  distanceInMeters: number;
  elevationGainInMeters: number;
  avgPaceInSeconds: number;
} {
  const start = locations[0].timestamp;
  const end = locations[locations.length - 1].timestamp;
  const durationInSeconds = (end - start) / 1000;

  const distanceInMeters = locations.reduce((acc, curr, i) => {
    if (i === 0) return acc;
    return (
      acc +
      getDistance(
        {
          latitude: locations[i - 1].latitude,
          longitude: locations[i - 1].longitude,
        },
        { latitude: curr.latitude, longitude: curr.longitude }
      )
    );
  }, 0);

  const elevationGainInMeters = locations.reduce((acc, curr, i) => {
    if (i === 0) return acc;
    const prev = locations[i - 1].altitudeInMeters ?? 0;
    const currAlt = curr.altitudeInMeters ?? 0;
    return acc + Math.max(0, currAlt - prev);
  }, 0);

  const avgPaceInSeconds =
    distanceInMeters > 0
      ? Math.round(durationInSeconds / (distanceInMeters / 1000))
      : 0;

  return {
    durationInSeconds,
    distanceInMeters,
    elevationGainInMeters,
    avgPaceInSeconds,
  };
}

//TODO understand why this is not working

/**
 * Calculates the split metrics for each kilometer based on the provided locations.
 * @param locations - An array of UncompletedLocation objects representing the run.
 * @param runId - The ID of the run for which to calculate splits.
 * @returns An array of UncompletedSplit objects representing the splits.
 */
export function calculateSplitMetrics(
  locations: UncompletedLocation[],
  runId: number
): UncompletedSplit[] {
  if (locations.length < 2) {
    console.warn(
      `⚠️ Not enough locations to calculate splits for run ${runId}.`
    );
    return [];
  }

  const splits: UncompletedSplit[] = [];
  let currentKm = 0;
  let kmStartTime = locations[0].timestamp;
  let kmStartElevation = locations[0].altitudeInMeters ?? 0;
  let kmDistance = 0;

  for (let i = 1; i < locations.length; i++) {
    const currLocation = locations[i];
    const prevLocation = locations[i - 1];

    const distance = getDistance(
      { latitude: prevLocation.latitude, longitude: prevLocation.longitude },
      { latitude: currLocation.latitude, longitude: currLocation.longitude }
    );

    kmDistance += distance;

    if (kmDistance >= 1000) {
      currentKm++;
      const kmEndTime = currLocation.timestamp;
      const kmDurationInSeconds = (kmEndTime - kmStartTime) / 1000;

      const elevationGain =
        (currLocation.altitudeInMeters ?? 0) - kmStartElevation;

      splits.push({
        runId,
        km: currentKm,
        avgPaceInSeconds: Math.round(kmDurationInSeconds),
        elevationGainInMeters: elevationGain,
      });

      // Reset for next km
      kmStartTime = currLocation.timestamp;
      kmStartElevation = currLocation.altitudeInMeters ?? 0;
      kmDistance -= 1000;
    }
  }

  // Handle any remaining distance if it exists
  if (splits.length === 0 && kmDistance > 0) {
    const lastKmEndTime = locations[locations.length - 1].timestamp;
    const lastKmDurationInSeconds = (lastKmEndTime - kmStartTime) / 1000;
    const lastElevationGain =
      (locations[locations.length - 1].altitudeInMeters ?? 0) -
      kmStartElevation;
    splits.push({
      runId,
      km: currentKm + 1,
      avgPaceInSeconds: Math.round(lastKmDurationInSeconds),
      elevationGainInMeters: lastElevationGain,
    });
  }

  console.log(`✅ Calculated ${splits.length} splits for run ${runId}.`);

  return splits;
}
