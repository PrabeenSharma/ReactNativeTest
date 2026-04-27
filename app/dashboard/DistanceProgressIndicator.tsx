import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import ButtonsGroup from '../../components/ButtonsGroup';

import useMissionPage from '@/hooks/useMissionPage';

export default function MissionPage() {

  const [slug, setSlug] = useState<string | null>(null);

  const { slug: slugParam } = useLocalSearchParams<{ slug?: string }>();
  const { page, loading } = useMissionPage(slugParam);


  return (
    
    <ScrollView style={{ flex: 1 }}>
          <View style={styles.mainContent}>
            <ButtonsGroup/>
            <View style={styles.pageContent}>
              <LinearGradient
                  colors={[
                    '#071737',
                    '#0C285D',
                    '#0C285D',
                    '#071737',
                  ]}
                  locations={[0.0438, 0.3991, 0.549, 0.8476]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.pageBox}
                >
                  
                  
                    <View style={styles.mainInnerContent}>
                       <LinearGradient
                        colors={['#0C2046', '#004F99']}
                        locations={[0.1633, 0.8162]}
                        start={{ x: 0.85, y: 0.15 }}
                        end={{ x: 0.15, y: 0.85 }}
                        style={styles.pageInnerheading}
                        >
                            <Text style={styles.sectionheading}>Distance & Progress Indicator</Text>
                        </LinearGradient>

                        <Text style={styles.contentHeading}>Distance Traveled from Earth</Text>
                        <Text style={styles.contentHeadingMain}>{page?.mission_calculation?.distance_million_km} </Text>
                        <Text style={styles.contentHeading}>Million KM</Text>
                        <View
                          style={{
                            padding: 10, 
                            borderRadius: 100,
                            borderColor:'rgba(63, 104, 113, 1)',
                            borderWidth:0.7,
                            alignSelf:'center',
                            marginTop:10,
                            marginBottom:20,
                          }}
                        >
                          <Image
                            source={require('../../assets/images/earth.gif')}
                            style={{ width: 124, height: 124, borderRadius:100, shadowColor: 'rgba(204,246,255,1)',  shadowOffset: { width: 0, height: -1 },  shadowOpacity: 0.2,    shadowRadius: 34,  }}
                          />
                        </View>

                        <Text style={styles.contentHeading}>Ship Speed</Text>
                        <Text style={styles.contentHeadingMain}>{ page?.acf?.ship_speed }</Text>
                        <Text style={styles.contentHeading}>kph</Text>

                        <View
                          style={{
                            padding: 10, 
                            borderRadius: 100,
                            borderColor:'rgba(63, 104, 113, 1)',
                            borderWidth:0.7,
                            alignSelf:'center',
                            marginTop:10,
                            marginBottom:20,
                          }}
                        >
                          <Image
                            source={require('../../assets/images/mars.gif')}
                            style={{ width: 124, height: 124, borderRadius:100, shadowColor: 'rgba(204,246,255,1)',  shadowOffset: { width: 0, height: -1 },  shadowOpacity: 0.2,    shadowRadius: 34,  }}
                          />
                        </View>
                        <Text style={styles.contentHeading}>Distance To Travel Mars</Text>
                        <Text style={styles.contentHeadingMain}>{Number(page?.distance_to_travel_mars).toFixed(2)}</Text>
                        <Text style={styles.contentHeading}>million km</Text> 


                    </View>
                 <Image
                    source={require('../../assets/images/pageContentBg.png')}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                      aspectRatio: 5.55,
                    }}
                    resizeMode="cover"
                  />
                  
                </LinearGradient>
            </View>
          </View>
    </ScrollView>  

          
  );
}

const styles = StyleSheet.create({
  mainContent: {  paddingHorizontal: 10,    paddingVertical: 17,    alignSelf:'center',    width:'100%',  },
  pageContent:{ marginTop:20,  paddingHorizontal: 10, },
  pageBox:{ padding:0, borderRadius:20, borderColor: 'rgba(101, 129, 135, 1)' , borderWidth:0.5,  overflow:'hidden',  paddingBottom:60,},
  mainInnerContent:{ paddingHorizontal:17, paddingBottom:60, paddingTop:17, flex:1,},
  pageInnerheading:{ textAlign:'center', paddingHorizontal:15, paddingVertical:10, color:'#CCF6FF', fontSize:13, fontFamily: 'Audiowide_400Regular',  textTransform: 'uppercase', borderRadius:10, borderWidth:0.5, borderColor:'rgba(101, 129, 135, 1)', shadowColor: '#000',  shadowOffset: { width: 0, height: 4 },  shadowOpacity: 0.2,  shadowRadius: 9.6, marginBottom:25,},
  sectionheading:{  fontSize: 13, textAlign:'center',   lineHeight: 20,  color: '#CCF6FF',  fontFamily: 'Audiowide_400Regular',  textTransform: 'uppercase', },
  contentHeading:{  fontSize: 11, textAlign:'center',   lineHeight: 20,  color: '#CCF6FF',  fontFamily: 'Audiowide_400Regular',  textTransform: 'uppercase', marginBottom:10,},
  contentHeadingMain:{  fontSize: 22, textAlign:'center',   lineHeight: 22,  color: '#CCF6FF',  fontFamily: 'Audiowide_400Regular',  textTransform: 'uppercase', marginBottom:10,},
});