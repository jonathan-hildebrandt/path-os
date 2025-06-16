import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, useColorScheme } from 'react-native';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { intervalToDuration } from 'date-fns';
import { getAvgPace, getTotalDistanceInKilometers } from '../calculate';
import Button from './button';
import { darkTheme, lightTheme, radius } from '../theme';

interface RunningScreenProps {
  setIsRunning: Dispatch<SetStateAction<boolean>>;
}

export default function RunningScreen({ setIsRunning }: RunningScreenProps) {
  const colorScheme = useColorScheme();

  const [locations, setLocations] = useState<Location.LocationObject[]>([]);

  const [startDate, setStartDate] = useState<Date | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [subscription, setSubscription] =
    useState<Location.LocationSubscription | null>(null);

  useEffect(() => {
    startTracking();
    setStartDate(new Date());
    startCounting();

    return () => {
      if (subscription) {
        subscription.remove();
      }
      setSubscription(null);
      setLocations([]);
      setStartDate(null);
    };
  }, []);

  const startCounting = () => {
    const interval = setInterval(() => {
      if (startDate) {
        const elapsed = intervalToDuration({
          start: startDate,
          end: new Date(),
        });
        console.log('Elapsed time:', elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        // distanceInterval: 5,
        timeInterval: 1000,
      },
      (location) => {
        setLocations((prevLocations) => [...prevLocations, location]);
        console.log('New location:', location);
      },
      (error) => {
        console.error('Error watching position:', error);
        setErrorMsg(error);
      }
    );

    setSubscription(subscription);
  };

  function stopTracking() {
    if (subscription) {
      subscription.remove();
    }

    setSubscription(null);
    setLocations([]);
    setStartDate(null);
  }

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <Text style={[styles.text, themeTextStyle]}>
        Total Distance: {getTotalDistanceInKilometers(locations).toFixed(2)} km
      </Text>
      <Text style={[styles.text, themeTextStyle]}>
        {locations[0] ? (
          <Text style={[styles.text, themeTextStyle]}>
            Time Elapsed:{' '}
            {JSON.stringify(
              intervalToDuration({
                start: new Date(locations[0].timestamp),
                end: new Date(),
              })
            )}
          </Text>
        ) : (
          <Text style={[styles.text, themeTextStyle]}>Time Elapsed: --:--</Text>
        )}
      </Text>
      <Text style={[styles.text, themeTextStyle]}>
        Average Pace: {getAvgPace(locations, startDate, new Date()).toFixed(2)}{' '}
        min/km
      </Text>
      {subscription && (
        <Button
          text='Stop Tracking'
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
