import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {

  try {

    /*
    |--------------------------------------------------------------------------
    | REAL DEVICE CHECK
    |--------------------------------------------------------------------------
    */

    if (!Device.isDevice) {

      console.log('Must use physical device');

      return null;
    }

    /*
    |--------------------------------------------------------------------------
    | NOTIFICATION PERMISSION
    |--------------------------------------------------------------------------
    */

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {

      const { status } =
        await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== 'granted') {

      console.log('Notification permission denied');

      return null;
    }

    /*
    |--------------------------------------------------------------------------
    | ANDROID CHANNEL
    |--------------------------------------------------------------------------
    */

    if (Platform.OS === 'android') {

      await Notifications.setNotificationChannelAsync(
        'default',
        {
          name: 'default',
          importance:
            Notifications.AndroidImportance.MAX,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | EXPO PROJECT ID
    |--------------------------------------------------------------------------
    */

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {

      console.log('Project ID not found');

      return null;
    }

    /*
    |--------------------------------------------------------------------------
    | EXPO PUSH TOKEN
    |--------------------------------------------------------------------------
    */

    const tokenData =
      await Notifications.getExpoPushTokenAsync({

        projectId,

      });

    console.log(
      'EXPO PUSH TOKEN:',
      tokenData.data
    );

    return tokenData.data;

  } catch (error) {

    console.log(
      'REGISTER PUSH ERROR:',
      error
    );

    return null;
  }
}