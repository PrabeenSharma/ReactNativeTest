import { formatDate } from '@/utils/date';
import { getScannedSlug } from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import {
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import RenderHTML from 'react-native-render-html';

export default function MissionPage() {
  const { slug: slugParam } = useLocalSearchParams<{ slug?: string }>();

  const [page, setPage] = useState<any>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false); // ✅ FIX: top level
  const { width } = useWindowDimensions();

  // ✅ Resolve slug
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

  // ✅ Loading state
  if (loading) {
    return <Text style={{ color: '#fff' }}>Loading...</Text>;
  }

  // ✅ No data
  if (!page) {
    return <Text style={{ color: '#fff' }}>No data found</Text>;
  }

  

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.mainContent}>
        <Text style={styles.mainHeading}>Mission information</Text>

        <View style={styles.thereeColumns}>
          <View style={{ width: '31%' }}>
            <View style={styles.topContentHolder}>
              <Text style={styles.topHeading}>Starship Sagan:</Text>
              <Text style={styles.topContent}>
                {page?.acf?.mission_code}
              </Text>
            </View>
            <View style={styles.topContentHolder}>
              <Text style={styles.topHeading}>Mission Status:</Text>
              <Text style={styles.topContent}>
                {page?.acf?.mission_status}
              </Text>
            </View>
          </View>

          <View style={{ width: '25%' }}>
            <View style={styles.topContentHolder}>
              <Text style={styles.topHeading}>Launch Date:</Text>
              <Text style={styles.topContent}>
                {formatDate(page?.acf?.launch_date || '')}
              </Text>
            </View>
            <View style={styles.topContentHolder}>
              <Text style={styles.topHeading}>Return Date:</Text>
              <Text style={styles.topContent}>
                {formatDate(page?.acf?.rtn_date || '')}
              </Text>
            </View>
          </View>

          <View style={{ width: '35%' }}>
            <View style={styles.topContentHolder}>
              <Text style={styles.topHeading}>Mission Duration:</Text>
              <Text style={styles.topContent}>
                {page?.acf?.mission_duration}
              </Text>
            </View>
            <View style={styles.topContentHolder}>
              <Text style={styles.topHeading}>Crew Count:</Text>
              <Text style={styles.topContent}>
                {page?.acf?.crew_count}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#000f1e',
            borderRadius: 10,
            overflow: 'hidden',
            marginTop: 17,
            height: 243,
          }}
        >
          <ImageBackground
            source={require('../../assets/images/captainImage.jpg')}
            style={{  backgroundPosition:'center', width:'100%', backgroundSize:'cover' , backgroundRepeat:'no-repeat', height:243}}
            resizeMode="cover"
          >
            <View style={{ paddingTop: 60, paddingHorizontal: 17 }}>
              <Text style={styles.captainLogs}>Captain's Log</Text>
              <Text style={styles.informationHeading}>
                Mission Status
              </Text>
              <Text style={styles.information}>
                {page?.acf?.information}
              </Text>

              {/* Button */}
              <TouchableOpacity onPress={() => setVisible(true)}>
                <LinearGradient
                  colors={['#0C2046', '#004F99']}
                  locations={[0.1624, 0.816]}
                  start={{ x: 0.85, y: 0.15 }}
                  end={{ x: 0.15, y: 0.85 }}
                  style={styles.optionGradient}
                >
                  <Text style={styles.optionText}>
                    Read Captain’s Message
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </View>

      {/* ✅ Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {page?.acf?.cap_heading}
            </Text>

            {/* <ScrollView style={{ flex: 1, marginTop: 10 }}>
            <Text style={{ marginTop: 10 }}>
              {page?.acf?.captains_message ||
                'No message available'}
            </Text> 
            </ScrollView> */}

            <ScrollView style={{ flex: 1 }}>
      <RenderHTML
        contentWidth={width}
        source={{ html: page?.acf?.captains_message || '' }}
      />
    </ScrollView>

            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={styles.closeBtn}
            >
              <Text style={{ color: '#fff' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  thereeColumns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 17,
    paddingVertical: 17,
  },
  mainHeading: {
    fontSize: 16,
    lineHeight: 31,
    color: '#fff',
    fontFamily: 'Audiowide_400Regular',
    textTransform: 'uppercase',
    marginBottom: 17,
  },
  topContentHolder: {
    marginBottom: 8,
  },
  topHeading: {
    fontSize: 9,
    color: '#fff',
    fontFamily: 'Audiowide_400Regular',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  topContent: {
    fontSize: 10,
    color: 'rgba(0, 221, 241, 1)',
    fontFamily: 'Audiowide_400Regular',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  captainLogs: {
    fontSize: 31,
    color: '#fff',
    fontFamily: 'Audiowide_400Regular',
    textAlign: 'center',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  information: {
    color: '#fff',
    fontFamily: 'Audiowide_400Regular',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight:10,
    textTransform: 'uppercase',
  },
  informationHeading: {
    color: '#fff',
    fontFamily: 'Audiowide_400Regular',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  optionGradient: {
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontFamily: 'Audiowide_400Regular',
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#004F99',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});