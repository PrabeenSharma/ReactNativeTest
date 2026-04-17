import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';

import { saveNotificationsEnabled, saveScannedSlug } from '@/utils/storage';

export default function NotificationSettings() {
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const navigation = useNavigation();

  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    if (enabled === null || saving) return;

    setSaving(true);

    if (slug) {
      await saveScannedSlug(slug);
    }
    await saveNotificationsEnabled(enabled);

    // Reset the navigation stack so Dashboard is the only route in history.
    // This prevents the user from going back to Home / Scanner / this screen
    // via hardware back button or gesture after the scan is complete.
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'dashboard',
            params: slug ? { slug } : undefined,
          },
        ],
      }),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      <Text style={styles.description}>
        Would you like to receive notifications from the app?
      </Text>

      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={[styles.option, enabled === true && styles.optionSelected]}
          onPress={() => setEnabled(true)}
        >
          <Text
            style={[
              styles.optionText,
              enabled === true && styles.optionTextSelected,
            ]}
          >
            Yes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, enabled === false && styles.optionSelected]}
          onPress={() => setEnabled(false)}
        >
          <Text
            style={[
              styles.optionText,
              enabled === false && styles.optionTextSelected,
            ]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          (enabled === null || saving) && styles.continueButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={enabled === null || saving}
      >
        <Text style={styles.continueButtonText}>
          {saving ? 'Saving...' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    marginBottom: 32,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  option: {
    minWidth: 110,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#00ddf1',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  optionSelected: {
    backgroundColor: '#00ddf1',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00ddf1',
  },
  optionTextSelected: {
    color: '#000',
  },
  continueButton: {
    backgroundColor: 'red',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#aaa',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
