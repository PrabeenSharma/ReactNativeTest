import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ButtonsGroup from '../../components/ButtonsGroup';

import useMissionPage from '@/hooks/useMissionPage';

export default function MissionPage() {

  const { slug: slugParam } = useLocalSearchParams<{ slug?: string }>();
  const { page, loading } = useMissionPage(slugParam);

  const screenWidth = Dimensions.get('window').width;
  const imageHeight = screenWidth / 3.33;

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
                          <Text style={styles.sectionheading}>Solar wind prediction</Text>
                        </LinearGradient>

                        <Text style={styles.contentHeadingMain}>Solar wind prediction </Text>

                        <Image
                          source={{ uri: 'https://services.swpc.noaa.gov/images/animations/enlil/latest.jpg' }}
                          style={{
                            width: '100%',
                            height: 'auto',
                            aspectRatio: 960/600,
                            borderRadius:10,
                            marginTop:10,
                            marginBottom:25,
                          }}
                          resizeMode="cover"
                        />

                      <Text style={styles.contentHeadingMain}>Space Weather Overview </Text>

                      <Image
                          source={{ uri: 'https://services.swpc.noaa.gov/images/swx-overview-small.gif' }}
                          style={{
                            width: '100%',
                            height: 'auto',
                            aspectRatio: 640/650,
                            borderRadius:10,
                            marginTop:10,
                          }}
                          resizeMode="cover"
                        />

                    </View>
                  <Image
                    source={require('../../assets/images/solarWindBg.png')}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                      height:'auto',
                      aspectRatio: 3.33,
                    }}
                    resizeMode="contain"
                  />


                  <View style={{ height: imageHeight }} />
                  
                </LinearGradient>
            </View>
          </View>
    </ScrollView>  

          
  );
}

const styles = StyleSheet.create({
  mainContent: {  paddingHorizontal: 10,    paddingVertical: 17,    alignSelf:'center',    width:'100%',  },
  pageContent:{ marginTop:20,  paddingHorizontal: 10, },
  pageBox:{ padding:0, borderRadius:20, borderColor: 'rgba(101, 129, 135, 1)' , borderWidth:0.5,  overflow:'hidden', paddingBottom:0,},
  mainInnerContent:{ paddingHorizontal:17, paddingBottom:60, paddingTop:17,},
  pageInnerheading:{ textAlign:'center', paddingHorizontal:15, paddingVertical:10, color:'#CCF6FF', fontSize:13, fontFamily: 'Audiowide_400Regular',  textTransform: 'uppercase', borderRadius:10, borderWidth:0.5, borderColor:'rgba(101, 129, 135, 1)', shadowColor: '#000',  shadowOffset: { width: 0, height: 4 },  shadowOpacity: 0.2,  shadowRadius: 9.6, marginBottom:25,},
  sectionheading:{  fontSize: 13, textAlign:'center', lineHeight: 20,  color: '#CCF6FF',  fontFamily: 'Audiowide_400Regular',  textTransform: 'uppercase', },
  contentHeading:{  fontSize: 11, textAlign:'center', lineHeight: 20, color: '#CCF6FF',  fontFamily: 'Audiowide_400Regular',  textTransform: 'uppercase', marginBottom:10,},
  contentHeadingMain:{  fontSize: 20, textAlign:'center', lineHeight: 22, color: '#CCF6FF',  fontFamily: 'Audiowide_400Regular', marginBottom:10,},
  temLocationHeading:{fontSize: 11, textAlign:'center', lineHeight: 14, color: '#CCF6FF',  fontFamily: 'Audiowide_400Regular', marginBottom:10, fontWeight:400, textTransform:'uppercase'},
  temBox:{ borderColor:'#658187' , borderWidth:1, borderRadius:10, paddingVertical:15, paddingHorizontal:30, marginBottom:15, marginTop:10,},
});