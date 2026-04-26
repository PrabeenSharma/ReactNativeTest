// app/dashboard/_layout.tsx

import { Stack, usePathname } from 'expo-router';
import { ImageBackground, View } from 'react-native';
import DashboardFooter from '../../components/FooterDashboard';

export default function DashboardLayout() {
  const pathname = usePathname();

  // 👉 dashboard home check
  const isDashboardHome =
    pathname === '/dashboard' || pathname === '/dashboard/';

  return (
    <View style={{ flex: 1 }}>
      
      <ImageBackground
        source={
          isDashboardHome
            ? require('../../assets/images/mainBg.png')
            : require('../../assets/images/innerpagebg.png') 
        }
        style={{ flex: 1 , width: '100%', height: '100%' }}
        imageStyle={{ alignSelf: 'flex-end' }}
        resizeMode="cover"
      >
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false, animation: 'fade'  }} />
        </View>

        <DashboardFooter />
      </ImageBackground>

    </View>
  );
}