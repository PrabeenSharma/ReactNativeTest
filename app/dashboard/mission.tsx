import { getScannedSlug } from '@/utils/storage';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function MissionPage() {
  const { slug: slugParam } = useLocalSearchParams<{ slug?: string }>();

  const [page, setPage] = useState<any>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Resolve slug (param → storage)
  useEffect(() => {
    let active = true;

    (async () => {
      if (slugParam) {
        if (active) setSlug(slugParam);
        return;
      }

      const saved = await getScannedSlug();

      if (active) setSlug(saved);
    })();

    return () => {
      active = false;
    };
  }, [slugParam]);

  // ✅ Fetch API
  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://dev4work.com/thefirstonmars/wp-json/wp/v2/pages?slug=${slug}`
        );

        const data = await res.json();
        setPage(data?.[0] || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!page) {
    return <Text>No data found</Text>;
  }

  return (
    <View>
      <Text>Mission Status: {page?.acf?.mission_status}</Text>
    </View>
  );
}