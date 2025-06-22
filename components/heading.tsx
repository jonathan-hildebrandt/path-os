import { StyleSheet, View } from 'react-native';
import { darkTheme, lightTheme } from '../lib/theme';

export default function Heading() {
  return <View></View>;
}

const styles = StyleSheet.create({
  text: {},
  lightText: {
    color: lightTheme.foreground,
  },
  darkText: {
    color: darkTheme.foreground,
  },
});
