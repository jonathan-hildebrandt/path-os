import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Button from './button';
import * as Location from 'expo-location';
import { darkTheme, lightTheme } from '../lib/theme';
import { applyHexOpacity } from '../lib/utils';

type StartScreenProps = {
  setIsRunning: (isRunning: boolean) => void;
};

export default function StartScreen({ setIsRunning }: StartScreenProps) {
  const colorScheme = useColorScheme();

  const themeTextStyle =
    colorScheme === 'light' ? styles.lightText : styles.darkText;

  const themeDescriptionStyle =
    colorScheme === 'light'
      ? styles.lightDescriptionText
      : styles.darkDescriptionText;

  return (
    <View style={styles.flexOne}>
      <View style={styles.container}>
        <Text style={[styles.text, themeTextStyle]}>PathOs</Text>
        <Text
          style={[
            themeTextStyle,
            styles.descriptionText,
            themeDescriptionStyle,
          ]}>
          Start a new run
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          variant={'default'}
          style={styles.buttonContainer}
          textStyle={styles.buttonTextStyles}
          onPress={async () => {
            const { status } =
              await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
              Alert.alert(
                'Location Permission',
                'PathOs requires location permission to track your run.',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Open Settings',
                    style: 'default',
                    onPress: () => {
                      Linking.openSettings();
                    },
                  },
                ],
                { cancelable: true }
              );
              return;
            }

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
  flexOne: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightText: {
    color: lightTheme.foreground,
  },
  darkText: {
    color: darkTheme.foreground,
  },
  buttonStyles: {
    borderRadius: '100%',
    width: 150,
    height: 150,
  },
  buttonTextStyles: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 20,
    fontWeight: 'normal',
  },
  lightDescriptionText: {
    color: applyHexOpacity(lightTheme.foreground, 80),
  },
  darkDescriptionText: {
    color: applyHexOpacity(darkTheme.foreground, 80),
  },
});
