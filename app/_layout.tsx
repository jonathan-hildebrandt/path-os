import { Stack } from 'expo-router';
import { useEffect } from 'react';
import initDatabase from '../db';

export default function RootLayout() {

  useEffect(() => {
    initDatabase() 
  }, []);
  
  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
    </Stack>
  );
}
