import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { ActivityRun } from '../lib/model';
import { getRuns } from '../lib/query';
import Button from './button';

export default function RunsView() {
  const [cursor, setCursor] = useState<number | null>(0);
  const [runs, setRuns] = useState<ActivityRun[]>([]);

  async function queryRuns(cursor: number | null) {
    try {
      if (cursor === null) {
        return;
      }

      const response = await getRuns(cursor);
      setRuns((prevRuns) => [...prevRuns, ...response.runs]);
      setCursor(response.cursor);
    } catch (error) {
      console.error('Failed to fetch runs:', error);
    }
  }

  useEffect(() => {
    queryRuns(cursor);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}>
      <Text style={{ fontSize: 24, color: 'white' }}>Recent Activities</Text>
      {runs.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
            }}>
            No activities recorded yet.
          </Text>
        </View>
      ) : (
        runs.map((run) => (
          <View key={run.id}>
            <Text style={{ color: 'white' }}>{run.id}</Text>
          </View>
        ))
      )}
      {cursor && <Button text='Load More' onPress={() => queryRuns(cursor)} />}
    </View>
  );
}
