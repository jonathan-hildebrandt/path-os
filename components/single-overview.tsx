import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { darkTheme, lightTheme, radius } from '../lib/theme';
import { applyHexOpacity } from '../lib/utils';
import { Run } from '../lib/model';

type OverviewProps = {
  run: Run | null;
};

export default function SingleOverviewScreen({ run }: OverviewProps) {
  const colorScheme = useColorScheme();

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
      <View style={styles.subContainer}>
        <View style={styles.headingContainer}>
          <View style={styles.statCard}>
            <Text style={[styles.km, themeTextStyle]}>
              {run?.distance?.distance}
            </Text>
            <Text style={[styles.kmDescription, themeDescriptionStyle]}>
              {run?.distance?.unit}
            </Text>
          </View>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.statCard}>
            <Text style={[styles.text, themeTextStyle]}>{run?.avgPace}</Text>
            <Text style={[styles.description, themeDescriptionStyle]}>
              Avg. Pace
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.text, themeTextStyle]}>
              {run?.duration.duration}
            </Text>
            <Text style={[styles.description, themeDescriptionStyle]}>
              {run?.duration.unit}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.text, themeTextStyle]}>
              {run?.elevationGain}
            </Text>
            <Text style={[styles.description, themeDescriptionStyle]}>
              Elev. Gain
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: radius,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyContainer: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
  },
  subContainer: {
    width: '100%',
    gap: 12,
    backgroundColor: '#FF000',
  },
  headingContainer: {
    width: '100%',
    backgroundColor: '#FF000',
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
