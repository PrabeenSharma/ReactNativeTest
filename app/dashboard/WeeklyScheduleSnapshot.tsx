import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

import ButtonsGroup from '../../components/ButtonsGroup';

import useMissionPage from '@/hooks/useMissionPage';

export default function MissionPage() {
  
  const { slug: slugParam } = useLocalSearchParams<{ slug?: string }>();
  const { page, loading } = useMissionPage(slugParam);

  const screenWidth = Dimensions.get('window').width;
  const imageHeight = screenWidth / 3.24;

  const [data, setData] = useState(null);

  const url = page?.acf?.view_class_syllabus_url;

  const openPDF = () => {
    if (url) {
      Linking.openURL(url);
    } else {
      console.log("URL not found");
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.mainContent}>
        <ButtonsGroup />

        <View style={styles.pageContent}>
          <LinearGradient
            colors={['#071737', '#0C285D', '#0C285D', '#071737']}
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
                  <Text style={styles.sectionheading}>
                    Weekly Schedule
                  </Text>
                </LinearGradient>

                <Text style={styles.contentHeading}>Today's Highlights:</Text>
                <Text style={styles.contentHeadingMain}>{ page?.acf?.todays_highlights }</Text>

                <Text style={styles.contentHeadingNomargin}>Upcoming Events:</Text>
                <Text style={styles.contentHeading}>{ page?.acf?.upcoming_events }</Text>
                
                <Pressable
                  onPress={openPDF}
                  style={({ pressed }) => [
                    styles.pdfButton,
                    { opacity: pressed ? 0.6 : 1 }
                  ]}
                                  
                >
                  <Text style={styles.pdfButtonText}>View Class Syllabus</Text>
                </Pressable>

                    
                <WebView
                  source={{
                    uri: "https://calendar.google.com/calendar/embed?height=450&wkst=1&ctz=America%2FNew_York&showPrint=0&src=MjM5ODEwMTg1ZmRlOTM3ZWU1ODNlZDdlMmIyNGQ3MzE2OGI3M2FiOWVhNWMyZGQxZTQxMGU3NDRkYjYxYTU0MUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Yjc0NDI4NDJiNjZlNjIwMjQwMjE4YWE0M2I4YjQzMzdhMWUyNWFhN2M4NmMyMDI5NTY4YWEyOTY1M2I4ZGMyYkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23e4c441&color=%237cb342"
                  }}
                  style={{ height: 450, marginVertical:25, }}
                />

              </View>
              <Image
                  source={require('../../assets/images/weeklyScheduleBg.png')}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height:'auto',
                    aspectRatio: 3.24,
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
  pageBox:{ padding:0, borderRadius:20, borderColor: 'rgba(101, 129, 135, 1)' , borderWidth:0.5,  overflow:'hidden',  paddingBottom:0,},
  mainInnerContent:{ paddingHorizontal:17, paddingBottom:60, paddingTop:17, flex:1,},
  pageInnerheading:{ textAlign:'center', paddingHorizontal:15, paddingVertical:10, color:'#CCF6FF', fontSize:13, fontFamily: 'Audiowide_400Regular',  textTransform: 'uppercase', borderRadius:10, borderWidth:0.5, borderColor:'rgba(101, 129, 135, 1)', shadowColor: '#000',  shadowOffset: { width: 0, height: 4 },  shadowOpacity: 0.2,  shadowRadius: 9.6, marginBottom:25,},
  sectionheading:{  fontSize: 13, textAlign:'center',   lineHeight: 20,  color: '#CCF6FF',  fontFamily: 'Audiowide_400Regular',  textTransform: 'uppercase', },
  contentHeading:{  fontSize: 11, textAlign:'center',   lineHeight: 20,  color: '#CCF6FF',  fontFamily: 'Audiowide_400Regular',  textTransform: 'uppercase', marginBottom:10,},
  contentHeadingMain:{  fontSize: 18, textAlign:'center', lineHeight: 22, color: '#CCF6FF',  fontFamily: 'Audiowide_400Regular', marginBottom:15, textTransform:'uppercase'},
  contentHeadingNomargin:{  fontSize: 11, textAlign:'center', lineHeight: 22, color: '#CCF6FF',  fontFamily: 'Audiowide_400Regular', marginBottom:5, textTransform:'uppercase'},

  pdfButton:{ backgroundColor:'rgba(217,217,217,0.12)', borderColor:'#658187', borderWidth:1, paddingHorizontal:25, paddingVertical:15, borderRadius:6,  marginBottom:5, marginTop:10, textTransform:'uppercase',alignSelf:'center'  },
  pdfButtonText:{ fontSize: 14, textAlign:'center',fontFamily: 'Audiowide_400Regular', color:'#fff',},

});