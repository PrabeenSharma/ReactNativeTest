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
import Header from '@/components/Header';
import { LinearGradient } from 'expo-linear-gradient';

const QR_API_URL = 'https://api.qrserver.com/v1/read-qr-code/';
const VALIDATE_API = 'https://dev4work.com/thefirstonmars/wp-json/wp/v2/pages?slug=';

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

  // ✅ Extract slug
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

  // ✅ Validate slug from API
  const validateSlug = async (slug: string) => {
    try {
      const res = await fetch(`${VALIDATE_API}${slug}`);
      const data = await res.json();
      return data && data.length > 0;
    } catch (e) {
      console.log('Validation error:', e);
      return false;
    }
  };

  const goToNotificationSettings = (slug: string) => {
    router.push({
      pathname: '/notification-settings',
      params: { slug },
    });
  };

  // ✅ Camera Scan
  const handleScan = async ({ data }: { data: string }) => {
    if (scanned || processing) return;

    setScanned(true);
    setProcessing(true);

    const slug = extractSlug(data);
    const isValid = await validateSlug(slug);

    if (isValid) {
      goToNotificationSettings(slug);
    } else {
      alert('Invalid QR Code');
      setScanned(false);
    }

    setProcessing(false);
  };

  // ✅ Decode QR from image
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
        const isValid = await validateSlug(slug);

        if (isValid) {
          goToNotificationSettings(slug);
        } else {
          alert('Invalid QR Code');
        }
      } else {
        alert('No QR found');
      }
    } catch (err) {
      console.log(err);
      alert('Error scanning image');
    }

    setProcessing(false);
  };

  // ✅ Web file picker
  const pickImageAndScanWeb = () => {
    if (typeof document === 'undefined') return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setImageUri(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append('file', file);

      await decodeQrAndRoute(formData);
    };

    document.body.appendChild(input);
    input.click();
  };

  // ✅ Mobile picker
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

  // ✅ Permission UI
  if (Platform.OS !== 'web') {
    if (!permission) {
      return <Text>Requesting permission...</Text>;
    }

    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={{ color: '#fff' }}>No camera access</Text>

          <TouchableOpacity onPress={requestPermission}>
            <Text style={styles.buttonText}>Allow Camera</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />

      <View style={styles.container}>
        <Text style={styles.title}>Scan Ticket</Text>

        {Platform.OS !== 'web' && (
          <>
            <View style={styles.scannerBox}>
              <CameraView
                style={{ flex: 1 }}
                facing={cameraType}
                enableTorch={flash === 'torch'}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={handleScan}
              />
            </View>

            <View style={styles.controlRow}>
              <TouchableOpacity onPress={() => setFlash(flash === 'off' ? 'torch' : 'off')}>
                <Text style={styles.buttonText}>
                  Flash: {flash === 'off' ? 'OFF' : 'ON'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
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

        <TouchableOpacity onPress={handleUploadPress}>
          <LinearGradient
            colors={['#0C2046', '#004F99']}
            style={styles.optionGradient}
          >
            <Text style={styles.buttonText}>
              {processing ? 'Scanning...' : 'Upload QR Image'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

      
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
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
    gap: 20,
  },
  buttonText: {
    color: '#fff',
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  optionGradient: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
  },
});