import { Stack } from 'expo-router';
import { useEffect } from 'react';
import initDatabase from '../lib/query';

export default function RootLayout() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen
        name='activity/[id]'
        options={{ presentation: 'modal', headerShown: false }}
      />
    </Stack>
  );
}
