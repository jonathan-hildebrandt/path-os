import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { darkTheme, lightTheme } from '../lib/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Run } from '../lib/model';
import Button from './button';
import { router } from 'expo-router';

type HeadingProps = {
  run: Run | null;
};

export default function Heading({ run }: HeadingProps) {
  const colorScheme = useColorScheme();

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightText : styles.darkText;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Ionicons
          name='map-outline'
          size={30}
          color={
            colorScheme === 'light'
              ? lightTheme.foreground
              : darkTheme.foreground
          }
        />
        <Text style={[styles.text, themeTextStyle]}>{run?.date}</Text>
      </View>
      <Button
        size='sm'
        variant='destructive'
        text='Delete Run'
        onPress={() => {
          // Handle delete run logic here
          console.log('Delete run pressed');

          console.log('Delete it from Zustand Store');

          router.back();
        }}
      />
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
