import { LocationObject } from 'expo-location';
import { UncompletedLocation } from './model';

export function applyHexOpacity(hex: string, alphaPercent: number): string {
  const alpha = Math.round((alphaPercent / 100) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();

  return `${hex}${alpha}`;
}

export function convertLocationObjectToLocation(
  location: LocationObject
): UncompletedLocation {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    altitudeInMeters: location.coords.altitude,
    timestamp: location.timestamp,
  };
}
