import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Run } from '../lib/model';
import { darkTheme, lightTheme } from '../lib/theme';

type SplitsProps = {
  run: Run | null;
};

export default function Splits({ run }: SplitsProps) {
  const colorScheme = useColorScheme();

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightText : styles.darkText;

  return (
    <View>
      <Text style={[styles.heading, themeTextStyle]}>Splits</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  lightText: {
    color: lightTheme.foreground,
  },
  darkText: {
    color: darkTheme.foreground,
  },
});
