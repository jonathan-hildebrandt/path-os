import { LocationObject } from 'expo-location';
import { getDistanceInMeter } from './utils';

/**
 * Calculates the total distance in kilometers from an array of LocationObjects.
 * @param locations - An array of LocationObjects representing the path taken.
 * @returns The total distance in kilometers.
 */
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

  const totalDistanceInKilometer = totalDistanceInMeter / 1000;

  return totalDistanceInKilometer;
}

/**
 * Formats the total distance in kilometers as a string with two decimal places.
 * @param locations - An array of LocationObjects representing the path taken.
 * @returns A string representing the total distance in kilometers, formatted with two decimal places.
 */
export function getTotalDistanceInKilometersString(
  locations: LocationObject[]
): string {
  const totalDistance = getTotalDistanceInKilometers(locations);

  if (totalDistance === 0) {
    return '0,00';
  }

  const formattedDistance = totalDistance.toFixed(2).replace('.', ',');

  return formattedDistance;
}

/**
 * Calculates the pace in minutes per kilometer between the last two locations.
 * @param locations - An array of LocationObjects representing the path taken.
 * @returns The pace in minutes per kilometer.
 */
export function getPace(locations: LocationObject[]): string {
  if (locations.length < 2) {
    return '00:00';
  }

  const locationOne = locations[locations.length - 2];
  const locationTwo = locations[locations.length - 1];

  if (!locationOne || !locationTwo) {
    return '00:00';
  }

  const distanceInMeters = getDistanceInMeter(locationOne, locationTwo);

  if (distanceInMeters === 0) return '00:00';

  const differenceInMinutes =
    Math.abs(locationTwo.timestamp - locationOne.timestamp) / 1000 / 60;

  const pace = differenceInMinutes / (distanceInMeters / 1000);

  const formattedPace =
    Math.floor(pace).toString().padStart(2, '0') +
    ':' +
    Math.round((pace % 1) * 60)
      .toString()
      .padStart(2, '0');

  return formattedPace;
}

/**
 * Calculates the average pace in minutes per kilometer from an array of LocationObjects.
 * @param locations - An array of LocationObjects representing the path taken.
 * @returns The average pace in minutes per kilometer.
 */
export function getAvgPace(locations: LocationObject[]): string {
  if (locations.length < 2) {
    return '00:00';
  }

  const totalDistance = getTotalDistanceInKilometers(locations);

  if (totalDistance === 0) {
    return '00:00';
  }

  const differenceInMinutes =
    Math.abs(
      locations[0].timestamp - locations[locations.length - 1].timestamp
    ) /
    1000 /
    60;

  const avgPaceInMinutes = differenceInMinutes / totalDistance;

  return `${Math.floor(avgPaceInMinutes)
    .toString()
    .padStart(2, '0')}:${Math.round((avgPaceInMinutes % 1) * 60)
    .toString()
    .padStart(2, '0')}`;
}
