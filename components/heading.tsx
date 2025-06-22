import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { darkTheme, lightTheme } from '../lib/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Run } from '../lib/model';

type HeadingProps = {
  run: Run | null;
};

export default function Heading({ run }: HeadingProps) {
  const colorScheme = useColorScheme();

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightText : styles.darkText;

  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
      <Ionicons
        name='map-outline'
        size={30}
        color={
          colorScheme === 'light' ? lightTheme.foreground : darkTheme.foreground
        }
      />
      <Text style={[styles.text, themeTextStyle]}>{run?.date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'center',
  },
  lightText: {
    color: lightTheme.foreground,
  },
  darkText: {
    color: darkTheme.foreground,
  },
});
