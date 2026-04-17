import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { GlobalStyles } from '../styles/globalStyles';
import { getScannedSlug } from '@/utils/storage';

export default function HomeScreen() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const savedSlug = await getScannedSlug();
      if (!active) return;

      if (savedSlug) {
        router.replace({
          pathname: '/dashboard',
          params: { slug: savedSlug },
        });
        return;
      }

      setChecking(false);
    })();

    return () => {
      active = false;
    };
  }, [router]);

  if (checking) {
    return (
      <View style={[GlobalStyles.container, styles.loading]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={GlobalStyles.container}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          padding: 30,
          justifyContent: 'center',
          gap: 0,
        }}
      >
        <Text
          style={{
            paddingBottom: 30,
            fontSize: 24,
            fontWeight: '800',
            textAlign: 'center',
          }}
        >
          Welcome to Red Planel Resort{' '}
        </Text>

        <View style={{ flex: 1, flexDirection: 'row', gap: 20 }}>
          <Link style={styles.linkStyle} href="/scanner">
            Scan QR Code
          </Link>
          <TouchableOpacity
            style={styles.linkStyle}
            onPress={() =>
              Linking.openURL('https://dev4work.com/thefirstonmars/')
            }
          >
            <Text>Buy Ticket</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkStyle: {
    backgroundColor: '#00ddf1',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 12,
    paddingBottom: 12,
  },
  linkStyleRed: {
    backgroundColor: 'red',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 12,
    paddingBottom: 12,
    marginTop: 20,
    color: '#fff',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
