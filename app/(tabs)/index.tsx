import {
  StyleSheet,
  useColorScheme,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import { darkTheme, lightTheme } from '../../lib/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import StartScreen from '../../components/start-screen';
import RunningScreen from '../../components/running-screen';
import { useRunStore } from '../../lib/store';

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  const isRunning = useRunStore((state) => state.isRunning);
  const setIsRunning = useRunStore((state) => state.setIsRunning);

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
        <StartScreen setIsRunning={setIsRunning} />
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
