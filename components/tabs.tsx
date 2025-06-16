import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { darkTheme, lightTheme, radius } from '../theme';
import { applyHexOpacity } from '../utils';

type TabsProps<T extends string> = {
  tabs: T[];
  selectedTab: T;
  setSelectedTab: (tab: T) => void;
  disabled?: boolean;
};

export default function Tabs<T extends string>({
  tabs,
  selectedTab,
  setSelectedTab,
  disabled,
}: TabsProps<T>) {
  const colorScheme = useColorScheme();

  const themeContainerStyle = StyleSheet.flatten([
    TabsList.container,
    colorScheme === 'light' ? TabsList.light : TabsList.dark,
  ]);

  return (
    <View style={themeContainerStyle}>
      {tabs?.map((tab, index) => {
        const isActive = tab === selectedTab;
        const themeTriggerStyle = StyleSheet.flatten([
          TabsTrigger.container,
          colorScheme === 'light' ? TabsTrigger.light : TabsTrigger.dark,
          isActive &&
            (colorScheme === 'light'
              ? TabsTrigger.lightActive
              : TabsTrigger.darkActive),
          disabled && TabsTrigger.disabled,
        ]);

        const themeTextStyle = StyleSheet.flatten([
          isActive
            ? colorScheme === 'light'
              ? TabsTrigger.textLightActive
              : TabsTrigger.textDarkActive
            : colorScheme === 'light'
            ? TabsTrigger.textLight
            : TabsTrigger.textDark,
        ]);

        return (
          <Pressable
            key={index}
            onPress={() => !disabled && setSelectedTab(tab)}
            style={themeTriggerStyle}>
            <Text style={themeTextStyle}>{tab}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const TabsList = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    borderRadius: radius + 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  light: {
    backgroundColor: lightTheme.muted,
  },
  dark: {
    backgroundColor: darkTheme.muted,
  },
});

const TabsTrigger = StyleSheet.create({
  container: {
    display: 'flex',
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  disabled: {
    opacity: 0.5,
  },
  light: {
    borderRadius: radius,
    borderColor: darkTheme.input,
    borderWidth: 1,
  },
  lightActive: {
    borderRadius: radius,
    borderColor: darkTheme.input,
    borderWidth: 1,
    backgroundColor: lightTheme.background,
  },
  dark: {
    borderRadius: radius,
    borderColor: 'transparent',
    borderWidth: 1,
    backgroundColor: applyHexOpacity(darkTheme.input, 30),
  },
  darkActive: {
    borderRadius: radius,
    borderColor: darkTheme.border,
    borderWidth: 1,
    backgroundColor: applyHexOpacity(darkTheme.input, 30),
  },
  textLight: {
    color: lightTheme.foreground,
  },
  textLightActive: {
    color: lightTheme.foreground,
  },
  textDark: {
    color: darkTheme.mutedForeground,
  },
  textDarkActive: {
    color: darkTheme.foreground,
  },
});
