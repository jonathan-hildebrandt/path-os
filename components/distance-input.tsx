import {
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { darkTheme, lightTheme, radius } from '../theme';
import { Dispatch, SetStateAction } from 'react';
import { z } from 'zod/v4';

type DistanceInputProps = {
  distance: string;
  setDistance: Dispatch<SetStateAction<string>>;
};

export default function DistanceInput({
  distance,
  setDistance,
}: DistanceInputProps) {
  const colorScheme = useColorScheme();

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightText : styles.darkText;
  const themeInputStyle =
    colorScheme === 'light' ? styles.lightInput : styles.darkInput;

  return (
    <View style={[styles.container]}>
      <TextInput
        style={[styles.input, themeInputStyle]}
        maxLength={3}
        placeholderTextColor={
          colorScheme === 'light'
            ? lightTheme.mutedForeground
            : darkTheme.mutedForeground
        }
        onChangeText={(text) => {
          const parsedText = z.string().regex(/^\d+$/).safeParse(text);

          if (parsedText.success) {
            setDistance(parsedText.data);
          } else if (text === '') {
            setDistance('');
          }
        }}
        value={distance.toString()}
        placeholder='Enter distance (km)'
        keyboardType='numeric'
      />
      <Text style={[styles.text, themeTextStyle]}>Distance: {distance} km</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    padding: 10,
    width: 150,
    borderRadius: radius,
  },
  text: {
    fontWeight: 'bold',
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
  lightText: {
    color: lightTheme.foreground,
  },
  darkText: {
    color: darkTheme.foreground,
  },
});
