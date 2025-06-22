import { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { getRuns } from '../lib/query';
import { darkTheme, lightTheme } from '../lib/theme';
import { applyHexOpacity } from '../lib/utils';
import Run from './run';
import { useRunStore } from '../lib/store';

export default function RunsView() {
  const colorScheme = useColorScheme();

  const { runs, setCursor, addRuns, cursor } = useRunStore();

  const [loading, setLoading] = useState(false);

  const queryRuns = async (cursor: number | null) => {
    if (cursor === null || loading) return;

    try {
      setLoading(true);
      const response = await getRuns(cursor);

      addRuns(response.runs);
      setCursor(response.cursor);
    } catch (error) {
      console.error('❌ Failed to fetch runs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle scroll event to detect when the user is close to the bottom of the list
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {
      contentOffset, // How far the user has scrolled
      layoutMeasurement, // The visible height of the scrollable container.
      contentSize, // The total height of all scrollable content.
    } = event.nativeEvent;

    // Adjust the threshold (50) as needed for when you want to trigger loading more runs
    const THRESHOLD = 50;

    // Check if the user is close to the bottom of the list
    const isCloseToBottom =
      contentOffset.y + layoutMeasurement.height >= // Gives the bottom of the visible area
      contentSize.height - THRESHOLD; // Gives the total height of the content minus the threshold

    if (isCloseToBottom && !loading) {
      queryRuns(cursor);
    }
  };

  useEffect(() => {
    queryRuns(cursor);
  }, []);

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightText : styles.darkText;
  const themeNoRunsStyle =
    colorScheme === 'light' ? styles.lightNoRuns : styles.darkNoRuns;

  const isEmptyContainer =
    runs.length === 0 && !loading
      ? styles.emptyContainer
      : styles.notEmptyContainer;

  return (
    <View style={styles.container}>
      <Text style={[styles.recent, themeTextStyle]}>Recent Activities</Text>

      <FlatList
        data={runs}
        keyExtractor={(item) => item.id.toString()}
        onScroll={handleScroll}
        // Limits how often scroll events will be fired while scrolling, specified as a time interval in ms.
        scrollEventThrottle={100}
        renderItem={({ item }) => <Run run={item} />}
        contentContainerStyle={[styles.contentContainer, isEmptyContainer]}
        ItemSeparatorComponent={() => <View style={styles.heightTen} />}
        ListEmptyComponent={
          !loading ? (
            <Text style={[themeNoRunsStyle, styles.empty]}>
              No activities recorded yet.
            </Text>
          ) : null
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              style={runs.length > 0 && styles.isNotEmptyMargin}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
  },
  recent: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  heightTen: {
    height: 10,
  },
  contentContainer: {
    flexGrow: 1,
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    justifyContent: 'center',
  },
  notEmptyContainer: {
    justifyContent: 'flex-start',
  },
  lightText: {
    color: lightTheme.foreground,
  },
  isNotEmptyMargin: {
    marginVertical: 20,
  },
  darkText: {
    color: darkTheme.foreground,
  },
  lightNoRuns: {
    color: applyHexOpacity(lightTheme.foreground, 70),
  },
  darkNoRuns: {
    color: applyHexOpacity(darkTheme.foreground, 70),
  },
});
