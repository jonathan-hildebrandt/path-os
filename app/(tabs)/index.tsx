import {
  StyleSheet,
  useColorScheme,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { darkTheme, lightTheme, radius } from '../../lib/theme';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import StartScreen from '../../components/start-screen';
import RunningScreen from '../../components/running-screen';

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  const [mode, setMode] = useState<'Distance' | 'Time'>('Distance');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [distance, setDistance] = useState<string>('');
  const [time, setTime] = useState<string>('');

  const themeSafeAreaViewStyle =
    colorScheme === 'light'
      ? styles.lightSafeAreaView
      : styles.darkSafeAreaView;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.safeAreaView, themeSafeAreaViewStyle]}>
        {isRunning ? (
          <RunningScreen setIsRunning={setIsRunning} />
        ) : (
          <StartScreen
            mode={mode}
            setMode={setMode}
            distance={distance}
            setDistance={setDistance}
            time={time}
            setTime={setTime}
            setIsRunning={setIsRunning}
          />
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
