import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {

  try {

    if (!Device.isDevice) {
      console.log('REAL DEVICE NEEDED');
      return null;
    }

    const permission =
      await Notifications.getPermissionsAsync();

    let finalStatus = permission.status;

    console.log('EXISTING STATUS:', finalStatus);

    if (finalStatus !== 'granted') {

      const request =
        await Notifications.requestPermissionsAsync();

      finalStatus = request.status;

      console.log('NEW STATUS:', finalStatus);
    }

    if (finalStatus !== 'granted') {

      console.log('NOTIFICATION PERMISSION FAILED');

      return null;
    }

    console.log('GETTING TOKEN...');

    const response =
      await Notifications.getExpoPushTokenAsync({
        projectId: '04cfa4ab-7aff-4884-bf4e-8cdac57c4a0f',
      });

    console.log('FULL RESPONSE:', response);

    console.log('TOKEN DATA:', response.data);

    return response.data;

  } catch (error) {

    console.log('PUSH TOKEN ERROR:');

    console.log(error);

    return null;
  }
}