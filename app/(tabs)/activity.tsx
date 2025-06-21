import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { darkTheme, lightTheme, radius } from '../../lib/theme';
import Overview from '../../components/overview';
import { useState } from 'react';
import { Interval } from '../../lib/model';
import Tabs from '../../components/tabs';
import RunsView from '../../components/runs';

export default function ActivityScreen() {
  const colorScheme = useColorScheme();

  const [interval, setInterval] = useState<Interval>('week');

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <Tabs<'week' | 'month' | 'year' | 'all'>
        selectedTab={interval}
        setSelectedTab={setInterval}
        tabs={['week', 'month', 'year', 'all']}
        tabStyle={{
          width: '25%',
        }}
        style={{
          width: '90%',
          paddingHorizontal: 20,
          justifyContent: 'space-around',
        }}
      />
      <Overview interval={interval} />
      <RunsView />
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: radius,
  },
  lightContainer: {
    backgroundColor: lightTheme.background,
  },
  darkContainer: {
    backgroundColor: darkTheme.background,
  },
  lightThemeText: {
    color: lightTheme.foreground,
    borderColor: lightTheme.border,
  },
  darkThemeText: {
    color: darkTheme.foreground,
    borderColor: darkTheme.border,
  },
});
