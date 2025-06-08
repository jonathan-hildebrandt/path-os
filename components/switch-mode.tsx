import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { darkTheme, lightTheme, radius } from '../theme';
import { applyHexOpacity } from '../utils';
import { Dispatch, SetStateAction } from 'react';

type StartButtonProps = {
  setMode: Dispatch<SetStateAction<'distance' | 'time'>>;
  mode: 'distance' | 'time';
};

export default function SwitchMode({ mode, setMode }: StartButtonProps) {
  const colorScheme = useColorScheme();

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightText : styles.darkText;
  const themePressableStyle =
    colorScheme === 'light' ? styles.lightPressable : styles.darkPressable;
  const themePressablePressedStyle =
    colorScheme === 'light'
      ? styles.lightPressablePressed
      : styles.darkPressablePressed;

  function handleSwitch(mode: 'distance' | 'time') {
    setMode(mode);
    console.log(`Switched to ${mode} mode`);
  }

  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Pressable
        style={({ pressed }) => [
          styles.pressable,
          themePressableStyle,
          pressed && themePressablePressedStyle,
        ]}
        onPress={() => handleSwitch('distance')}>
        <Text style={[styles.text, themeTextStyle]}>Distance</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.pressable,
          themePressableStyle,
          pressed && themePressablePressedStyle,
        ]}
        onPress={() => handleSwitch('time')}>
        <Text style={[styles.text, themeTextStyle]}>Time</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    padding: 10,
    borderRadius: radius,
  },
  text: {
    fontWeight: 'bold',
  },
  lightPressable: {
    backgroundColor: lightTheme.primary,
  },
  darkPressable: {
    backgroundColor: darkTheme.primary,
  },
  lightPressablePressed: {
    backgroundColor: applyHexOpacity(lightTheme.primary, 90),
  },
  darkPressablePressed: {
    backgroundColor: applyHexOpacity(darkTheme.primary, 90),
  },
  lightText: {
    color: lightTheme.primaryForeground,
  },
  darkText: {
    color: darkTheme.primaryForeground,
  },
});
