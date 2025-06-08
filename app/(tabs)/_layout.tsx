import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '../../theme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
        options={{
          title: 'Activity',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'list' : 'list'}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings-outline' : 'settings-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
