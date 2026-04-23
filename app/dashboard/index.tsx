import { formatDate } from '@/utils/date';
import { getScannedSlug } from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';


export default function MissionPage() {
  const router = useRouter();
  const { slug: slugParam } = useLocalSearchParams<{ slug?: string }>();

  const [page, setPage] = useState<any>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false); 
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
  <ScrollView style={{ flex: 1 }}>
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
        <View style={{ flexDirection:'row', gap:11,marginVertical:15,}}>
          <TouchableOpacity onPress={() => Linking.openURL('https://example.com')} style={{ flexGrow:1}}>
            <LinearGradient
              colors={['#0C2046', '#004F99']}
              locations={[0.1624, 0.816]}
              start={{ x: 0.85, y: 0.15 }}
              end={{ x: 0.15, y: 0.85 }}
              style={styles.optionGradient2}
            >
              <Image
                  source={require('../../assets/images/earthIcon.png')}
                  style={{ width: 22, height: 22 }}
                />
              <Text style={styles.optionText}>
                Earth view
              </Text>
              <Image
                  source={require('../../assets/images/arrow.png')}
                  style={{ width: 14, height: 11 }}
                />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://example.com')} style={{ flexGrow:1}}>
            <LinearGradient
              colors={['#0C2046', '#004F99']}
              locations={[0.1624, 0.816]}
              start={{ x: 0.85, y: 0.15 }}
              end={{ x: 0.15, y: 0.85 }}
              style={styles.optionGradient2}
            >
              <Image
                  source={require('../../assets/images/spaceIcon.png')}
                  style={{ width: 22, height: 22 }}
                />
              <Text style={styles.optionText}>
                Space Map
              </Text>
              <Image
                  source={require('../../assets/images/arrow.png')}
                  style={{ width: 14, height: 11 }}
                />
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </View>

      <LinearGradient
          colors={['#0E1F3F', 'rgba(14,42,97,0.5)', 'rgba(1,10,27,0)']}
          locations={[0, 0.22, 0.88]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ borderTopLeftRadius:10, borderTopRightRadius:10, paddingHorizontal:17, paddingVertical:25, }}
        >
          <View>
            <Text style={styles.headingCenter}>Mission Control Hub</Text>
            <View style={styles.row}>
              <View style={styles.box}>
                <Pressable style={({ pressed }) => [
                      styles.linkStyle,
                      pressed && styles.pressed
                    ]}
                    onPress={() => router.push('/scanner')}>
                    <LinearGradient
                      colors={[
                        'rgba(24,58,86,0.2)',
                        'rgba(63,125,139,0.2)',
                        'rgba(24,58,86,0.2)',
                      ]}
                      locations={[0.03, 0.51, 0.99]}
                      start={{ x: 0, y: 0 }}  
                      end={{ x: 1, y: 0 }}  
                      style={styles.anchorBox}
                    >
                    <Text style={{ color: '#fff', fontFamily: 'Audiowide_400Regular', fontSize: 10, fontWeight: '400', textTransform: 'uppercase', marginBottom:0, textAlign: 'center' }}>Distance & Progress Indicators</Text>
                  </LinearGradient>
                </Pressable>
              </View>
              <View style={styles.box}>
                <Pressable style={({ pressed }) => [
                      styles.linkStyle,
                      pressed && styles.pressed
                    ]}
                    onPress={() => router.push('/scanner')}>
                    <LinearGradient
                      colors={[
                        'rgba(24,58,86,0.2)',
                        'rgba(63,125,139,0.2)',
                        'rgba(24,58,86,0.2)',
                      ]}
                      locations={[0.03, 0.51, 0.99]}
                      start={{ x: 0, y: 0 }}  
                      end={{ x: 1, y: 0 }}  
                      style={styles.anchorBox}
                    >
                    <Text style={{ color: '#fff', fontFamily: 'Audiowide_400Regular', fontSize: 10, fontWeight: '400', textTransform: 'uppercase', marginBottom:0, textAlign: 'center' }}>Environmental \n Data</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.box}>
                <Pressable style={({ pressed }) => [
                      styles.linkStyle,
                      pressed && styles.pressed
                    ]}
                    onPress={() => router.push('/scanner')}>
                    <LinearGradient
                      colors={[
                        'rgba(24,58,86,0.2)',
                        'rgba(63,125,139,0.2)',
                        'rgba(24,58,86,0.2)',
                      ]}
                      locations={[0.03, 0.51, 0.99]}
                      start={{ x: 0, y: 0 }}  
                      end={{ x: 1, y: 0 }}  
                      style={styles.anchorBox}
                    >
                    <Text style={{ color: '#fff', fontFamily: 'Audiowide_400Regular', fontSize: 10, fontWeight: '400', textTransform: 'uppercase', marginBottom:0, textAlign: 'center' }}>Communication \n Metrics</Text>
                  </LinearGradient>
                </Pressable>
              </View>
              <View style={styles.box}>
                <Pressable style={({ pressed }) => [
                      styles.linkStyle,
                      pressed && styles.pressed
                    ]}
                    onPress={() => router.push('/scanner')}>
                    <LinearGradient
                      colors={[
                        'rgba(24,58,86,0.2)',
                        'rgba(63,125,139,0.2)',
                        'rgba(24,58,86,0.2)',
                      ]}
                      locations={[0.03, 0.51, 0.99]}
                      start={{ x: 0, y: 0 }}  
                      end={{ x: 1, y: 0 }}  
                      style={styles.anchorBox}
                    >
                    <Text style={{ color: '#fff', fontFamily: 'Audiowide_400Regular', fontSize: 10, fontWeight: '400', textTransform: 'uppercase', marginBottom:0, textAlign: 'center' }}>Ship \n Tracker</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.box}>
                <Pressable style={({ pressed }) => [
                      styles.linkStyle,
                      pressed && styles.pressed
                    ]}
                    onPress={() => router.push('/scanner')}>
                    <LinearGradient
                      colors={[
                        'rgba(24,58,86,0.2)',
                        'rgba(63,125,139,0.2)',
                        'rgba(24,58,86,0.2)',
                      ]}
                      locations={[0.03, 0.51, 0.99]}
                      start={{ x: 0, y: 0 }}  
                      end={{ x: 1, y: 0 }}  
                      style={styles.anchorBox}
                    >
                    <Text style={{ color: '#fff', fontFamily: 'Audiowide_400Regular', fontSize: 10, fontWeight: '400', textTransform: 'uppercase', marginBottom:0, textAlign: 'center' }}>Weekly Schedule Snapshot</Text>
                  </LinearGradient>
                </Pressable>
              </View>
              <View style={styles.box}>
                <Pressable style={({ pressed }) => [
                      styles.linkStyle,
                      pressed && styles.pressed
                    ]}
                    onPress={() => router.push('/scanner')}>
                    <LinearGradient
                      colors={[
                        'rgba(24,58,86,0.2)',
                        'rgba(63,125,139,0.2)',
                        'rgba(24,58,86,0.2)',
                      ]}
                      locations={[0.03, 0.51, 0.99]}
                      start={{ x: 0, y: 0 }}  
                      end={{ x: 1, y: 0 }}  
                      style={styles.anchorBox}
                    >
                    <Text style={{ color: '#fff', fontFamily: 'Audiowide_400Regular', fontSize: 10, fontWeight: '400', textTransform: 'uppercase', marginBottom:0, textAlign: 'center' }}>Solar Data \n Graph</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
            <View style={styles.hsitoryContainer}>

            </View>

          </View>
      </LinearGradient>

      <View style={styles.hsitoryContainer}>
        <Text style={styles.headingCenter}>
          Space History
        </Text>
      </View>

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


            <ScrollView style={{ flex: 1 }}>

               <Text> {page?.acf?.captains_message?.replace(/<br\s*\/?>/gi, '\n')}</Text>
              
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
  </ScrollView>


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
    paddingHorizontal: 17,
    paddingVertical: 17,
    maxWidth:360,
    alignSelf:'center',
  },
  mainHeading: {
    fontSize: 16,
    lineHeight: 31,
    color: '#fff',
    fontFamily: 'Audiowide_400Regular',
    textTransform: 'uppercase',
    marginBottom: 17,
  },

 headingCenter: {
    fontSize: 16,
    lineHeight: 31,
    color: '#fff',
    fontFamily: 'Audiowide_400Regular',
    textTransform: 'uppercase',
    marginBottom: 17,
    textAlign:'center',
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
  optionGradient2: {
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'row',
    gap:8,
    
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  box: {
    width: '48%', 
    alignItems: 'center',
  },
  linkStyle:{
    width:'100%'
  },
  pressed: {
    opacity: 0.6,
  },
  anchorBox:{ width:'100%', height:50, borderRadius:10, justifyContent:'center', alignItems:'center', borderColor:'rgba(101, 129, 135, 1)', borderWidth:1, borderStyle:'solid', paddingHorizontal:5, },

  hsitoryContainer:{ },

});