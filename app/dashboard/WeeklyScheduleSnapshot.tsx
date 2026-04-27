import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import ButtonsGroup from '../../components/ButtonsGroup';

import useMissionPage from '@/hooks/useMissionPage';

export default function MissionPage() {
  
   const { slug: slugParam } = useLocalSearchParams<{ slug?: string }>();
    const { page, loading } = useMissionPage(slugParam);

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
            <ImageBackground
              source={require('../../assets/images/pageContentBg.png')}
              style={{ flex: 1, width: '100%', height: 59 }}
              resizeMode="cover"
              imageStyle={{ alignSelf: 'flex-end' }}
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

                

                

              </View>
            </ImageBackground>
          </LinearGradient>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    paddingHorizontal: 10,
    paddingVertical: 17,
    alignSelf: 'center',
    width: '100%',
  },
  pageContent: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  pageBox: {
    padding: 0,
    borderRadius: 20,
    borderColor: 'rgba(101, 129, 135, 1)',
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  mainInnerContent: {
    paddingHorizontal: 17,
    paddingBottom: 60,
    paddingTop: 17,
  },
  pageInnerheading: {
    textAlign: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#CCF6FF',
    fontSize: 13,
    fontFamily: 'Audiowide_400Regular',
    textTransform: 'uppercase',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(101, 129, 135, 1)',
    marginBottom: 25,
  },
  sectionheading: {
    fontSize: 13,
    textAlign: 'center',
    color: '#CCF6FF',
    fontFamily: 'Audiowide_400Regular',
    textTransform: 'uppercase',
  },
});