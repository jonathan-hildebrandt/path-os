import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import Input from './input';
import Button from './button';
import Tabs from './tabs';
import { Dispatch, SetStateAction } from 'react';
import { darkTheme, lightTheme } from '../lib/theme';
import { getRuns } from '../lib/query';

type StartScreenProps = {
  mode: 'distance' | 'time';
  setMode: Dispatch<SetStateAction<'distance' | 'time'>>;
  distance: string;
  setDistance: Dispatch<SetStateAction<string>>;
  time: string;
  setTime: Dispatch<SetStateAction<string>>;
  setIsRunning: Dispatch<SetStateAction<boolean>>;
};

export default function StartScreen({
  mode,
  setMode,
  setDistance,
  setTime,
  distance,
  time,
  setIsRunning,
}: StartScreenProps) {
  const colorScheme = useColorScheme();

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightText : styles.darkText;

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          gap: 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={[styles.text, themeTextStyle]}>Your Goal</Text>
        <Tabs<'distance' | 'time'>
          selectedTab={mode}
          setSelectedTab={setMode}
          tabs={['distance', 'time']}
        />
        <Input
          value={mode === 'distance' ? distance : time}
          setValue={mode === 'distance' ? setDistance : setTime}
          textAlign='center'
          style={{
            width: 200,
          }}
          maxLength={3}
          placeholder={
            mode === 'distance' ? 'Enter distance (km)' : 'Enter time (min)'
          }
          type='number'
        />
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button
          variant={'default'}
          style={{
            borderRadius: '100%',
            width: 150,
            height: 150,
          }}
          textStyle={{
            fontSize: 36,
            lineHeight: 40,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
          onPress={() => {
            setIsRunning(true);
          }}
          text={'Start'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lightText: {
    color: lightTheme.foreground,
  },
  darkText: {
    color: darkTheme.foreground,
  },
});
