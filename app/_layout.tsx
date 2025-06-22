import { Stack } from 'expo-router';
import { useEffect } from 'react';
import initDatabase from '../lib/query';

//TODO refractor styling to use stylesheets everywhere

export default function RootLayout() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen
        name='activity/[id]'
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
