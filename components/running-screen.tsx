import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, useColorScheme } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import Button from './button';
import { darkTheme, lightTheme } from '../lib/theme';
import {
  completeRun,
  createRun,
  getOverview,
  getRuns,
  insertLocation,
} from '../lib/query';
import {
  getAvgPace,
  getPace,
  getTotalDistanceInKilometersString,
} from '../lib/location';
import { applyHexOpacity, msToMinutesAndSeconds } from '../lib/utils';
import { useOverviewStore, useRunStore } from '../lib/store';

interface RunningScreenProps {
  setIsRunning: (isRunning: boolean) => void;
}

export default function RunningScreen({ setIsRunning }: RunningScreenProps) {
  const colorScheme = useColorScheme();

  const [locations, setLocations] = useState<Location.LocationObject[]>([]);

  const [runId, setRunId] = useState<number | null>(null);

  const addNewestRun = useRunStore((state) => state.addNewestRun);
  const interval = useOverviewStore((state) => state.interval);
  const setOverview = useOverviewStore((state) => state.setOverview);

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

  /**
   * Starts tracking the user's location and updates the locations state.
   * @param runId The ID of the run to associate the locations with.
   */
  async function startTracking(runId: number) {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setIsRunning(false);
      return;
    }

    // subscribe to location updates
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1000, // Minimum time between updates (in ms)
        distanceInterval: 5, // Minimum distance (in meters) to trigger an update
      },
      async (location) => {
        setLocations((prevLocations) => [...prevLocations, location]);
        insertLocation(runId, location);
        console.log(
          'Location updated:',
          location.coords.latitude,
          location.coords.longitude,
          location.coords.altitude
        );
      },
      (error) => {
        console.error('Error watching position:', error);
      }
    );

    subscriptionRef.current = subscription;
  }

  /**
   * Stops tracking the user's location, completes the run, and updates the overview.
   */
  async function stopTracking() {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;

    if (runId !== null) {
      const res = await completeRun(runId);

      if (!res) {
        return;
      }

      const resRun = await getRuns(0);
      const resOverview = await getOverview(interval);

      if (resRun.runs.length > 0) {
        const newestRun = resRun.runs[0];

        addNewestRun(newestRun);
      }

      if (resOverview) {
        setOverview(resOverview);
      }
    }

    setLocations([]);
  }

  /**
   * Pauses the tracking of the user's location.
   */
  function pauseTracking() {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
      setIsPaused(true);
    }
  }

  /**
   * Resumes tracking the user's location if a run is in progress.
   */
  function resumeTracking() {
    if (runId !== null) {
      startTracking(runId);
      setIsPaused(false);
    }
  }

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;

  const themeContainerStyle =
    colorScheme === 'light'
      ? styles.lightThemeContainer
      : styles.darkThemeContainer;

  const themeDescriptionStyle =
    colorScheme === 'light'
      ? styles.lightThemeDescription
      : styles.darkThemeDescription;

  const themeKmTextStyle =
    colorScheme === 'light' ? styles.lightThemeKmText : styles.darkThemeKmText;

  const themeKmDescriptionStyle =
    colorScheme === 'light'
      ? styles.lightThemeKmDescription
      : styles.darkThemeKmDescription;

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <View style={styles.anotherContainer}>
        <View style={styles.andAnotherContainer}>
          <View style={styles.statCard}>
            <Text style={[styles.text, themeTextStyle]}>
              {msToMinutesAndSeconds(timer)}
            </Text>
            <Text style={[styles.description, themeDescriptionStyle]}>
              Time
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.text, themeTextStyle]}>
              {getAvgPace(locations)}
            </Text>
            <Text style={[styles.description, themeDescriptionStyle]}>
              Avg. Pace
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.text, themeTextStyle]}>
              {getPace(locations)}
            </Text>
            <Text style={[styles.description, themeDescriptionStyle]}>
              Pace
            </Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.kmText, themeKmTextStyle]}>
            {getTotalDistanceInKilometersString(locations)}
          </Text>
          <Text style={[styles.kmDescription, themeKmDescriptionStyle]}>
            Kilometers
          </Text>
        </View>
      </View>
      <View style={styles.pauseContainer}>
        <Button
          variant='secondary'
          text={isPaused ? 'Resume' : 'Pause'}
          style={styles.buttonStyles}
          textStyle={styles.buttonTextStyles}
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
            variant='destructive'
            text='Stop'
            style={styles.buttonStyles}
            textStyle={styles.buttonTextStyles}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  anotherContainer: {
    height: '60%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  andAnotherContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  buttonStyles: {
    width: 100,
    height: 40,
  },
  buttonTextStyles: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 'bold',
  },
  pauseContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
    width: '100%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightThemeContainer: {
    backgroundColor: lightTheme.primary,
  },
  darkThemeContainer: {
    backgroundColor: darkTheme.primary,
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  lightThemeText: {
    color: lightTheme.background,
  },
  darkThemeText: {
    color: darkTheme.foreground,
  },
  description: {
    fontSize: 20,
    fontWeight: '600',
  },
  lightThemeDescription: {
    color: applyHexOpacity(lightTheme.background, 60),
  },
  darkThemeDescription: {
    color: applyHexOpacity(darkTheme.foreground, 60),
  },
  kmText: {
    fontSize: 70,
    marginTop: 50,
    fontWeight: 'bold',
  },
  lightThemeKmText: {
    color: lightTheme.foreground,
  },
  darkThemeKmText: {
    color: darkTheme.background,
  },
  kmDescription: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  lightThemeKmDescription: {
    color: applyHexOpacity(lightTheme.foreground, 60),
  },
  darkThemeKmDescription: {
    color: applyHexOpacity(darkTheme.background, 60),
  },
});
