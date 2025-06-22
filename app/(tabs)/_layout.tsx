import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '../../lib/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRunStore } from '../../lib/store';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const isRunning = useRunStore((state) => state.isRunning);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: lightTheme.primary,
        tabBarInactiveTintColor: lightTheme.mutedForeground,
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
        options={{
          headerShown: true,
          title: 'Run',
          // tabBarButton: isRunning ? undefined : () => null,
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
        options={{
          title: 'Activity',
          // tabBarButton: isRunning ? undefined : () => null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'list' : 'list'}
              color={color}
              size={24}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings-outline' : 'settings-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      /> */}
    </Tabs>
  );
}
