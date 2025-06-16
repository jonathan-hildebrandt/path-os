import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  useColorScheme,
  ViewStyle,
} from 'react-native';
import { darkTheme, lightTheme, radius } from '../theme';
import { applyHexOpacity } from '../utils';

type ButtonProps = {
  onPress: () => void;
  text: string;
  disabled?: boolean;
  style?: ViewStyle;
  invalid?: boolean;
  textStyle?: TextStyle;
  variant?:
    | 'default'
    | 'dark'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
};

export default function Button({
  onPress,
  text,
  disabled,
  style,
  invalid,
  textStyle,
  variant = 'default',
  size = 'default',
}: ButtonProps) {
  const colorScheme = useColorScheme();

  const themePressableStyle = StyleSheet.flatten([
    styles.pressable,
    sizeStyles[size],
    colorScheme === 'light'
      ? variantLightStyles[variant]
      : variantDarkStyles[variant],
  ]);

  const themePressablePressedStyle = StyleSheet.flatten([
    sizeStyles[size],
    colorScheme === 'light'
      ? pressedVariantLightStyles[variant]
      : pressedVariantDarkStyles[variant],
  ]);

  const themeTextStyle = StyleSheet.flatten([
    styles.text,
    colorScheme === 'light'
      ? textVariantLightStyles[variant]
      : textVariantDarkStyles[variant],
  ]);

  const invalidStyle = StyleSheet.flatten([
    colorScheme === 'light' ? invalidStyles.light : invalidStyles.dark,
  ]);

  const themeTextPressedStyle = StyleSheet.flatten([
    colorScheme === 'light'
      ? textVariantPressableLightStyles[variant]
      : textVariantPressableDarkStyles[variant],
  ]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.pressable,
        themePressableStyle,
        pressed && !disabled && themePressablePressedStyle,
        invalid && invalidStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPress={!disabled ? onPress : undefined}>
      {({ pressed }) => (
        <Text
          style={[
            styles.text,
            themeTextStyle,
            textStyle,
            pressed && !disabled && themeTextPressedStyle,
          ]}>
          {text}
        </Text>
      )}
    </Pressable>
  );
}

// light styles
const variantLightStyles = StyleSheet.create({
  default: {
    backgroundColor: lightTheme.primary,
  },
  dark: {
    backgroundColor: lightTheme.foreground,
  },
  destructive: {
    backgroundColor: lightTheme.destructive,
  },
  outline: {
    borderWidth: 1,
    borderColor: lightTheme.border,
    backgroundColor: lightTheme.background,
  },
  secondary: {
    backgroundColor: lightTheme.secondary,
  },
  ghost: {},
  link: {},
});

const pressedVariantLightStyles = StyleSheet.create({
  default: {
    backgroundColor: applyHexOpacity(lightTheme.primary, 90),
  },
  dark: {
    backgroundColor: applyHexOpacity(lightTheme.foreground, 90),
  },
  destructive: {
    backgroundColor: applyHexOpacity(lightTheme.destructive, 90),
  },
  outline: {
    backgroundColor: lightTheme.accent,
  },
  secondary: {
    backgroundColor: applyHexOpacity(lightTheme.secondary, 80),
  },
  ghost: {
    backgroundColor: lightTheme.accent,
  },
  link: {},
});

// text light styles
const textVariantLightStyles = StyleSheet.create({
  default: {
    color: lightTheme.primaryForeground,
  },
  dark: {
    color: lightTheme.background,
  },
  destructive: {
    color: lightTheme.primaryForeground,
  },
  outline: {
    color: lightTheme.foreground,
  },
  secondary: {
    color: lightTheme.secondaryForeground,
  },
  ghost: {
    color: lightTheme.foreground,
  },
  link: {
    color: lightTheme.primary,
  },
});

const textVariantPressableLightStyles = StyleSheet.create({
  default: {},
  destructive: {},
  dark: {},
  outline: {
    color: lightTheme.accentForeground,
  },
  secondary: {},
  ghost: {},
  link: {
    color: applyHexOpacity(lightTheme.primary, 90),
  },
});

// dark styles
const variantDarkStyles = StyleSheet.create({
  default: {
    backgroundColor: darkTheme.primary,
  },
  dark: {
    backgroundColor: darkTheme.background,
  },
  destructive: {
    backgroundColor: applyHexOpacity(darkTheme.destructive, 50),
  },
  outline: {
    borderWidth: 1,
    borderColor: darkTheme.input,
    backgroundColor: applyHexOpacity(darkTheme.input, 30),
  },
  secondary: {
    backgroundColor: darkTheme.secondary,
  },
  ghost: {},
  link: {},
});

const pressedVariantDarkStyles = StyleSheet.create({
  default: {
    backgroundColor: applyHexOpacity(darkTheme.primary, 90),
  },
  dark: {
    backgroundColor: applyHexOpacity(darkTheme.background, 90),
  },
  destructive: {
    backgroundColor: applyHexOpacity(darkTheme.destructive, 40),
  },
  outline: {
    backgroundColor: darkTheme.accent,
  },
  secondary: {
    backgroundColor: applyHexOpacity(darkTheme.secondary, 80),
  },
  ghost: {
    backgroundColor: applyHexOpacity(darkTheme.accent, 50),
  },
  link: {},
});

// text dark styles
const textVariantDarkStyles = StyleSheet.create({
  default: {
    color: darkTheme.primaryForeground,
  },
  dark: {
    color: darkTheme.foreground,
  },
  destructive: {
    color: '#fff',
  },
  outline: {
    color: darkTheme.foreground,
  },
  secondary: {
    color: darkTheme.secondaryForeground,
  },
  ghost: {
    color: darkTheme.foreground,
  },
  link: {
    color: darkTheme.primary,
    textDecorationStyle: 'solid',
    textDecorationColor: darkTheme.primary,
  },
});

const textVariantPressableDarkStyles = StyleSheet.create({
  default: {},
  dark: {},
  destructive: {},
  outline: {
    color: darkTheme.accentForeground,
  },
  secondary: {},
  ghost: {},
  link: {
    color: applyHexOpacity(darkTheme.primary, 90),
  },
});

// styles
const styles = StyleSheet.create({
  text: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
  },
  disabled: {
    opacity: 0.5,
  },
  pressable: {
    borderRadius: radius,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// invalid styles
const invalidStyles = StyleSheet.create({
  light: {
    outlineColor: applyHexOpacity(lightTheme.destructive, 20),
    borderColor: lightTheme.destructive,
  },
  dark: {
    outlineColor: applyHexOpacity(darkTheme.destructive, 40),
    borderColor: darkTheme.destructive,
  },
});

// size styles
const sizeStyles = StyleSheet.create({
  default: {
    height: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sm: {
    height: 32,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  lg: {
    height: 44,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  icon: {
    width: 36,
    height: 36,
  },
});
