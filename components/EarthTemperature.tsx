import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type WeatherType = {
  currentF: number;
  minF: number;
  maxF: number;
};

export default function EarthWeather() {
  const [weather, setWeather] = useState<WeatherType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTemperature = async () => {
      const apiKey = '6f590faf89697cd911c1fec5469012a6'; 
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Houston&units=metric&appid=${apiKey}`;
      const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Houston&units=metric&appid=${apiKey}`;

      try {
        const res = await fetch(apiUrl);
        const data = await res.json();

        const tempC = data?.main?.temp;
        const tempF = (tempC * 9/5) + 32;

        // 📊 Forecast
        const forecastRes = await fetch(forecastApiUrl);
        const forecastData = await forecastRes.json();

        let minC = Number.POSITIVE_INFINITY;
        let maxC = Number.NEGATIVE_INFINITY;

        forecastData.list.slice(0, 8).forEach((entry: any) => {
          minC = Math.min(minC, entry.main.temp_min);
          maxC = Math.max(maxC, entry.main.temp_max);
        });

        const minF = (minC * 9/5) + 32;
        const maxF = (maxC * 9/5) + 32;

        setWeather({
          currentF: tempF,
          minF,
          maxF,
        });

        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchTemperature();
  }, []);

  if (loading) {
    return <Text style={styles.text}>Loading Earth temperature...</Text>;
  }

  if (error || !weather) {
    return <Text style={styles.text}>Error fetching temperature data.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Earth Temperature (Houston)</Text>

      <Text style={styles.value}>
        Avg: {weather.currentF.toFixed(1)}°F
      </Text>

      <Text style={styles.value}>
        {weather.minF.toFixed(1)} – {weather.maxF.toFixed(1)}°F
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