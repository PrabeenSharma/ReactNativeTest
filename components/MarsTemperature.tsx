import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type WeatherType = {
  minTempC: number;
  maxTempC: number;
  minTempF: number;
  maxTempF: number;
};

export default function MarsWeather() {
  const [weather, setWeather] = useState<WeatherType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMarsWeather = async () => {
      try {
        const res = await fetch(
          'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json'
        );
        const data = await res.json();

        const latestSol = data?.soles?.[0];

        if (!latestSol) {
          setError(true);
          setLoading(false);
          return;
        }

        const minTempC = parseFloat(latestSol.min_temp);
        const maxTempC = parseFloat(latestSol.max_temp);

        const minTempF = (minTempC * 9 / 5) + 32;
        const maxTempF = (maxTempC * 9 / 5) + 32;

        setWeather({
          minTempC,
          maxTempC,
          minTempF,
          maxTempF,
        });

        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchMarsWeather();
  }, []);

  if (loading) {
    return <Text style={styles.text}>Loading Mars weather...</Text>;
  }

  if (error || !weather) {
    return <Text style={styles.text}>Error fetching Mars temperature data.</Text>;
  }

  return (
    <View style={styles.container}>

      <Text style={styles.value}>
        {weather.minTempC}°C ({weather.minTempF.toFixed(2)}°F)
      </Text>

      <Text style={styles.value}>
        {weather.maxTempC}°C ({weather.maxTempF.toFixed(2)}°F)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    marginBottom: 2,
  },
  text: {
    fontSize: 14,
  },
});