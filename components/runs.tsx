import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { ActivityRun } from '../lib/model';
import { getRuns } from '../lib/query';
import Button from './button';

export default function RunsView() {
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

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, color: 'white', marginBottom: 12 }}>
        Recent Activities
      </Text>

      {runs.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 16 }}>
            No activities recorded yet.
          </Text>
        </View>
      ) : (
        runs.map((run) => (
          <View key={run.id} style={{ marginBottom: 8 }}>
            <Text style={{ color: 'white' }}>{run.id}</Text>
          </View>
        ))
      )}

      {cursor !== null && (
        <Button
          text={loading ? 'Loading...' : 'Load More'}
          onPress={() => queryRuns(cursor)}
        />
      )}
    </View>
  );
}
