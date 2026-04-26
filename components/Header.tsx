// components/Header.tsx
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
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

      <TouchableOpacity style={styles.logo}
        onPress={() =>
          Linking.openURL('https://dev4work.com/thefirstonmars/')
        }
      >
        <Image
          source={require('./../assets/images/Logo.png')}
          style={styles.logo}
        />
      </TouchableOpacity>

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
              <Text style={styles.menuItemText}>Notifications</Text>
              <Switch value={notificationsOn} onValueChange={handleToggle} />
            </View>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleNewScan}
            >
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
    minWidth: 220,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  menuItemText: {
    fontSize: 16,
    color: '#111',
  },

  menuDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 8,
  },
  backButtonArrow:{ },
});