import { LinearGradient } from 'expo-linear-gradient';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ButtonsGroup() {
  const router = useRouter();
  const pathname = usePathname(); 

  const isActive = (route: string) => pathname === route;

  const getColors = (route: string) =>
    isActive(route)
      ? ['rgba(12, 32, 70, 1)', 'rgba(0, 79, 153, 1)'] 
      : [
          'rgba(24,58,86,0.2)',
          'rgba(63,125,139,0.2)',
          'rgba(24,58,86,0.2)',
        ];

  return (
    <View>
      
      <View style={styles.row}>
        <View style={styles.box}>
          <Pressable onPress={() => router.push('/dashboard/DistanceProgressIndicator')}>
            <LinearGradient colors={getColors('/dashboard/DistanceProgressIndicator') as any} 
            start={{ x: 0.85, y: 0.15 }}
            end={{ x: 0.15, y: 0.85 }} 
            style={styles.anchorBox}>
              <Text style={styles.text}>
                Distance & Progress Indicators
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.box}>
          <Pressable onPress={() => router.push('/dashboard/EnvironmentalData')}>
            <LinearGradient colors={getColors('/dashboard/EnvironmentalData') as any} 
            start={{ x: 0.85, y: 0.15 }}
            end={{ x: 0.15, y: 0.85 }} 
            style={styles.anchorBox}>
              <Text style={styles.text}>
                Environmental Data
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.box}>
          <Pressable onPress={() => router.push('/dashboard/WeeklyScheduleSnapshot')}>
            <LinearGradient colors={getColors('/dashboard/WeeklyScheduleSnapshot') as any} 
            start={{ x: 0.85, y: 0.15 }}
            end={{ x: 0.15, y: 0.85 }} 
            style={styles.anchorBox}>
              <Text style={styles.text}>
                Communication Metrics
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.box}>
          <Pressable onPress={() => router.push('/dashboard/mission')}>
            <LinearGradient colors={getColors('/dashboard/mission') as any} 
            start={{ x: 0.85, y: 0.15 }}
            end={{ x: 0.15, y: 0.85 }} 
            style={styles.anchorBox}>
              <Text style={styles.text}>
                Ship Tracker
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.box}>
          <Pressable onPress={() => router.push('/scanner')}>
            <LinearGradient colors={getColors('/scanner') as any} 
            start={{ x: 0.85, y: 0.15 }}
            end={{ x: 0.15, y: 0.85 }} 
            style={styles.anchorBox}>
              <Text style={styles.text}>
                Weekly Schedule Snapshot
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.box}>
          <Pressable onPress={() => router.push('/scanner')}>
            <LinearGradient colors={getColors('/scanner') as any} 
            start={{ x: 0.85, y: 0.15 }}
            end={{ x: 0.15, y: 0.85 }} 
            style={styles.anchorBox}>
              <Text style={styles.text}>
                Solar Data Graph
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  box: {
    width: '48%',
  },
  anchorBox: {
    width: '100%',
    height: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(101, 129, 135, 1)',
    borderWidth: 1,
    paddingHorizontal: 5,
  },
  text: {
    color: '#fff',
    fontFamily: 'Audiowide_400Regular',
    fontSize: 10,
    textAlign: 'center',
  },
});