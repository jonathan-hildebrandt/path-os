import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { darkTheme, lightTheme } from '../../lib/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { Run } from '../../lib/model';
import { getRunById } from '../../lib/query';
import SingleOverviewScreen from '../../components/single-overview';
import Splits from '../../components/splits';

export default function RunActivityScreen() {
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams();

  const [run, setRun] = useState<Run | null>(null);

  const themeSafeAreaViewStyle =
    colorScheme === 'light'
      ? styles.lightSafeAreaView
      : styles.darkSafeAreaView;

  useEffect(() => {
    async function fetchRun() {
      try {
        const res = await getRunById(Number(id));

        setRun(res);
      } catch (error) {
        console.error('Failed to fetch run data:', error);
      }
    }

    fetchRun();
  }, [id]);

  return (
    <SafeAreaView style={[styles.safeAreaView, themeSafeAreaViewStyle]}>
      <View style={styles.container}>
        <SingleOverviewScreen run={run} />
        <Splits run={run} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    width: '90%',
    height: '95%',
  },
  lightSafeAreaView: {
    backgroundColor: lightTheme.background,
  },
  darkSafeAreaView: {
    backgroundColor: darkTheme.background,
  },
});
