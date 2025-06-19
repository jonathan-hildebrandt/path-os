import { StyleSheet } from 'react-native';

export const flex = StyleSheet.create({
  one: { flex: 1 },
  row: { flexDirection: 'row' },
  col: { flexDirection: 'column' },
  center: { justifyContent: 'center', alignItems: 'center' },
  between: { justifyContent: 'space-between' },
  gap4: { gap: 4 },
  gap8: { gap: 8 },
  gap16: { gap: 16 },
});
