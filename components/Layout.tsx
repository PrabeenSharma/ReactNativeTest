// components/Layout.js
import type { ReactNode } from 'react';
import { View } from 'react-native';
import Footer from './Footer';
import Header from './Header';

export default function Layout({ children }: { children: ReactNode }) {
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