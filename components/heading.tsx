import { Alert, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { darkTheme, lightTheme } from '../lib/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Run } from '../lib/model';
import Button from './button';
import { router } from 'expo-router';
import { deleteRun, getOverview } from '../lib/query';
import { useOverviewStore, useRunStore } from '../lib/store';

type HeadingProps = {
  run: Run | null;
};

export default function Heading({ run }: HeadingProps) {
  const colorScheme = useColorScheme();

  const removeRun = useRunStore((state) => state.removeRun);
  const setOverview = useOverviewStore((state) => state.setOverview);
  const interval = useOverviewStore((state) => state.interval);

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightText : styles.darkText;

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
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
        onPress={async () => {
          if (!run) {
            console.error('No run to delete');
            return;
          }

          Alert.alert(
            'Delete Run',
            'Are you sure you want to delete this run?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                  await deleteRun(run.id);
                  removeRun(run.id);
                  const overview = await getOverview(interval);
                  setOverview(overview);
                  router.back();
                },
              },
            ],
            { cancelable: true }
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
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
