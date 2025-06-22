import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '../../lib/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRunStore } from '../../lib/store';
import { applyHexOpacity } from '../../lib/utils';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const isRunning = useRunStore((state) => state.isRunning);

  return (
    <Tabs
      screenOptions={{
        // mute colors when running
        tabBarActiveTintColor: isRunning
          ? applyHexOpacity(lightTheme.primary, 40)
          : lightTheme.primary,
        tabBarInactiveTintColor: isRunning
          ? applyHexOpacity(lightTheme.mutedForeground, 40)
          : lightTheme.mutedForeground,
        headerStyle: {
          backgroundColor:
            colorScheme === 'light'
              ? lightTheme.background
              : darkTheme.background,
        },
        headerShadowVisible: false,
        headerTintColor:
          colorScheme === 'light'
            ? lightTheme.foreground
            : darkTheme.foreground,
        tabBarStyle: {
          backgroundColor:
            colorScheme === 'light'
              ? lightTheme.background
              : darkTheme.background,
        },
      }}>
      <Tabs.Screen
        name='index'
        // prevent tab press when running
        listeners={{
          tabPress: (e) => {
            if (isRunning) {
              e.preventDefault();
            }
          },
        }}
        options={{
          headerShown: false,
          title: 'Run',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'fitness' : 'fitness'}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='activity'
        // prevent tab press when running
        listeners={{
          tabPress: (e) => {
            if (isRunning) {
              e.preventDefault();
            }
          },
        }}
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'list' : 'list'}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
