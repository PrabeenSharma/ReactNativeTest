import AsyncStorage from '@react-native-async-storage/async-storage';

const SLUG_KEY = 'scanned_slug';
const NOTIFICATIONS_KEY = 'notifications_enabled';

export async function saveScannedSlug(slug: string): Promise<void> {
  try {
    await AsyncStorage.setItem(SLUG_KEY, slug);
  } catch (err) {
    console.log('Failed to save slug', err);
  }
}

export async function getScannedSlug(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(SLUG_KEY);
  } catch (err) {
    console.log('Failed to read slug', err);
    return null;
  }
}

export async function clearScannedSlug(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SLUG_KEY);
  } catch (err) {
    console.log('Failed to clear slug', err);
  }
}

export async function saveNotificationsEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, enabled ? 'yes' : 'no');
  } catch (err) {
    console.log('Failed to save notifications preference', err);
  }
}

export async function getNotificationsEnabled(): Promise<boolean | null> {
  try {
    const value = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    if (value === null) return null;
    return value === 'yes';
  } catch (err) {
    console.log('Failed to read notifications preference', err);
    return null;
  }
}

export async function clearNotificationsEnabled(): Promise<void> {
  try {
    await AsyncStorage.removeItem(NOTIFICATIONS_KEY);
  } catch (err) {
    console.log('Failed to clear notifications preference', err);
  }
}

export async function clearAllScanData(): Promise<void> {
  await Promise.all([clearScannedSlug(), clearNotificationsEnabled()]);
}
