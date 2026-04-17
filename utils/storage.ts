import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  slug: 'app.scannedSlug',
  notification: 'app.notificationEnabled',
  scanCompleted: 'app.scanCompleted',
} as const;

export type ScanState = {
  slug: string | null;
  notificationEnabled: boolean;
  scanCompleted: boolean;
};

export async function getScanState(): Promise<ScanState> {
  const map = await AsyncStorage.getMany([
    KEYS.slug,
    KEYS.notification,
    KEYS.scanCompleted,
  ]);
  return {
    slug: map[KEYS.slug] ?? null,
    notificationEnabled: map[KEYS.notification] === 'true',
    scanCompleted: map[KEYS.scanCompleted] === 'true',
  };
}

export async function saveScan(slug: string, notificationEnabled: boolean): Promise<void> {
  await AsyncStorage.setMany({
    [KEYS.slug]: slug,
    [KEYS.notification]: notificationEnabled ? 'true' : 'false',
    [KEYS.scanCompleted]: 'true',
  });
}

export async function setNotificationEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.notification, enabled ? 'true' : 'false');
}

export async function clearScanState(): Promise<void> {
  await AsyncStorage.removeMany([KEYS.slug, KEYS.notification, KEYS.scanCompleted]);
}
