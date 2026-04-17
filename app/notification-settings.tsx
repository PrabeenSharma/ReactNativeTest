import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { saveScan } from '../utils/storage';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const [saving, setSaving] = useState<null | 'yes' | 'no'>(null);

  const handleChoice = async (enable: boolean) => {
    if (!slug) return;
    setSaving(enable ? 'yes' : 'no');
    try {
      await saveScan(slug, enable);
      router.replace('/dashboard');
    } catch (err) {
      console.log('Failed to save notification preference', err);
      setSaving(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enable notifications?</Text>
      <Text style={styles.subtitle}>
        We&apos;ll use this to keep you updated about your booking.
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.yes, saving === 'yes' && styles.busy]}
          disabled={saving !== null}
          onPress={() => handleChoice(true)}
        >
          {saving === 'yes' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Yes</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.no, saving === 'no' && styles.busy]}
          disabled={saving !== null}
          onPress={() => handleChoice(false)}
        >
          {saving === 'no' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>No</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    minWidth: 120,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: 'center',
  },
  yes: {
    backgroundColor: '#4CAF50',
  },
  no: {
    backgroundColor: '#d32f2f',
  },
  busy: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
