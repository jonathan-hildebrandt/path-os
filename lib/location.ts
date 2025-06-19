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

export function getPace(locations: LocationObject[]): number {
  const locationOne = locations.at(-2);
  const locationTwo = locations.at(-1);

  if (!locationOne || !locationTwo) {
    return 0;
  }

  const distanceInMeters = getDistanceInMeter(locationOne, locationTwo);

  const startDate = new Date(locationOne.timestamp);
  const endDate = new Date(locationTwo.timestamp);

  const timeInMinutes = differenceInMinutes(startDate, endDate);

  const pace = timeInMinutes / (distanceInMeters / 1000);

  return pace;
}

export function getAvgPace(locations: LocationObject[]): number {
  if (locations.length < 2) {
    return 0;
  }

  const totalDistance = getTotalDistanceInKilometers(locations);

  const startDate = new Date(locations[0].timestamp);
  const endDate = new Date(locations[locations.length - 1].timestamp);

  const avgPaceInMinutes =
    differenceInMinutes(endDate, startDate) / totalDistance;

  return avgPaceInMinutes;
}

export function msToMinutesAndSeconds(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Number(((ms % 60000) / 1000).toFixed(0));
  return (
    (minutes < 10 ? '0' : '') +
    minutes +
    ':' +
    (seconds < 10 ? '0' : '') +
    seconds
  );
}
