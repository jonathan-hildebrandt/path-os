import { StyleSheet, View } from 'react-native';
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
  distance,
  setDistance,
  time,
  setTime,
  setIsRunning,
}: StartScreenProps) {
  return (
    <>
      <Input
        value={mode === 'Distance' ? distance : time}
        invalid={!distance && !time}
        setValue={mode === 'Distance' ? setDistance : setTime}
        textAlign='center'
        maxLength={3}
        placeholder={
          mode === 'Distance' ? 'Enter distance (km)' : 'Enter time (min)'
        }
        type='number'
      />
      <View style={styles.container}>
        <Button
          variant='default'
          disabled={!distance && !time}
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
      </View>
      <View style={styles.bottomContainer}>
        <Tabs<'Distance' | 'Time'>
          selectedTab={mode}
          setSelectedTab={setMode}
          tabs={['Distance', 'Time']}
        />
      </View>
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
