import { getDistance } from 'geolib';
import { UncompletedLocation } from './model';

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
