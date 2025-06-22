import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Interval } from '../lib/model';
import { getOverview } from '../lib/query';
import { darkTheme, lightTheme, radius } from '../lib/theme';
import { applyHexOpacity } from '../lib/utils';
import { useRunStore } from '../lib/store';
import { MotiView } from 'moti';

type OverviewProps = {
  interval: Interval;
};

export default function OverviewScreen({ interval }: OverviewProps) {
  const colorScheme = useColorScheme();

  const overview = useRunStore((state) => state.overview);
  const setOverview = useRunStore((state) => state.setOverview);
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    // Prevent race condition if the component unmounts before the async call completes
    let ignore = false;

    async function queryOverview() {
      try {
        setIsPulsing(true);
        const fetchedOverview = await getOverview(interval);
        if (!ignore) {
          setOverview(fetchedOverview);
        }
      } catch (error) {
        if (ignore) return;
        console.error('Failed to fetch overview:', error);
      } finally {
        if (!ignore) {
          setIsPulsing(false);
        }
      }
    }

    queryOverview();

    return () => {
      ignore = true;
    };
  }, [interval]);

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeDescriptionStyle =
    colorScheme === 'light'
      ? styles.lightThemeDescription
      : styles.darkThemeDescription;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <MotiView
        key={isPulsing ? 'pulsing' : 'static'}
        from={{ opacity: 1 }}
        animate={isPulsing ? { opacity: [1, 0.6, 1] } : { opacity: 1 }}
        transition={{
          loop: isPulsing,
          type: 'timing',
          duration: 800,
        }}
        style={{
          width: '100%',
          gap: 12,
          backgroundColor: '#FF000',
        }}>
        <View style={{ width: '100%', backgroundColor: '#FF000' }}>
          <View style={styles.statCard}>
            <Text style={[styles.km, themeTextStyle]}>
              {overview?.totalDistance?.distance ?? '-'}
            </Text>
            <Text style={[styles.kmDescription, themeDescriptionStyle]}>
              {overview?.totalDistance?.unit ?? 'Kilometers'}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 20,
            justifyContent: 'space-between',
          }}>
          <View style={styles.statCard}>
            <Text style={[styles.text, themeTextStyle]}>
              {overview?.totalRuns ?? '-'}
            </Text>
            <Text style={[styles.description, themeDescriptionStyle]}>
              Runs
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.text, themeTextStyle]}>
              {overview?.avgPace ?? '-'}
            </Text>
            <Text style={[styles.description, themeDescriptionStyle]}>
              Avg. Pace
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.text, themeTextStyle]}>
              {overview?.totalDuration?.duration ?? '-'}
            </Text>
            <Text style={[styles.description, themeDescriptionStyle]}>
              {overview?.totalDuration?.unit ?? 'Minutes'}
            </Text>
          </View>
        </View>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: radius,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightContainer: {
    borderColor: lightTheme.border,
  },
  darkContainer: {
    borderColor: darkTheme.border,
  },
  statCard: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  km: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  kmDescription: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
  },
  lightThemeText: {
    color: lightTheme.foreground,
  },
  darkThemeText: {
    color: darkTheme.foreground,
  },
  description: {
    fontSize: 12,
    fontWeight: '500',
  },
  lightThemeDescription: {
    color: applyHexOpacity(lightTheme.foreground, 60),
  },
  darkThemeDescription: {
    color: applyHexOpacity(darkTheme.foreground, 60),
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
