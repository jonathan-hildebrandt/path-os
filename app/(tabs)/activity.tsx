import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '../../lib/theme';
import Overview from '../../components/overview';
import Tabs from '../../components/tabs';
import RunsView from '../../components/runs';
import { useOverviewStore } from '../../lib/store';

export default function ActivityScreen() {
  const colorScheme = useColorScheme();

  const interval = useOverviewStore((state) => state.interval);
  const setInterval = useOverviewStore((state) => state.setInterval);

  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <Tabs<'week' | 'month' | 'year' | 'all'>
        selectedTab={interval}
        setSelectedTab={setInterval}
        tabs={['week', 'month', 'year', 'all']}
        tabStyle={styles.tab}
        style={styles.tabs}
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
  tab: {
    width: '25%',
  },
  tabs: {
    width: '90%',
    paddingHorizontal: 20,
    justifyContent: 'space-around',
  },
  lightContainer: {
    backgroundColor: lightTheme.background,
  },
  darkContainer: {
    backgroundColor: darkTheme.background,
  },
});
