import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { getScannedSlug } from '@/utils/storage';
import { GlobalStyles } from '../styles/globalStyles';

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
            fontSize: 35,
            fontWeight: '400',
            textAlign: 'center',
            color: '#fff', 
            fontFamily: 'Audiowide_400Regular'
          }}
        >
          Welcome to Red Planel Resort{' '}
        </Text>

        <View style={{ flex: 1, flexDirection: 'column', gap: 20 }}>
          <Pressable style={({ pressed }) => [
                styles.linkStyle,
                pressed && styles.pressed
              ]}
              onPress={() => router.push('/scanner')}>
            <Text style={{ color: '#fff', fontFamily: 'Audiowide_400Regular', fontSize: 14, fontWeight: '400', textTransform: 'uppercase', marginBottom:14, textAlign: 'center' }}>Scan your ticket</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.linkStyle,
              pressed && styles.pressed
            ]}
            onPress={() =>
              Linking.openURL('https://dev4work.com/thefirstonmars/')
            }
          >
            <Text style={{ color: '#fff', fontFamily: 'Audiowide_400Regular', fontSize: 14, fontWeight: '400', textTransform: 'uppercase', marginBottom:14, textAlign: 'center' }}>Buy Ticket</Text>
          </Pressable>
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
    backgroundColor: 'rgba(217, 217, 217, 0.12)', paddingLeft:22, paddingRight:22, paddingTop:22, paddingBottom:22, borderRadius: 6, color:'#fff', textAlign: 'center', fontFamily: 'Audiowide_400Regular', fontSize:14, fontWeight: '400', textTransform: 'uppercase',
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
  pressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    transform: [{ scale: 0.98 }],
  },
});
