import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';

import {
  ImageBackground,
  View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import * as Notifications from 'expo-notifications';

import Header from '@/components/Header';

import {
  Audiowide_400Regular,
  useFonts,
} from '@expo-google-fonts/audiowide';


// NOTIFICATION HANDLER
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    Audiowide_400Regular,
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000',
      }}
    >

      <ThemeProvider value={MyTheme}>

        <View
          style={{
            flex: 1,
            backgroundColor: '#000',
          }}
        >

          <ImageBackground
            source={require('../assets/images/mainBg.png')}
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
            }}
            resizeMode="cover"
            imageStyle={{
              alignSelf: 'flex-end',
            }}
          >

            <Header />

            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'fade',
              }}
            />

          </ImageBackground>

        </View>

      </ThemeProvider>

    </SafeAreaView>
  );
}