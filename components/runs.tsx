import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { ActivityRun } from '../lib/model';
import { getRuns } from '../lib/query';
import Button from './button';
import { darkTheme, lightTheme } from '../lib/theme';
import { applyHexOpacity } from '../lib/utils';
import Run from './run';

export default function RunsView() {
  const colorScheme = useColorScheme();
  const [cursor, setCursor] = useState<number | null>(0);
  const [runs, setRuns] = useState<ActivityRun[]>([]);
  const [loading, setLoading] = useState(false);

  const queryRuns = async (cursor: number | null) => {
    if (cursor === null || loading) return;

    try {
      setLoading(true);
      const response = await getRuns(cursor);
      setRuns((prev) => [...prev, ...response.runs]);
      setCursor(response.cursor ?? null);
    } catch (error) {
      console.error('❌ Failed to fetch runs:', error);
    } finally {
      setLoading(false);
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
    <View
      style={{
        flex: 1,
        width: '90%',
        gap: 20,
      }}>
      <Text style={[styles.recent, themeTextStyle]}>Recent Activities</Text>
      <ScrollView>
        {runs.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[themeNoRunsStyle, { fontSize: 16 }]}>
              No activities recorded yet.
            </Text>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {runs.map((run) => (
              <Run key={run.id} run={run} />
            ))}
          </View>
        )}
        {cursor !== null && runs.length !== 0 && (
          <View
            style={{
              margin: 10,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Button
              style={{
                width: '40%',
              }}
              text={loading ? 'Loading...' : 'Load More'}
              onPress={() => queryRuns(cursor)}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  recent: {
    fontSize: 24,
    fontWeight: '600',
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
