import {
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  useColorScheme,
  ViewStyle,
} from 'react-native';
import { darkTheme, lightTheme, radius } from '../theme';
import { Dispatch, SetStateAction, useState } from 'react';
import { applyHexOpacity } from '../utils';

type InputProps = {
  value: string;
  invalid?: boolean;
  setValue: Dispatch<SetStateAction<string>>;
  textAlign?: 'left' | 'center' | 'right';
  placeholder?: string;
  type: 'text' | 'email' | 'password' | 'number' | 'decimal' | 'phone';
  maxLength?: number;
  style?: ViewStyle;
};

const inputTypeMap: Record<
  InputProps['type'],
  { keyboardType: KeyboardTypeOptions; secureTextEntry: boolean }
> = {
  text: { keyboardType: 'default', secureTextEntry: false },
  email: { keyboardType: 'email-address', secureTextEntry: false },
  password: { keyboardType: 'default', secureTextEntry: true },
  number: { keyboardType: 'number-pad', secureTextEntry: false },
  decimal: { keyboardType: 'decimal-pad', secureTextEntry: false },
  phone: { keyboardType: 'phone-pad', secureTextEntry: false },
};

export default function Input({
  value,
  setValue,
  placeholder,
  textAlign = 'left',
  type,
  invalid = false,
  style,
  maxLength,
}: InputProps) {
  const colorScheme = useColorScheme();

  const [focused, setFocused] = useState(false);

  const themeInputStyle =
    colorScheme === 'light' ? styles.lightInput : styles.darkInput;
  const themeFocusedStyle =
    colorScheme === 'light' ? styles.lightFocused : styles.darkFocused;
  const textAlignStyle =
    textAlign === 'center'
      ? styles.textAlignCenter
      : textAlign === 'right'
      ? styles.textAlignRight
      : styles.textAlignLeft;

  const themeInvalidStyle =
    colorScheme === 'light' ? styles.lightInvalid : styles.darkInvalid;

  const themeInvalidFocusedStyle =
    colorScheme === 'light'
      ? styles.invalidFocusedLight
      : styles.invalidFocusedDark;

  const inputType = inputTypeMap[type];

  return (
    <TextInput
      style={[
        styles.input,
        themeInputStyle,
        invalid && themeInvalidStyle,
        focused && !invalid && themeFocusedStyle,
        focused && invalid && themeInvalidFocusedStyle,
        textAlignStyle,
        style,
      ]}
      maxLength={maxLength}
      placeholderTextColor={
        colorScheme === 'light'
          ? lightTheme.mutedForeground
          : darkTheme.mutedForeground
      }
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onChangeText={(text) => setValue(text)}
      value={value}
      placeholder={placeholder}
      {...inputType}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 10,
    width: 150,
    borderRadius: radius,
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  textAlignLeft: {
    textAlign: 'left',
  },
  textAlignRight: {
    textAlign: 'right',
  },
  lightFocused: {
    outlineColor: applyHexOpacity(lightTheme.ring, 50),
    borderColor: lightTheme.ring,
    outlineWidth: 2,
  },
  darkFocused: {
    outlineColor: applyHexOpacity(darkTheme.ring, 50),
    borderColor: darkTheme.ring,
    outlineWidth: 2,
  },
  lightInput: {
    backgroundColor: 'transparent',
    color: lightTheme.foreground,
    borderWidth: 1,
    borderColor: lightTheme.input,
  },
  darkInput: {
    backgroundColor: 'transparent',
    color: darkTheme.foreground,
    borderWidth: 1,
    borderColor: darkTheme.input,
  },
  lightInvalid: {
    backgroundColor: applyHexOpacity(lightTheme.destructive, 10),
    borderColor: lightTheme.destructive,
  },
  darkInvalid: {
    backgroundColor: applyHexOpacity(darkTheme.destructive, 10),
    borderColor: darkTheme.destructive,
  },
  invalidFocusedLight: {
    outlineColor: applyHexOpacity(lightTheme.destructive, 50),
    borderColor: lightTheme.destructive,
    outlineWidth: 2,
  },
  invalidFocusedDark: {
    outlineColor: applyHexOpacity(darkTheme.destructive, 50),
    borderColor: darkTheme.destructive,
    outlineWidth: 2,
  },
});
