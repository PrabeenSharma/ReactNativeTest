import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { WebView } from 'react-native-webview';

import ButtonsGroup from '../../components/ButtonsGroup';

import useMissionPage from '@/hooks/useMissionPage';

export default function MissionPage() {
  const { slug: slugParam } =
    useLocalSearchParams<{
      slug?: string;
    }>();

  const { page } =
    useMissionPage(slugParam);

  const screenWidth =
    Dimensions.get('window').width;

  const imageHeight =
    screenWidth / 3.24;

  const [
    pdfModalVisible,
    setPdfModalVisible,
  ] = useState(false);

const pdfUrl =
  page?.acf?.view_class_syllabus_url;

const pdfViewerUrl = pdfUrl
  ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
      pdfUrl
    )}`
  : null;

  return (
    <>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.mainContent}>
          <ButtonsGroup />

          <View style={styles.pageContent}>
            <LinearGradient
              colors={[  '#071737', '#0C285D',   '#0C285D',  '#071737',]}
              locations={[ 0.0438,  0.3991, 0.549, 0.8476,]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.pageBox}
            >
              <View  style={  styles.mainInnerContent}>
                <LinearGradient  colors={[ '#0C2046', '#004F99', ]}
                  locations={[ 0.1633, 0.8162, ]}
                  start={{  x: 0.85, y: 0.15, }}
                  end={{ x: 0.15, y: 0.85,}}
                  style={ styles.pageInnerheading }>
                  <Text style={ styles.sectionheading}>
                    Weekly Schedule
                  </Text>
                </LinearGradient>

                <Text style={styles.contentHeading }>
                  Today's Highlights:
                </Text>

                <Text style={ styles.contentHeadingMain }>
                  { page?.acf?.todays_highlights}
                </Text>

                <Text style={ styles.contentHeadingNomargin}>
                  Upcoming Events:
                </Text>

                <Text style={ styles.contentHeading} >
                  {page?.acf?.upcoming_events}
                </Text>

                   {
                    pdfViewerUrl && (
                      <Pressable
                        onPress={() =>
                          setPdfModalVisible(true)
                        }
                        style={({ pressed }) => [
                          styles.pdfButton,
                          {
                            opacity: pressed ? 0.6 : 1,
                          },
                        ]}
                      >
                        <Text style={styles.pdfButtonText}>
                          View Class Syllabus
                        </Text>
                      </Pressable>
                    )
                  }

                <WebView
                  source={{
                    uri: 'https://calendar.google.com/calendar/embed?height=450&wkst=1&ctz=America%2FNew_York&showPrint=0&src=MjM5ODEwMTg1ZmRlOTM3ZWU1ODNlZDdlMmIyNGQ3MzE2OGI3M2FiOWVhNWMyZGQxZTQxMGU3NDRkYjYxYTU0MUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Yjc0NDI4NDJiNjZlNjIwMjQwMjE4YWE0M2I4YjQzMzdhMWUyNWFhN2M4NmMyMDI5NTY4YWEyOTY1M2I4ZGMyYkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23e4c441&color=%237cb342',
                  }}
                  style={{
                    width:'100%',
                    height: 450,
                    marginVertical: 25,
                  }}
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

              <View
                style={{
                  height: imageHeight,
                }}
              />
            </LinearGradient>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={pdfModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setPdfModalVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() =>
                  setPdfModalVisible(false)
                }
                style={styles.closeBtn}
              >
                <Image
                  source={require('../../assets/images/close.png')}
                  style={{
                    width: 14,
                    height: 14,
                  }}
                />
              </TouchableOpacity>

              <Text style={styles.modalHeading}>
                Class Syllabus
              </Text>
            </View>
            {pdfViewerUrl && (
              <View style={{ paddingVertical:0, flex:1, backgroundColor:'#313131',}}>
                <WebView
                  source={{
                    uri: pdfViewerUrl,
                  }}
                  style={styles.pdfView}
                  originWhitelist={['*']}
                  javaScriptEnabled
                  domStorageEnabled
                  startInLoadingState
                  cacheEnabled={false}
                  incognito={true}
                  allowsInlineMediaPlayback
                  setSupportMultipleWindows={false}
                  renderLoading={() => (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#313131',
                      }}
                    >
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 14,
                        }}
                      >
                        Loading PDF...
                      </Text>
                    </View>
                  )}
                />
              </View>
            )}

          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  mainContent: { paddingHorizontal: 10, paddingVertical: 17,  alignSelf: 'center',  width: '100%',  },
  pageContent: {  marginTop: 20,  paddingHorizontal: 10,},
  pageBox: {  padding: 0,  borderRadius: 20,  borderColor: 'rgba(101, 129, 135, 1)', borderWidth: 0.5,  overflow: 'hidden',  paddingBottom: 0, },
  mainInnerContent: {  paddingHorizontal: 17,  paddingBottom: 60, paddingTop: 17, flex: 1, },
  pageInnerheading: {  paddingHorizontal: 15, paddingVertical: 10,  borderRadius: 10,  borderWidth: 0.5,  borderColor:  'rgba(101, 129, 135, 1)',  marginBottom: 25,},
  sectionheading: {  fontSize: 13,  textAlign: 'center', lineHeight: 20,  color: '#CCF6FF', fontFamily: 'Audiowide_400Regular', textTransform: 'uppercase', },
  contentHeading: { fontSize: 11, textAlign: 'center', lineHeight: 20, color: '#CCF6FF', fontFamily: 'Audiowide_400Regular', textTransform: 'uppercase', marginBottom: 10,},
  contentHeadingMain: { fontSize: 18, textAlign: 'center', lineHeight: 22, color: '#CCF6FF', fontFamily:'Audiowide_400Regular', marginBottom: 15, textTransform: 'uppercase', },
  contentHeadingNomargin: { fontSize: 11, textAlign: 'center', lineHeight: 22, color: '#CCF6FF', fontFamily: 'Audiowide_400Regular', marginBottom: 5, textTransform: 'uppercase',},
  pdfButton: {  backgroundColor: 'rgba(217,217,217,0.12)', borderColor: '#658187',  borderWidth: 1,  paddingHorizontal: 25,  paddingVertical: 15,  borderRadius: 6, marginBottom: 5,  marginTop: 10,  alignSelf: 'center', },
  pdfButtonText: { fontSize: 14, textAlign: 'center',  fontFamily:  'Audiowide_400Regular', color: '#fff',},
  modalContainer: { flex: 1,  backgroundColor: '#000', },
  closeButton: { paddingVertical: 16, backgroundColor: '#071737', alignItems: 'center',},
  closeText: { color: '#fff', fontSize: 14, fontFamily: 'Audiowide_400Regular',},
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15,},
  modalBox: { width: '100%', height: '85%', backgroundColor: '#313131', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#658187', paddingTop: 0,},
  modalHeading: {color: '#CCF6FF', fontSize: 16, textAlign: 'center', marginBottom: 0, fontFamily: 'Audiowide_400Regular', textTransform: 'uppercase',},
  pdfView: { flex: 1, backgroundColor: '#fff', paddingBottom:10,  paddingTop:10,  width: '100%',},
  closeBtn: { position: 'absolute', top: 16, right: 12, zIndex: 99, width: 34, height: 34, borderRadius: 8, backgroundColor: '#004f99', justifyContent: 'center', alignItems: 'center',},
  modalHeader: { backgroundColor:'#071737', paddingTop:25, paddingBottom:25,},
});