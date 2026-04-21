
import { CommonActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { saveNotificationsEnabled, saveScannedSlug } from '@/utils/storage';

import Footer from '@/components/Footer';

export default function NotificationSettings() {
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const navigation = useNavigation();

  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSelection = async (value: boolean) => {
    if (saving) return;

    setEnabled(value);
    setSaving(true);

    if (slug) {
      await saveScannedSlug(slug);
    }

    await saveNotificationsEnabled(value);

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'dashboard/index',
            params: slug ? { slug } : undefined,
          },
        ],
      }),
    );
  };

  return (
    <View style={{ flex: 1, }}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#0C2046', '#004F99']}
          locations={[0.1624, 0.816]}
          start={{ x: 0.85, y: 0.15 }}
          end={{ x: 0.15, y: 0.85 }}
          style={styles.iconWrapper}
        >
          <Image
            source={require('./../assets/images/notificationIcon.png')}
            style={styles.icon}
          />
        </LinearGradient>

        <Text style={styles.description}>
          Would you like to receive mission updates?
        </Text>

        <View style={styles.optionsRow}>
          {/* YES */}
          <TouchableOpacity
            style={[styles.option, enabled === true && styles.optionSelected]}
            onPress={() => handleSelection(true)}
          >
            <LinearGradient
              colors={['#0C2046', '#004F99']}
              locations={[0.1624, 0.816]}
              start={{ x: 0.85, y: 0.15 }}
              end={{ x: 0.15, y: 0.85 }}
              style={styles.optionGradient}
            >
              <Text style={styles.optionText}>Yes</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* NO */}
          <TouchableOpacity
            style={[styles.optionNo, enabled === false && styles.optionSelected]}
            onPress={() => handleSelection(false)}
          >
            <Text style={styles.optionNoText}>No</Text>
          </TouchableOpacity>
        </View>

        {saving && (
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            Saving...
          </Text>
        )}
      </View>
      <Footer/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  iconWrapper: {
    padding: 20,
    width: 60,
    height: 60,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  icon: {
    width: 30,
    height: 35,
  },

  description: {
    fontSize: 23,
    fontWeight: '400',
    textAlign: 'center',
    color: '#fff',
    lineHeight: 32,
    fontFamily: 'Audiowide_400Regular',
    padding: 25,
  },

  optionsRow: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 40,
  },

  option: {
    borderRadius: 6,
  },

  optionGradient: {
    height: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  optionNo: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(126, 148, 181, 1)',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  optionSelected: {
    opacity: 0.8,
  },

  optionText: {
    fontFamily: 'Audiowide_400Regular',
    fontSize: 16,
    textTransform: 'uppercase',
    color: '#fff',
  },

  optionNoText: {
    fontFamily: 'Audiowide_400Regular',
    fontSize: 16,
    textTransform: 'uppercase',
    color: '#fff',
  },
});
