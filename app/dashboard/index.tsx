import { getScannedSlug } from '@/utils/storage';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
    <View style={{ flex:1}}>

      <View style={styles.mainContent}>
        <Text style={styles.mainHeading}>Mission information</Text>
        <View style={styles.thereeColumns}>
        <View style={{ width: '30%' }}>
          <View style={styles.topContentHolder}>
            <Text style={styles.topHeading}>Starship Sagan:</Text>
            <Text style={styles.topContent}>{page?.acf?.mission_code}</Text>
          </View>
        </View>
        <View style={{ width: '25%' }}>
          <View style={styles.topContentHolder}>
            <Text style={styles.topHeading}>Launch Date:</Text>
            <Text style={styles.topContent}>{page?.acf?.launch_date}</Text>
          </View>
        </View>
        <View style={{ width: '35%' }}>
          <View style={styles.topContentHolder}>
            <Text style={styles.topHeading}>Mission Duration:</Text>
            <Text style={styles.topContent}>{page?.acf?.mission_duration}</Text>
          </View>
        </View>
      </View>
      </View>
      

      
    </View>
  );
}

const styles = StyleSheet.create({
  thereeColumns:{
    flexDirection: 'row', 
    flexWrap: 'wrap',
    gap:25,
  },
  mainContent:{
    flex:1,
    paddingHorizontal:17,
    paddingVertical:17,
    backgroundColor: 'transparent',
  },
  mainHeading:{
    fontSize:16,
    lineHeight:31,
    color:'#fff',
    fontFamily: 'Audiowide_400Regular',
    textTransform:'uppercase',
    marginBottom:17,
  },
  topContentHolder:{
    flexDirection:'column',
    gap:0,
  },
  topHeading:{
    fontSize:9,
    lineHeight:17,
    color:'#fff',
    fontFamily: 'Audiowide_400Regular',
    textTransform:'uppercase',
    marginBottom:5,
  },
  topContent:{
    fontSize:11,
    lineHeight:17,
    color:'rgba(0, 221, 241, 1)',
    fontFamily: 'Audiowide_400Regular',
    textTransform:'uppercase',
    marginBottom:5,
  },
});

