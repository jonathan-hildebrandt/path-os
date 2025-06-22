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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;

    const isCloseToBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;

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

  return (
    <View style={{ flex: 1, width: '90%' }}>
      <Text style={[styles.recent, themeTextStyle]}>Recent Activities</Text>

      <FlatList
        data={runs}
        keyExtractor={(item) => item.id.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={100}
        renderItem={({ item }) => <Run run={item} />}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: runs.length === 0 ? 'center' : 'flex-start',
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          !loading ? (
            <Text
              style={[themeNoRunsStyle, { fontSize: 16, textAlign: 'center' }]}>
              No activities recorded yet.
            </Text>
          ) : null
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              style={{ marginVertical: runs.length !== 0 ? 20 : 0 }}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  recent: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  lightText: {
    color: lightTheme.foreground,
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
