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

  useEffect(() => {
    async function queryOverview() {
      try {
        const fetchedOverview = await getOverview(interval);
        setOverview(fetchedOverview);
      } catch (error) {
        console.error('Failed to fetch overview:', error);
      }
    }

    queryOverview();
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
      {overview ? (
        <View style={{ width: '100%', gap: 12, backgroundColor: '#FF000' }}>
          <View style={{ width: '100%', backgroundColor: '#FF000' }}>
            <View style={styles.statCard}>
              <Text style={[styles.km, themeTextStyle]}>
                {overview.totalDistance?.distance}
              </Text>
              <Text style={[styles.kmDescription, themeDescriptionStyle]}>
                {overview.totalDistance?.unit}
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
                Avg. Pace
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
});
