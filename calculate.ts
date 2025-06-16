import { differenceInMinutes } from 'date-fns';
import { LocationObject } from 'expo-location';
import { getDistance } from 'geolib';

export function getDistanceInMeter(
  { coords: prev }: LocationObject,
  { coords: next }: LocationObject
): number {
  const distanceInMeters = getDistance(
    { latitude: prev.latitude, longitude: prev.longitude },
    { latitude: next.latitude, longitude: next.longitude }
  );

  return distanceInMeters;
}

export function getElevationGain(locations: LocationObject[]): number {
  if (locations.length < 2) {
    return 0;
  }

  let totalElevationGain = 0;

  for (let i = 1; i < locations.length; i++) {
    const prevElevation = locations[i - 1].coords.altitude ?? 0;
    const nextElevation = locations[i].coords.altitude ?? 0;

    if (nextElevation > prevElevation) {
      totalElevationGain += nextElevation - prevElevation;
    }
  }

  return totalElevationGain;
}

export function getTotalDistanceInKilometers(
  locations: LocationObject[]
): number {
  if (locations.length < 2) {
    return 0;
  }

  const totalDistanceInMeter = locations.reduce((acc, curr, index) => {
    if (index === 0) return acc;
    return acc + getDistanceInMeter(locations[index - 1], curr);
  }, 0);

  return totalDistanceInMeter / 1000;
}

export function getAvgPace(
  locations: LocationObject[],
  startDate: Date | null,
  endDate: Date
): number {
  if (locations.length < 2 || !startDate || !endDate) {
    return 0;
  }

  const totalDistance = getTotalDistanceInKilometers(locations);

  const avgPaceInMinutes =
    differenceInMinutes(endDate, startDate) / totalDistance;

  return avgPaceInMinutes;
}
