import Header from '@/components/Header';
import { formatDate } from '@/utils/date';
import { clearAllScanData, getScannedSlug } from '@/utils/storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resolvedSlug, setResolvedSlug] = useState<string | null>(null);

  const { slug: slugParam } = useLocalSearchParams<{ slug?: string }>();
  const router = useRouter();

  // Resolve slug from params first, fall back to saved slug from storage.
  useEffect(() => {
    let active = true;

    (async () => {
      if (slugParam) {
        if (active) setResolvedSlug(slugParam);
        return;
      }
      const saved = await getScannedSlug();
      if (active) {
        setResolvedSlug(saved);
        if (!saved) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [slugParam]);

  useEffect(() => {
    if (!resolvedSlug) return;

    const apiUrl = `https://dev4work.com/thefirstonmars/wp-json/wp/v2/pages?slug=${resolvedSlug}`;

    setLoading(true);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setPage(data?.[0] || null);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [resolvedSlug]);

  // Invalid-QR fallback: clear storage and send the user back to Home so
  // they can scan again. The main "New Scan" entry point lives in the
  // dashboard header dropdown (components/Header.tsx).
  // We use router.replace instead of CommonActions.reset because
  // notification-settings already reset the stack to [{ name: 'dashboard' }],
  // so an 'index' route is no longer registered with the native stack
  // navigator and the reset action gets dropped.
  const handleScanAgain = async () => {
    await clearAllScanData();
    router.replace('/');
  };

  // 🔄 Loading
  if (loading) {
    return (
      <View style={styles.center}>
        <Image
          source={require('./../assets/images/loading.gif')}
          style={{ width: 150, height: 150, alignSelf: 'center' }}
        /> 
      </View>
    );
  }

  // ❌ No data
  if (!page) {
    return (
      <View style={styles.center}>
        <Text>Invalid QR Code. Please scan a valid Ticket QR code</Text>
        <Button title="Scan Again" onPress={handleScanAgain} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header/>
      {/* 🧾 Title */}
      <Text style={styles.title}>
        {page?.title?.rendered}
      </Text>

      {/* 🚀 Mission Info */}
      <Text>Mission Name: {page?.acf?.mission_name}</Text>
      <Text>Mission Status: {page?.acf?.mission_status}</Text>

      {/* ⏱ Calculation */}
      <Text>
        {page?.custom_info?.info_row_1} :{' '}
        {page?.mission_calculation?.time_seconds} sec
      </Text>

      <Text>
        {page?.custom_info?.info_row_2} :{' '}
        {(page?.mission_calculation?.time_seconds || 0) * 2} sec
      </Text>

      {/* 🚢 Ship */}
      <Text>Ship Speed: {page?.acf?.ship_speed}</Text>

      {/* 📅 Date */}
      <Text>
        Launch Date: {formatDate(page?.acf?.launch_date || '')}
      </Text>

      {/* 🖼 Extra */}
      <Text>{page?.theme_options?.example_uploader}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});
