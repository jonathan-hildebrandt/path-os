import {
  Alert,
  Linking,
  Modal,
  Pressable,
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
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          gap: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
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
  lightText: {
    color: lightTheme.foreground,
  },
  darkText: {
    color: darkTheme.foreground,
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
