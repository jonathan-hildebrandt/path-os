import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, useColorScheme } from 'react-native';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Button from './button';
import { darkTheme, lightTheme, radius } from '../lib/theme';
import { completeRun, createRun, insertLocation } from '../lib/query';
import {
  getAvgPace,
  getPace,
  getTotalDistanceInKilometersString,
} from '../lib/location';
import { msToMinutesAndSeconds } from '../lib/utils';

//TODO fix positioning

interface RunningScreenProps {
  setIsRunning: Dispatch<SetStateAction<boolean>>;
}

export default function RunningScreen({ setIsRunning }: RunningScreenProps) {
  const colorScheme = useColorScheme();

  const [locations, setLocations] = useState<Location.LocationObject[]>([]);

  const [runId, setRunId] = useState<number | null>(null);

  const [timer, setTimer] = useState(0);

  const [isPaused, setIsPaused] = useState(false);

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

  // Start a timer to track the elapsed time since the component mounted or resumed
  // If the tracking is paused, the timer will not increment
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  async function startTracking(runId: number) {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setIsRunning(false);
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

  function pauseTracking() {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
      setIsPaused(true);
    }
  }

  function resumeTracking() {
    if (runId !== null) {
      startTracking(runId);
      setIsPaused(false);
    }
  }

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;

  return (
    <View style={[styles.container]}>
      <View
        style={{
          flex: 1,
          gap: 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
            paddingHorizontal: 20,
          }}>
          <Text style={[styles.text, themeTextStyle]}>
            Time: {msToMinutesAndSeconds(timer)}
          </Text>
          <Text style={[styles.text, themeTextStyle]}>
            Avg. Pace: {getAvgPace(locations)}
          </Text>
          <Text style={[styles.text, themeTextStyle]}>
            Pace: {getPace(locations)}
          </Text>
        </View>

        <Text style={[styles.text, themeTextStyle]}>
          Kilometers: {getTotalDistanceInKilometersString(locations)}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          gap: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button
          variant='default'
          text={isPaused ? 'Resume' : 'Pause'}
          style={{ width: 100, height: 40 }}
          textStyle={{ fontSize: 18, lineHeight: 22, fontWeight: 'bold' }}
          onPress={() => {
            if (isPaused) {
              resumeTracking();
            } else {
              pauseTracking();
            }
          }}
        />
        {isPaused && (
          <Button
            variant='dark'
            text='Stop'
            style={{ width: 100, height: 40 }}
            textStyle={{ fontSize: 18, lineHeight: 22, fontWeight: 'bold' }}
            onPress={() => {
              stopTracking();

              setIsRunning(false);
            }}
          />
        )}
      </View>
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
  lightThemeText: {
    color: lightTheme.foreground,
    borderColor: lightTheme.border,
  },
  darkThemeText: {
    color: darkTheme.foreground,
    borderColor: darkTheme.border,
  },
});
