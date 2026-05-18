import React, {
  useEffect,
  useRef,
} from 'react';

import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

/* ================= CONSTANT ================= */

const TOTAL_DISTANCE = 225000000;

/* ================= TYPES ================= */

export interface MissionItem {
  tr_mission_name: string;
  tr_mission_code: string;
  tr_start_date: string;
  tr_end_date: string;
  misson_type?: string[] | string;
}

interface Props {
  heading: string;
  missions: MissionItem[];
}

/* ================= DATE HELPER ================= */

const formatDate = (
  dateStr?: string,
): Date => {
  if (!dateStr) return new Date();

  const parts = dateStr.split('-');

  if (parts.length !== 3)
    return new Date();

  const [m, d, y] = parts;

  return new Date(`20${y}-${m}-${d}`);
};

/* ================= ROCKET COMPONENT ================= */

interface RocketProps {
  isReturn: boolean;
  progress: number;
  distanceFromMars: number;
}

const RocketAnimation: React.FC<
  RocketProps
> = ({
  isReturn,
  progress,
  distanceFromMars,
}) => {
  const animatedPosition =
    useRef(
      new Animated.Value(0),
    ).current;

  const targetPosition =
    isReturn
      ? (distanceFromMars /
          TOTAL_DISTANCE) *
        100
      : progress;

  useEffect(() => {
    Animated.timing(
      animatedPosition,
      {
        toValue: targetPosition,
        duration: 2200,
        easing: Easing.out(
          Easing.exp,
        ),
        useNativeDriver: false,
      },
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.rocket,
        {
          left:
            animatedPosition.interpolate(
              {
                inputRange: [
                  0, 100,
                ],
                outputRange: [
                  '0%',
                  '100%',
                ],
              },
            ),
        },
      ]}
    >
      <Image
        source={require('../assets/images/rocket2.png')}
        style={[
          styles.rocketImg,

          !isReturn &&
            styles.rocketReverse,
        ]}
      />
    </Animated.View>
  );
};

/* ================= COMPONENT ================= */

