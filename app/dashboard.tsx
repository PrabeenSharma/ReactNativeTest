import { formatDate } from '@/utils/date';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { slug } = useLocalSearchParams(); // 👈 get slug from scanner
  const router = useRouter();

  useEffect(() => {
    if (!slug) return;

    // 🔥 Build API URL from slug
    const apiUrl = `https://dev4work.com/thefirstonmars/wp-json/wp/v2/pages?slug=${slug}`;


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
  }, [slug]);

  // 🔄 Loading
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // ❌ No data
  if (!page) {
    return (
      <View style={styles.center}>

      


        <Text>Invalid QR Code. Please scan a valid Ticket QR code</Text>
        <Button title="Back" onPress={() => router.push('/')} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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

      {/* 🔙 Back */}
      <Button
        title="Back To Home"
        onPress={() => router.push('/')}
      />
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