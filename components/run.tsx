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

export default function Run({ run }: { run: ActivityRun }) {
  const colorScheme = useColorScheme();

  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightText : styles.darkText;

  return (
    <Link
      key={run.id}
      href={{
        pathname: `/activity/${run.id}`,
      }}
      asChild>
      <Pressable>
        <View style={[styles.container, themeContainerStyle]}>
          <Ionicons
            name='map-outline'
            size={24}
            color={colorScheme === 'light' ? '#000' : '#fff'}
          />

          <Text style={[themeTextStyle]}>{run.date}</Text>
          <Text style={[themeTextStyle]}>
            {run.distance.distance} {run.distance.unit}
          </Text>
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
});
