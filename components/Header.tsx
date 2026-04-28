// components/Header.tsx
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  clearAllScanData,
  getNotificationsEnabled,
  saveNotificationsEnabled,
} from '@/utils/storage';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(false);

  const isDashboardRoot = pathname === '/dashboard';
  const isDashboardSubPage =
    pathname.startsWith('/dashboard') && pathname !== '/dashboard';

  useEffect(() => {
    if (!isDashboardRoot && !isDashboardSubPage) return;

    let active = true;
    (async () => {
      const value = await getNotificationsEnabled();
      if (active) setNotificationsOn(value === true);
    })();

    return () => {
      active = false;
    };
  }, [pathname, menuOpen]);

  const handleToggle = async (next: boolean) => {
    setNotificationsOn(next);
    await saveNotificationsEnabled(next);
  };

  const handleNewScan = async () => {
    setMenuOpen(false);
    await clearAllScanData();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {isDashboardSubPage ? (
        <TouchableOpacity
          onPress={() => router.replace('/dashboard')}
          style={styles.backButton}
        >
          <View style={styles.backButtonArrow}>
            <Image
              source={require('./../assets/images/back.png')}
              style={{ width: 18, height: 18 }}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.leftPlaceholder} />
      )}

      <View style={styles.logo}>
        <Image
          source={require('./../assets/images/Logo.png')}
          style={styles.logo}
        />
      </View>

      {pathname.startsWith('/dashboard') ? (
        <TouchableOpacity
          onPress={() => setMenuOpen(true)}
          style={styles.menuButton}
        >
          <Image
            source={require('./../assets/images/settingIcon.png')}
            style={{ width: 17, height: 17 }}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.menuButtonPlaceholder} />
      )}

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setMenuOpen(false)}
        >
          <Pressable style={styles.menuSheet} onPress={() => {}}>

            <View style={[styles.menuItem, styles.menuItemRow]}>
              <Image 
                source={require('./../assets/images/topNotificationIcon.png' )}
                style={{ width:11, height:13 }}
              />
              <Text style={styles.menuItemText}>Notifications</Text>
              <Switch style={styles.swicthFunction} value={notificationsOn} onValueChange={handleToggle}  
                trackColor={{ false: '#ccc', true: '#CCF6FF' }}  
              thumbColor={notificationsOn ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItemScan}
              onPress={handleNewScan}
            >
              <Image 
                source={require('./../assets/images/scanIcon.png' )}
                style={{ width:14, height:14 }}
              />
              <Text style={styles.menuItemText}>Scan a new ticket</Text>
            </TouchableOpacity>

          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
  },

  logo: {
    width: 252,
    height: 51,
    alignSelf: 'center',
  },

  backButton: {
    position: 'absolute',
    left: 15,
    top: 30,
  },

  backText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
  },

  leftPlaceholder: {
    width: 0, 
  },

  menuButton: {
    position: 'absolute',
    right: 15,
    top: 30,
  },

  menuButtonPlaceholder: {
    width: 30,
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 15,
  },

  menuSheet: {
    minWidth: 180,
    backgroundColor: '#193553',
    borderRadius: 6,
    paddingHorizontal: 6,
    elevation: 6, 


  },

  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },

  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:10,
  },

  menuItemScan:{
    flexDirection: 'row',
    alignItems: 'center',
    gap:10,
    paddingVertical:12,
    paddingHorizontal:12,

  },

  menuItemText: {
    fontSize: 12,
    color: '#fff',
     fontFamily: 'Audiowide_400Regular',

  },

  menuDivider: {
    height: 1,
    backgroundColor: '#658187',
    marginHorizontal: 0,
  },
  backButtonArrow:{ },
  swicthFunction: { marginLeft: 'auto' }
});