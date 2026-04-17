import { formatDate } from '@/utils/date';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import RenderHtml from 'react-native-render-html';

import {
  clearScanState,
  getScanState,
  setNotificationEnabled,
} from '../utils/storage';

type PageData = {
  title?: { rendered?: string };
  content?: { rendered?: string };
  acf?: {
    mission_name?: string;
    mission_status?: string;
    ship_speed?: string;
    launch_date?: string;
  };
  custom_info?: { info_row_1?: string; info_row_2?: string };
  mission_calculation?: { time_seconds?: number };
  theme_options?: { example_uploader?: string };
};

export default function DashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [slug, setSlug] = useState<string | null>(null);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [page, setPage] = useState<PageData | null>(null);
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Load persisted state (slug + notif pref).
  useEffect(() => {
    let active = true;
    (async () => {
      const state = await getScanState();
      if (!active) return;
      setSlug(state.slug);
      setNotifEnabled(state.notificationEnabled);
      if (!state.slug) {
        setLoading(false);
        setError('No scanned ticket found. Please scan a QR code.');
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Fetch logo from the site (same source as the original Header component).
  useEffect(() => {
    let active = true;
    fetch('https://dev4work.com/thefirstonmars/wp-json/wp/v2/pages?slug=trip7hge34')
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const uri = data?.[0]?.theme_options?.example_uploader;
        if (uri) setLogoUri(uri);
      })
      .catch((err) => console.log('Logo fetch failed', err));
    return () => {
      active = false;
    };
  }, []);

  // Fetch WP page content for the slug.
  useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    setError(null);
    const url = `https://dev4work.com/thefirstonmars/wp-json/wp/v2/pages?slug=${slug}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const first = Array.isArray(data) ? data[0] : null;
        setPage(first ?? null);
        if (!first) setError('No page found for this ticket.');
      })
      .catch((err) => {
        console.log('Dashboard fetch failed', err);
        if (active) setError('Failed to load ticket details.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const onToggleNotif = useCallback(
    async (value: boolean) => {
      setNotifEnabled(value);
      try {
        await setNotificationEnabled(value);
      } catch (err) {
        console.log('Failed to save notification pref', err);
        setNotifEnabled(!value);
      }
    },
    [],
  );

  const onNewScan = useCallback(async () => {
    setMenuOpen(false);
    await clearScanState();
    router.replace('/');
  }, [router]);

  const contentHtml = useMemo(
    () => ({ html: page?.content?.rendered || '' }),
    [page?.content?.rendered],
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.logoWrap}
          onPress={() => Linking.openURL('https://dev4work.com/thefirstonmars/')}
          activeOpacity={0.8}
        >
          {logoUri ? (
            <Image source={{ uri: logoUri }} style={styles.logo} resizeMode="contain" />
          ) : (
            <Text style={styles.logoFallback}>The First On Mars</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuOpen((v) => !v)}
          accessibilityLabel="Open menu"
          hitSlop={8}
        >
          <View style={styles.menuDot} />
          <View style={styles.menuDot} />
          <View style={styles.menuDot} />
        </TouchableOpacity>
      </View>

      {/* Dropdown */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)}>
          <Pressable style={styles.dropdown} onPress={() => {}}>
            <TouchableOpacity style={styles.dropdownItem} onPress={onNewScan}>
              <Text style={styles.dropdownItemText}>New Scan</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={[styles.dropdownItem, styles.toggleItem]}>
              <Text style={styles.dropdownItemText}>Notifications</Text>
              <Switch value={notifEnabled} onValueChange={onToggleNotif} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Body */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.muted}>Loading ticket…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={onNewScan}>
            <Text style={styles.retryBtnText}>New Scan</Text>
          </TouchableOpacity>
        </View>
      ) : page ? (
        <ScrollView contentContainerStyle={styles.body}>
          <Text style={styles.title}>{page?.title?.rendered}</Text>

          {!!page?.acf?.mission_name && (
            <Text style={styles.line}>Mission Name: {page.acf.mission_name}</Text>
          )}
          {!!page?.acf?.mission_status && (
            <Text style={styles.line}>Mission Status: {page.acf.mission_status}</Text>
          )}
          {!!page?.custom_info?.info_row_1 && (
            <Text style={styles.line}>
              {page.custom_info.info_row_1}: {page?.mission_calculation?.time_seconds ?? 0} sec
            </Text>
          )}
          {!!page?.custom_info?.info_row_2 && (
            <Text style={styles.line}>
              {page.custom_info.info_row_2}:{' '}
              {(page?.mission_calculation?.time_seconds || 0) * 2} sec
            </Text>
          )}
          {!!page?.acf?.ship_speed && (
            <Text style={styles.line}>Ship Speed: {page.acf.ship_speed}</Text>
          )}
          {!!page?.acf?.launch_date && (
            <Text style={styles.line}>
              Launch Date: {formatDate(page.acf.launch_date)}
            </Text>
          )}

          {!!page?.content?.rendered && (
            <View style={styles.htmlBlock}>
              <RenderHtml contentWidth={width - 32} source={contentHtml} />
            </View>
          )}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoWrap: {
    flex: 1,
  },
  logo: {
    width: 200,
    height: 42,
  },
  logoFallback: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  menuButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    marginVertical: 2,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingTop: 92,
    paddingRight: 12,
    alignItems: 'flex-end',
  },
  dropdown: {
    minWidth: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#111',
    fontWeight: '500',
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  body: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
  line: {
    fontSize: 15,
    color: '#222',
    marginBottom: 4,
  },
  htmlBlock: {
    marginTop: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  muted: {
    marginTop: 12,
    color: '#666',
  },
  errorText: {
    fontSize: 15,
    color: '#b00020',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#00ddf1',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#000',
    fontWeight: '700',
  },
});
