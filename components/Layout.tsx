// components/Layout.js
import { View } from 'react-native';
import Footer from './Footer';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <View style={{ flex: 1 }}>
      <Header />

      <View style={{ flex: 1 }}>
        {children}
      </View>

      <Footer />
    </View>
  );
}