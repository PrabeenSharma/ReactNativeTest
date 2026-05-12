import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert('Must use physical device');
    return null;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Permission not granted');
    return null;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId;

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId,
    })
  ).data;

  console.log('EXPO TOKEN:', token);

  return token;
}