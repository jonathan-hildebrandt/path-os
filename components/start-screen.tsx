import { StyleSheet, Text, View } from 'react-native';
import Input from './input';
import Button from './button';
import Tabs from './tabs';
import { Dispatch, SetStateAction } from 'react';

type StartScreenProps = {
  mode: 'Distance' | 'Time';
  setMode: Dispatch<SetStateAction<'Distance' | 'Time'>>;
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
  return (
    <>
      <Text>Your Goal</Text>
      <Tabs<'Distance' | 'Time'>
        selectedTab={mode}
        setSelectedTab={setMode}
        tabs={['Distance', 'Time']}
      />
      <Input
        value={mode === 'Distance' ? distance : time}
        setValue={mode === 'Distance' ? setDistance : setTime}
        textAlign='center'
        maxLength={3}
        placeholder={
          mode === 'Distance' ? 'Enter distance (km)' : 'Enter time (min)'
        }
        type='number'
      />
      <Button
        variant={'default'}
        style={{
          borderRadius: '100%',
          width: 100,
          height: 100,
        }}
        textStyle={{
          fontSize: 24,
          lineHeight: 32,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
        onPress={() => {
          setIsRunning(true);
        }}
        text={'Start'}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});
