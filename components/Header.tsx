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
  const [page, setPage] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(false);

  const isDashboard = pathname === '/dashboard';

  useEffect(() => {
    fetch(
      'https://dev4work.com/thefirstonmars/wp-json/wp/v2/pages?slug=trip7hge34',
    )
      .then((res) => res.json())
      .then((data) => setPage(data[0]))
      .catch((err) => console.log(err));
  }, []);

  // Keep the switch in sync with persisted preference whenever the dropdown
  // is about to be shown (and on first mount of the dashboard header).
  useEffect(() => {
    if (!isDashboard) return;
    let active = true;
    (async () => {
      const value = await getNotificationsEnabled();
      if (active) setNotificationsOn(value === true);
    })();
    return () => {
      active = false;
    };
  }, [isDashboard, menuOpen]);

  const handleToggle = async (next: boolean) => {
    setNotificationsOn(next);
    await saveNotificationsEnabled(next);
  };

  const handleNewScan = async () => {
    setMenuOpen(false);
    await clearAllScanData();
    // After notification-settings reset the stack to [{ name: 'dashboard' }],
    // a CommonActions.reset targeting 'index' is not handled by the navigator
    // (the 'index' route is no longer in the stack). Use expo-router's replace
    // to navigate back to Home — because the stack only contains '/dashboard'
    // at this point, replacing with '/' effectively resets to Home without
    // leaving /dashboard in history.
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {/* 🖼 Logo */}
      <TouchableOpacity
        onPress={() =>
          Linking.openURL('https://dev4work.com/thefirstonmars/')
        }
      >
        <Image
          source={{ uri: page?.theme_options?.example_uploader }}
          style={styles.logo}
        />
      </TouchableOpacity>

      {/* ⋮ Dashboard dropdown trigger (right side) */}
      {isDashboard ? (
        <TouchableOpacity
          onPress={() => setMenuOpen(true)}
          style={styles.menuButton}
          accessibilityLabel="Open dashboard menu"
        >
          <Text style={styles.menuButtonText}>⋮</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.menuButtonPlaceholder} />
      )}

      {/* 📋 Dropdown menu */}
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
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleNewScan}
            >
              <Text style={styles.menuItemText}>New Scan</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <View style={[styles.menuItem, styles.menuItemRow]}>
              <Text style={styles.menuItemText}>Notifications</Text>
              <Switch value={notificationsOn} onValueChange={handleToggle} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 238,
    height: 49,
  },
  menuButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#222',
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 22,
  },
  menuButtonPlaceholder: {
    width: 0,
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
});
