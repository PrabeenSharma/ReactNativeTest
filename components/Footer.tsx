import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native';

export default function Footer() {
  return (
    <LinearGradient
        colors={['rgba(22, 53, 118, 0.14)', 'rgba(9, 16, 26, 0.14)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ padding: 10 }}
      >
      <Text style={{ color: '#fff', textAlign: 'center' }}>
        © 2026 My App
      </Text>
    </LinearGradient>
  );
}