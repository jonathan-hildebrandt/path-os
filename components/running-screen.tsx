import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, useColorScheme } from 'react-native';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {
  getAvgPace,
  getPace,
  getTotalDistanceInKilometers,
  msToMinutesAndSeconds,
} from '../lib/location';
import Button from './button';
import { darkTheme, lightTheme, radius } from '../lib/theme';
import { completeRun, createRun, insertLocation } from '../lib/query';

//TODO pause / resume functionality
//TODO fix display of stats

interface RunningScreenProps {
  setIsRunning: Dispatch<SetStateAction<boolean>>;
}

export default function RunningScreen({ setIsRunning }: RunningScreenProps) {
  const colorScheme = useColorScheme();

  const [locations, setLocations] = useState<Location.LocationObject[]>([]);

  const [runId, setRunId] = useState<number | null>(null);

  const [timer, setTimer] = useState(0);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  // Create a new run when the component mounts
  useEffect(() => {
    async function init() {
      const newRunId = await createRun();

      setRunId(newRunId);

      startTracking(newRunId);
    }

    init();

    return () => {
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
      setLocations([]);
    };
  }, []);

  // Start a timer to track the elapsed time since the component mounted
  useEffect(() => {
    const startTime = Date.now();

    const updateElapsedTime = () => {
      setTimer(Date.now() - startTime);
    };

    const interval = setInterval(updateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, []);

  async function startTracking(runId: number) {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 5,
      },
      async (location) => {
        setLocations((prevLocations) => [...prevLocations, location]);
        insertLocation(runId, location);
        console.log(
          'Location updated:',
          location.coords.latitude,
          location.coords.longitude
        );
      },
      (error) => {
        console.error('Error watching position:', error);
        setErrorMsg(
          error ?? 'An unknown error occurred while tracking location'
        );
      }
    );

    subscriptionRef.current = subscription;
  }

  function stopTracking() {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;

    if (runId !== null) {
      completeRun(runId);
    }

    setLocations([]);
  }

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  return (
    <View style={[styles.container, themeContainerStyle]}>
      {errorMsg && (
        <Text style={[styles.text, themeTextStyle]}>Error: {errorMsg}</Text>
      )}
      <Text style={[styles.text, themeTextStyle]}>
        Kilometers: {getTotalDistanceInKilometers(locations).toFixed(2)}
      </Text>
      {locations[0] && (
        <Text style={[styles.text, themeTextStyle]}>
          Time: {msToMinutesAndSeconds(timer)}
        </Text>
      )}
      <Text style={[styles.text, themeTextStyle]}>
        Avg. Pace: {getAvgPace(locations).toFixed(2)}
      </Text>
      <Text style={[styles.text, themeTextStyle]}>
        Pace: {getPace(locations).toFixed(2)}
      </Text>
      {subscriptionRef.current && (
        <Button
          variant='dark'
          text='Stop'
          onPress={() => {
            stopTracking();

            setIsRunning(false);
          }}
        />
      )}
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: radius,
  },
  lightContainer: {
    backgroundColor: lightTheme.background,
  },
  darkContainer: {
    backgroundColor: darkTheme.background,
  },
  lightThemeText: {
    color: lightTheme.foreground,
    borderColor: lightTheme.border,
  },
  darkThemeText: {
    color: darkTheme.foreground,
    borderColor: darkTheme.border,
  },
});
