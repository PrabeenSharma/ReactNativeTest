import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import Footer from '@/components/Footer';
import { LinearGradient } from 'expo-linear-gradient';

const QR_API_URL = 'https://api.qrserver.com/v1/read-qr-code/';

// 🔥 👉 CHANGE THIS
const CHECK_API = 'https://dev4work.com/thefirstonmars/wp-json/wp/v2/pages?slug=';

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const [flash, setFlash] = useState<'off' | 'torch'>('off');
  const [cameraType, setCameraType] = useState<CameraType>('back');

  const router = useRouter();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      ImagePicker.requestMediaLibraryPermissionsAsync();
    }
  }, []);

  // 🔍 Extract slug
  const extractSlug = (data: string) => {
    const raw = (data || '').trim();

    const slugMatch =
      raw.match(/[?&]slug=([^&#\s]+)/) ||
      raw.match(/(?:^|\b)slug=([^&#\s]+)/);

    if (slugMatch?.[1]) return decodeURIComponent(slugMatch[1]);

    if (/^https?:\/\//i.test(raw)) {
      const pathOnly = raw.split('?')[0].split('#')[0];
      const afterScheme = pathOnly.replace(/^https?:\/\/[^/]+/i, '');
      const segments = afterScheme.split('/').filter(Boolean);

      while (
        segments.length > 1 &&
        /\.[a-z0-9]{2,5}$/i.test(segments[segments.length - 1])
      ) {
        segments.pop();
      }

      const last = segments.pop();
      if (last) return decodeURIComponent(last);
    }

    return raw;
  };

  const goToNotificationSettings = (slug: string) => {
    router.push({
      pathname: '/notification-settings',
      params: { slug },
    });
  };

  // ✅ VALIDATION FUNCTION
  const validateAndNavigate = async (slug: string) => {
    try {
      setProcessing(true);

      const res = await fetch(`${CHECK_API}${slug}`);
      const data = await res.json();

      console.log('Validation API:', data);

      const page = data?.[0];

      if (!page) {
        alert('Invalid Ticket ❌');
        return;
      }

      if (!page?.acf?.mission_code) {
        alert('Invalid Ticket ❌');
        return;
      }

      // ✅ success
      goToNotificationSettings(slug);

    } catch (err) {
      console.log('Validation error:', err);
      alert('Something went wrong');
    } finally {
      setProcessing(false);
    }
  };

  // 📷 Camera scan
  const handleScan = ({ data }: { data: string }) => {
    setScanned(true);

    const slug = extractSlug(data);
    validateAndNavigate(slug);

    setTimeout(() => setScanned(false), 2000);
  };

  // 🔎 Image QR decode
  const decodeQrAndRoute = async (body: FormData) => {
    setProcessing(true);
    try {
      const res = await fetch(QR_API_URL, {
        method: 'POST',
        body,
      });

      const data = await res.json();

      const qrData = data?.[0]?.symbol?.[0]?.data;

      if (qrData) {
        const slug = extractSlug(qrData);
        await validateAndNavigate(slug);
      } else {
        alert('No QR found in image');
      }
    } catch (err) {
      console.log('Scan error:', err);
      alert('Error scanning image');
    } finally {
      setProcessing(false);
    }
  };

  // 🖥️ Web upload
  const pickImageAndScanWeb = () => {
    if (typeof document === 'undefined') return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    input.onchange = async () => {
      const file = input.files?.[0];
      input.remove();
      if (!file) return;

      setImageUri(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append('file', file);

      await decodeQrAndRoute(formData);
    };

    input.addEventListener('cancel', () => input.remove());

    document.body.appendChild(input);
    input.click();
  };

  // 📱 Native upload
  const pickImageAndScanNative = async () => {
    const mediaPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!mediaPermission.granted) {
      alert('Permission required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setImageUri(uri);

    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'qr.jpg',
      type: 'image/jpeg',
    } as any);

    await decodeQrAndRoute(formData);
  };

  const handleUploadPress = () => {
    if (processing) return;

    if (Platform.OS === 'web') {
      pickImageAndScanWeb();
    } else {
      pickImageAndScanNative();
    }
  };

  // 🔒 Permission
  if (Platform.OS !== 'web') {
    if (!permission) {
      return <Text>Requesting permission...</Text>;
    }

    if (!permission.granted) {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <Text style={{ color: '#fff', marginBottom: 10 , fontFamily: 'Audiowide_400Regular', fontSize:16}}>
              No camera access
            </Text>

            <TouchableOpacity style={styles.button} onPress={requestPermission}>
              <LinearGradient
                colors={['#0C2046', '#004F99']}
                style={styles.optionGradient}
              >
                <Text style={styles.buttonText}>Allow Camera</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { marginTop: 20 }]}
              onPress={handleUploadPress}
            >
              <Text style={styles.buttonText}>
                Upload QR Image
              </Text>
            </TouchableOpacity>
          </View>
          <Footer/>
        </View>
      );
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Scan Ticket</Text>

        {Platform.OS !== 'web' && (
          <>
            <View style={styles.scannerBox}>
              <CameraView
                style={{ flex: 1 }}
                facing={cameraType}
                enableTorch={flash === 'torch'}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={scanned ? undefined : handleScan}
              />
            </View>

            <View style={styles.controlRow}>
              <TouchableOpacity
                style={[styles.button, { marginRight: 10 }]}
                onPress={() => setFlash(flash === 'off' ? 'torch' : 'off')}
              >
                <Text style={styles.buttonText}>
                  Flash: {flash === 'off' ? 'OFF' : 'ON'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  setCameraType(cameraType === 'back' ? 'front' : 'back')
                }
              >
                <Text style={styles.buttonText}>
                  Camera: {cameraType === 'back' ? 'Back' : 'Front'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={handleUploadPress}
        >
          <LinearGradient
            colors={['#0C2046', '#004F99']}
            style={styles.optionGradient}
          >
            <Text style={styles.buttonText}>
              {processing ? 'Scanning...' : 'Upload QR Image'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {Platform.OS !== 'web' && scanned && (
          <TouchableOpacity
            style={[styles.button, { marginTop: 10 }]}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>

      <Footer/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 20,
    color: '#fff',
    fontFamily: 'Audiowide_400Regular',
    fontSize:24,
  },
  scannerBox: {
    width: '90%',
    height: '50%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  controlRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Audiowide_400Regular',
    fontSize:16,
  },
  optionGradient: {
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  button:{},
});