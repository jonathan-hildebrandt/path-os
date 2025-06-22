import { FlatList, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Run } from '../lib/model';
import { darkTheme, lightTheme } from '../lib/theme';

type SplitsProps = {
  run: Run | null;
};

export default function Splits({ run }: SplitsProps) {
  const colorScheme = useColorScheme();

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightText : styles.darkText;

  const themeTableRowStyle =
    colorScheme === 'light'
      ? styles.lightTableRowContainer
      : styles.darkTableRowContainer;

  const TableRow = ({
    km,
    pace,
    elevation,
    isHeader = false,
    isLast = false,
  }: {
    km: number | string;
    pace: string;
    elevation: string | number;
    isHeader?: boolean;
    isLast?: boolean;
  }) => {
    const isHeaderStyle = isHeader ? styles.headingText : styles.normalText;

    return (
      <View
        style={[
          styles.tableRowContainer,
          themeTableRowStyle,
          (isLast || isHeader) && styles.isLastOrHeader,
        ]}>
        <Text style={[styles.rowText, isHeaderStyle, themeTextStyle]}>
          {km}
        </Text>
        <Text style={[styles.rowText, isHeaderStyle, themeTextStyle]}>
          {pace}
        </Text>
        <Text style={[styles.rowText, isHeaderStyle, themeTextStyle]}>
          {elevation}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.widthFull}>
      <Text style={[styles.heading, themeTextStyle]}>Splits</Text>
      <TableRow
        km='Km'
        pace='Avg. Pace'
        elevation='Elevation'
        isLast={false}
        isHeader
      />
      <FlatList
        data={run?.splits}
        keyExtractor={(item) => item.km.toString()}
        renderItem={({ item }) => (
          <TableRow
            km={item.km}
            pace={item.splitPace}
            elevation={item.splitElevation}
            isLast={item.km === run?.splits[run.splits.length - 1].km}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  widthFull: {
    width: '100%',
  },
  tableRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  rowText: {
    fontSize: 16,
    flex: 1,
  },
  headingText: {
    fontWeight: 'bold',
  },
  normalText: {
    fontWeight: 'normal',
  },
  lightTableRowContainer: {
    borderColor: lightTheme.border,
  },
  darkTableRowContainer: {
    borderColor: darkTheme.border,
  },
  isLastOrHeader: {
    borderBottomWidth: 0,
  },
  lightText: {
    color: lightTheme.foreground,
  },
  darkText: {
    color: darkTheme.foreground,
  },
});
