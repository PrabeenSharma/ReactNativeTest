import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { getScanState } from '../utils/storage';

export default function RootLayout() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // On app launch, if the user has already completed a scan, send them
  // straight to the Dashboard so they can never see Home/Scanner again.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const state = await getScanState();
        if (!cancelled && state.scanCompleted && state.slug) {
          router.replace('/dashboard');
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
