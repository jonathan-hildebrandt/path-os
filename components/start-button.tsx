import { Pressable, StyleSheet, Text, useColorScheme } from 'react-native';
import { darkTheme, lightTheme, radius } from '../theme';
import { applyHexOpacity } from '../utils';

type StartButtonProps = {
  onPress: () => void;
};

export default function StartButton({ onPress }: StartButtonProps) {
  const colorScheme = useColorScheme();

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightText : styles.darkText;
  const themePressableStyle =
    colorScheme === 'light' ? styles.lightPressable : styles.darkPressable;
  const themePressablePressedStyle =
    colorScheme === 'light'
      ? styles.lightPressablePressed
      : styles.darkPressablePressed;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.pressable,
        themePressableStyle,
        pressed && themePressablePressedStyle,
      ]}
      onPress={onPress}>
      <Text style={[styles.text, themeTextStyle]}>Start</Text>
    </Pressable>
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
