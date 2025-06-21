import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { ActivityRun } from '../lib/model';
import Ionicons from '@expo/vector-icons/Ionicons';
import { darkTheme, lightTheme, radius } from '../lib/theme';
import { Link } from 'expo-router';
import { applyHexOpacity } from '../lib/utils';

export default function Run({ run }: { run: ActivityRun }) {
  const colorScheme = useColorScheme();

  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightText : styles.darkText;

  const themeDescriptionStyle =
    colorScheme === 'light'
      ? styles.lightThemeDescription
      : styles.darkThemeDescription;

  return (
    <Link
      key={run.id}
      href={{
        pathname: `/activity/${run.id}`,
      }}
      asChild>
      <Pressable>
        <View style={[styles.container, themeContainerStyle]}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Ionicons
              name='map-outline'
              size={20}
              color={colorScheme === 'light' ? '#000' : '#fff'}
            />
            <Text style={[styles.text, themeTextStyle]}>{run.date}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              gap: 20,
              marginTop: 10,
              justifyContent: 'space-between',
            }}>
            <View style={styles.statCard}>
              <Text style={[styles.text, themeTextStyle]}>
                {run.distance.distance}
              </Text>
              <Text style={[styles.description, themeDescriptionStyle]}>
                {run.distance.unit}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.text, themeTextStyle]}>{run.avgPace}</Text>
              <Text style={[styles.description, themeDescriptionStyle]}>
                Avg. Pace
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.text, themeTextStyle]}>
                {run.duration.duration}
              </Text>
              <Text style={[styles.description, themeDescriptionStyle]}>
                {run.duration.unit}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius,
    borderWidth: 1,
    padding: 10,
  },
  statCard: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
  lightContainer: {
    borderColor: lightTheme.border,
    backgroundColor: lightTheme.card,
  },
  darkContainer: {
    borderColor: darkTheme.border,
    backgroundColor: darkTheme.card,
  },
  lightText: {
    color: lightTheme.foreground,
  },
  darkText: {
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