const ShipsTracker: React.FC<Props> = ({
  heading,
  missions,
}) => {
  const today = new Date();

  return (
    <View style={styles.container}>
      <Text
        style={
          styles.contentHeadingMain
        }
      >
        {heading}
      </Text>

      {missions.map((item, index) => {
        const startDate =
          formatDate(
            item.tr_start_date,
          );

        const endDate =
          formatDate(
            item.tr_end_date,
          );

        /* ================= DAYS ================= */

        const totalDays =
          (endDate.getTime() -
            startDate.getTime()) /
          (1000 *
            60 *
            60 *
            24);

        const currentDays =
          (today.getTime() -
            startDate.getTime()) /
          (1000 *
            60 *
            60 *
            24);

        const safeTotalDays =
          totalDays > 0
            ? totalDays
            : 1;

        /* ================= RETURN ================= */

        const isReturn =
          Array.isArray(
            item.misson_type,
          ) &&
          item.misson_type.includes(
            'Yes',
          );

        /* ================= DISTANCE ================= */

        let distanceTo =
          (TOTAL_DISTANCE /
            safeTotalDays) *
          currentDays;

        if (distanceTo < 0)
          distanceTo = 0;

        if (
          distanceTo >
          TOTAL_DISTANCE
        ) {
          distanceTo =
            TOTAL_DISTANCE;
        }

        const distanceFromMars =
          TOTAL_DISTANCE -
          distanceTo;

        /* ================= PROGRESS ================= */

        let progress =
          (distanceTo /
            TOTAL_DISTANCE) *
          100;

        if (progress < 0)
          progress = 0;

        if (progress > 100)
          progress = 100;

        /* ================= DISPLAY DISTANCE ================= */

        const displayDistance =
          isReturn
            ? distanceFromMars
            : distanceTo;

        return (
          <View
            key={index}
            style={styles.card}
          >
            {/* TITLE */}

            <Text
              style={styles.title}
            >
              {
                item.tr_mission_name
              }
            </Text>

            {/* TRACK */}

            <View
              style={
                styles.trackWrapper
              }
            >
              {/* EARTH */}

              <Image
                source={require('../assets/images/sidebarEarth.png')}
                style={
                  styles.planet
                }
              />

              {/* LEFT DOT */}

              <View
                style={
                  styles.leftDot
                }
              >
                <Image
                  source={require('../assets/images/afterBeforeImage.png')}
                  style={{
                    width: 10,
                    height: 10,
                  }}
                />
              </View>

              {/* RIGHT DOT */}

              <View
                style={
                  styles.rightDot
                }
              >
                <Image
                  source={require('../assets/images/afterBeforeImage.png')}
                  style={{
                    width: 10,
                    height: 10,
                  }}
                />
              </View>

              {/* BAR */}

              <View
                style={styles.bar}
              >
                {/* PROGRESS */}

                <View
                  style={[
                    styles.progress,

                    isReturn
                      ? {
                          width: `${progress}%`,
                          right: 0,
                        }
                      : {
                          width: `${progress}%`,
                          left: 0,
                        },
                  ]}
                />

                {/* ROCKET */}

                <RocketAnimation
                  isReturn={
                    isReturn
                  }
                  progress={
                    progress
                  }
                  distanceFromMars={
                    distanceFromMars
                  }
                />
              </View>

              {/* MARS */}

              <Image
                source={require('../assets/images/sidebarMars.png')}
                style={
                  styles.planet
                }
              />
            </View>

            {/* INFO */}

            <View
              style={
                styles.infoWrapper
              }
            >
              {/* LEFT */}

              <View
                style={styles.mid}
              >
                <Text
                  style={
                    styles.label
                  }
                >
                  Mission Aboard
                </Text>

                <Text
                  style={
                    styles.code
                  }
                >
                  {
                    item.tr_mission_code
                  }
                </Text>

                <Text
                  style={
                    styles.label
                  }
                >
                  Distance from
                  Earth
                </Text>

                <Text
                  style={
                    styles.code
                  }
                >
                  {(
                    displayDistance /
                    1000000
                  ).toFixed(4)}{' '}
                  MILLION KM
                </Text>
              </View>

              {/* RIGHT */}

              <View
                style={
                  styles.right
                }
              >
                <Text
                  style={
                    styles.labelRight
                  }
                >
                  Departure
                </Text>

                <Text
                  style={
                    styles.date
                  }
                >
                  {
                    item.tr_start_date
                  }
                </Text>

                <Text
                  style={
                    styles.labelRight
                  }
                >
                  Arrival
                </Text>

                <Text
                  style={
                    styles.date
                  }
                >
                  {
                    item.tr_end_date
                  }
                </Text>
              </View>
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
  container: {
    flex: 1,
    padding: 0,
  },

  contentHeadingMain: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 22,
    color: '#CCF6FF',
    fontFamily:
      'Audiowide_400Regular',
    marginBottom: 20,
    marginTop: 10,
  },

  card: {
    backgroundColor:
      'rgba(217,217,217,0.12)',
    padding: 15,
    borderRadius: 6,
    marginBottom: 13,
  },

  title: {
    fontSize: 17,
    color: '#CCF6FF',
    fontFamily:
      'Audiowide_400Regular',
    marginBottom: 18,
    textTransform:
      'uppercase',
  },

  /* TRACK */

  trackWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  planet: {
    width: 28,
    height: 28,
  },

  bar: {
    flex: 1,
    height: 2,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    position: 'relative',
    borderRadius: 2,
    overflow: 'visible',
  },

  progress: {
    height: 2,
    backgroundColor:
      '#00DDF1',
    borderRadius: 2,
    position: 'absolute',
  },

  rocket: {
    position: 'absolute',
    top: -9,
    zIndex: 99,
  },

  rocketImg: {
    width: 24,
    height: 19,
    resizeMode: 'contain',
  },

  /* RETURN FACE */

  rocketReverse: {
    transform: [
      { rotate: '180deg' },
      { translateX: 20 },
    ],
  },

  /* DOTS */

  leftDot: {
    position: 'absolute',
    top: 9,
    left: 34,
    width: 10,
    height: 10,
  },

  rightDot: {
    position: 'absolute',
    top: 9,
    right: 34,
    width: 10,
    height: 10,
  },

  /* INFO */

  infoWrapper: {
    flexDirection: 'row',
    marginTop: 22,
  },

  mid: {
    width: '65%',
  },

  right: {
    width: '35%',
  },

  label: {
    color: '#fff',
    fontSize: 9,
    marginTop: 4,
    fontFamily:
      'Audiowide_400Regular',
    lineHeight: 14,
    textTransform:
      'uppercase',
    letterSpacing: 1,
  },

  labelRight: {
    color: '#fff',
    fontSize: 9,
    marginTop: 4,
    fontFamily:
      'Audiowide_400Regular',
    lineHeight: 14,
    textTransform:
      'uppercase',
    letterSpacing: 1,
    textAlign: 'right',
  },

  code: {
    color: '#00DDF1',
    fontWeight: '400',
    marginTop: 5,
    fontFamily:
      'Audiowide_400Regular',
    fontSize: 12,
    lineHeight: 16,
    textTransform:
      'uppercase',
    marginBottom: 10,
  },

  value: {
    color: '#fff',
    fontWeight: '600',
    marginTop: 4,
  },

  date: {
    color: '#00DDF1',
    fontSize: 16,
    marginTop: 5,
    fontFamily:
      'Audiowide_400Regular',
    lineHeight: 20,
    textTransform:
      'uppercase',
    textAlign: 'right',
    marginBottom: 5,
  },
});