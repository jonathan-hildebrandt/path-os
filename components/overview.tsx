import { useEffect, useState } from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Interval, Overview } from '../lib/model';
import { getOverview } from '../lib/query';
import { darkTheme, lightTheme, radius } from '../lib/theme';
import { applyHexOpacity } from '../lib/utils';

type OverviewProps = {
  interval: Interval;
};

export default function OverviewScreen({ interval }: OverviewProps) {
  const colorScheme = useColorScheme();

  const [overview, setOverview] = useState<Overview | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function queryOverview() {
      try {
        setLoading(true);

        const fetchedOverview = await getOverview(interval);
        setOverview(fetchedOverview);
      } catch (error) {
        console.error('Failed to fetch overview:', error);
      } finally {
        setLoading(false);
      }
    }

    queryOverview();
  }, [interval]);

  useEffect(() => {
    if (overview) {
      console.log('Fetched overview:', overview);
    }
  }, [overview]);

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeDescriptionStyle =
    colorScheme === 'light'
      ? styles.lightThemeDescription
      : styles.darkThemeDescription;

  return (
    <View
      style={{
        borderColor: lightTheme.border,
        borderWidth: 1,
        borderRadius: radius,
        padding: 10,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {loading ? (
        <Text>Loading...</Text>
      ) : overview ? (
        <View>
          <View>
            <View style={styles.statCard}>
              <Text style={[styles.text, themeTextStyle]}>
                {overview.totalDistance?.distance}
              </Text>
              <Text style={[styles.description, themeDescriptionStyle]}>
                {overview.totalDistance?.unit}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <View style={styles.statCard}>
              <Text style={[styles.text, themeTextStyle]}>
                {overview.totalRuns}
              </Text>
              <Text style={[styles.description, themeDescriptionStyle]}>
                Runs
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.text, themeTextStyle]}>
                {overview.avgPace}
              </Text>
              <Text style={[styles.description, themeDescriptionStyle]}>
                min/km
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.text, themeTextStyle]}>
                {overview.totalDuration?.duration}
              </Text>
              <Text style={[styles.description, themeDescriptionStyle]}>
                {overview.totalDuration?.unit}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Text>No data available for this interval.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  lightThemeText: {
    color: lightTheme.foreground,
  },
  darkThemeText: {
    color: darkTheme.foreground,
  },
  description: {
    fontSize: 20,
    fontWeight: '600',
  },
  lightThemeDescription: {
    color: applyHexOpacity(lightTheme.foreground, 60),
  },
  darkThemeDescription: {
    color: applyHexOpacity(darkTheme.foreground, 60),
  },
});
