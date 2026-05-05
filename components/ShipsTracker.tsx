import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

/* ================= CONSTANT ================= */
const TOTAL_DISTANCE = 225000000;

/* ================= TYPES ================= */
export interface MissionItem {
  tr_mission_name: string;
  tr_mission_code: string;
  tr_start_date: string;
  tr_end_date: string;
  misson_type?: string;
}

interface Props {
  heading: string;
  missions: MissionItem[];
}

/* ================= DATE HELPER ================= */
const formatDate = (dateStr?: string): Date => {
  if (!dateStr) return new Date();

  const parts = dateStr.split('-');
  if (parts.length !== 3) return new Date();

  const [m, d, y] = parts;

  return new Date(`20${y}-${m}-${d}`);
};

/* ================= COMPONENT ================= */
const ShipsTracker: React.FC<Props> = ({ heading, missions }) => {
  const today = new Date();

  return (
    <View style={styles.container}>
      <Text style={styles.contentHeadingMain}>{heading}</Text>

      {/* MISSIONS LIST */}
      {missions.map((item, index) => {
        const startDate = formatDate(item.tr_start_date);
        const endDate = formatDate(item.tr_end_date);

        const totalDays =
          (endDate.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24);

        const currentDays =
          (today.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24);

        const safeTotalDays = totalDays > 0 ? totalDays : 1;

        let distanceTo =
          (TOTAL_DISTANCE / safeTotalDays) * currentDays;

        let distanceFrm =
          (TOTAL_DISTANCE / safeTotalDays) *
          (safeTotalDays - currentDays);

        let progress =
          (distanceTo / TOTAL_DISTANCE) * 100;

        if (today > endDate) {
          distanceTo = TOTAL_DISTANCE;
          distanceFrm = 0;
          progress = 100;
        }

        const isReturn = !!item.misson_type;

        return (
          <View key={index} style={styles.card}>
            
            <Text style={styles.title}>
                {item.tr_mission_name}
            </Text>
            <View >
              

              <View style={styles.trackRow}>
                
                <View style={styles.trackRowAfter}>
                  <Image
                  source={require('../assets/images/afterBeforeImage.png')}
                  style={styles.beforeAfterImage}
                />
                </View>
                <View style={styles.trackRowbefore}>
                  <Image
                  source={require('../assets/images/afterBeforeImage.png')}
                  style={styles.beforeAfterImage}
                />
                </View>
                

                <Image
                  source={require('../assets/images/sidebarEarth.png')}
                  style={styles.icon}
                />

                <View style={styles.bar}>
                  <View
                    style={[
                      styles.progress,
                      { width: `${progress}%` },
                    ]}
                  />

                  <View
                    style={[
                      styles.rocket,
                      isReturn
                        ? { right: `${progress}%` }
                        : { left: `${progress}%` },
                    ]}
                  >
                    <Image
                      source={require('../assets/images/rocket2.png')}
                      style={styles.rocketImg}
                    />
                  </View>
                </View>

                
                <Image
                  source={require('../assets/images/sidebarMars.png')}
                  style={styles.icon}
                />
              </View>


            </View>


            {/* MID SECTION */}
            <View style={styles.mid}>
              <Text style={styles.label}>
                Mission Aboard
              </Text>
              <Text style={styles.code}>
                {item.tr_mission_code}
              </Text>

              <Text style={styles.label}>
                Distance from Earth
              </Text>

              <Text style={styles.value}>
                {(isReturn
                  ? distanceFrm / 1000000
                  : distanceTo / 1000000
                ).toFixed(4)}{' '}
                MILLION KM
              </Text>
            </View>

            {/* RIGHT SECTION */}
            <View style={styles.right}>
              <Text style={styles.label}>Departure</Text>
              <Text style={styles.date}>
                {item.tr_start_date}
              </Text>

              <Text style={styles.label}>Arrival</Text>
              <Text style={styles.date}>
                {item.tr_end_date}
              </Text>
            </View>

          </View>
        );
      })}
    </View>
  );
};

export default ShipsTracker;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1,  padding: 16,},

  contentHeadingMain:{  fontSize: 20, textAlign:'center', lineHeight: 22, color: '#CCF6FF',  fontFamily: 'Audiowide_400Regular', marginBottom:20,},

  card: {  flexDirection: 'column',  backgroundColor:'rgba(217,217,217,0.12)', padding:15, borderRadius:6, marginBottom:13, },


  mid: { flex: 1, paddingHorizontal: 10,},

  right: { flex: 1,},

  title: {  fontSize: 17, textAlign:'left', lineHeight: 22, color: '#CCF6FF',  fontFamily: 'Audiowide_400Regular', marginBottom:20, textTransform:'uppercase', },

  trackRow: { flexDirection: 'row', alignItems: 'center',gap:0, },

  icon: { width: 28, height: 28,  zIndex:-1},

  bar: { flex: 1, position: 'relative', backgroundColor: '#fff', height: 2, borderRadius: 2,},

  progress: { height: 2, backgroundColor: '#00DDF1',  borderRadius: 2,},

  rocket: { position: 'absolute',  top: -9, zIndex:9},

  rocketImg: { width: 24, height: 19, },

  label: { color: '#aaa', fontSize: 11, marginTop: 4, },

  code: { color: '#fff',fontWeight: '600',},

  value: { color: '#fff', fontWeight: '600', marginTop: 4,},

  date: { color: '#fff', fontSize: 12, },


trackRowAfter: { position:'absolute', left:35, top:9, zIndex:1},

trackRowbefore: { position:'absolute', right:35, top:9, zIndex:1},

beforeAfterImage:{ width:10, height:10,},  


});