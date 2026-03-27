import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      
      {/* 🔝 Common Header */}
      <Header />

      {/* 📄 Screens */}
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>

      {/* 🔻 Common Footer */}
      <Footer />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});