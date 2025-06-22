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

  const TableRow = ({
    km,
    pace,
    elevation,
    isHeader = false,
    isLast = false,
  }: any) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: isLast || isHeader ? 0 : 1,
        borderColor:
          colorScheme === 'light' ? lightTheme.border : darkTheme.border,
      }}>
      <Text style={{ fontWeight: isHeader ? 'bold' : 'normal', width: 60 }}>
        {km}
      </Text>
      <Text style={{ fontWeight: isHeader ? 'bold' : 'normal', width: 80 }}>
        {pace}
      </Text>
      <Text style={{ fontWeight: isHeader ? 'bold' : 'normal', width: 80 }}>
        {elevation}
      </Text>
    </View>
  );

  return (
    <View>
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
  lightText: {
    color: lightTheme.foreground,
  },
  darkText: {
    color: darkTheme.foreground,
  },
});
