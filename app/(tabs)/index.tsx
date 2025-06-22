import {
  StyleSheet,
  useColorScheme,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import { darkTheme, lightTheme, radius } from '../../lib/theme';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import StartScreen from '../../components/start-screen';
import RunningScreen from '../../components/running-screen';
import { useNavigation } from 'expo-router';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const [mode, setMode] = useState<'distance' | 'time'>('distance');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [distance, setDistance] = useState<string>('');
  const [time, setTime] = useState<string>('');

  // Dynamically hide tab bar
  useEffect(() => {
    navigation.setOptions({});
  }, [isRunning]);

  const themeSafeAreaViewStyle =
    colorScheme === 'light'
      ? styles.lightSafeAreaView
      : styles.darkSafeAreaView;

  const themeNormalBackgroundStyle =
    colorScheme === 'light'
      ? styles.lightNormalBackground
      : styles.darkNormalBackground;

  const themePrimaryBackgroundStyle =
    colorScheme === 'light'
      ? styles.lightPrimaryBackground
      : styles.darkPrimaryBackground;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView
        style={[
          styles.safeAreaView,
          themeSafeAreaViewStyle,
          isRunning ? themePrimaryBackgroundStyle : themeNormalBackgroundStyle,
        ]}>
        <StartScreen
          mode={mode}
          setMode={setMode}
          distance={distance}
          setDistance={setDistance}
          time={time}
          setTime={setTime}
          setIsRunning={setIsRunning}
        />
        {isRunning && (
          <View style={StyleSheet.absoluteFill}>
            <RunningScreen setIsRunning={setIsRunning} />
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: radius,
  },
  lightSafeAreaView: {
    backgroundColor: lightTheme.background,
  },
  darkSafeAreaView: {
    backgroundColor: darkTheme.background,
  },
  lightNormalBackground: {
    backgroundColor: lightTheme.background,
  },
  darkNormalBackground: {
    backgroundColor: darkTheme.background,
  },
  lightPrimaryBackground: {
    backgroundColor: lightTheme.primary,
  },
  darkPrimaryBackground: {
    backgroundColor: darkTheme.primary,
  },
});
