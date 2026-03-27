import { Text, View } from 'react-native';

export default function Footer() {
  return (
    <View style={{ padding: 10, backgroundColor: '#222' }}>
      <Text style={{ color: '#fff', textAlign: 'center' }}>
        © 2026 My App
      </Text>
    </View>
  );
}