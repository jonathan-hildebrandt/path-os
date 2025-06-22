import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { darkTheme, lightTheme } from '../../lib/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { Run } from '../../lib/model';
import { getRunById } from '../../lib/query';
import SingleOverviewScreen from '../../components/single-overview';
import Splits from '../../components/splits';
import Heading from '../../components/heading';

export default function RunActivityScreen() {
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(true);

  const [run, setRun] = useState<Run | null>(null);

  useEffect(() => {
    // Prevent race condition if the component unmounts before the async call completes
    let ignore = false;

    async function fetchRun() {
      try {
        setIsLoading(true);
        const res = await getRunById(Number(id));
        if (!ignore) {
          setRun(res);
        }
      } catch (error) {
        console.error('Failed to fetch run data:', error);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchRun();

    return () => {
      ignore = true;
    };
  }, [id]);

  const themeSafeAreaViewStyle =
    colorScheme === 'light'
      ? styles.lightSafeAreaView
      : styles.darkSafeAreaView;

  return (
    <SafeAreaView style={[styles.safeAreaView, themeSafeAreaViewStyle]}>
      {!isLoading ? (
        <View style={styles.container}>
          <Heading run={run} />
          <SingleOverviewScreen run={run} />
          <Splits run={run} />
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'small'} />
        </View>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightSafeAreaView: {
    backgroundColor: lightTheme.background,
  },
  darkSafeAreaView: {
    backgroundColor: darkTheme.background,
  },
});
