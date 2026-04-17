import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const QR_API_URL = 'https://api.qrserver.com/v1/read-qr-code/';

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

  // 🔍 Extract slug from decoded QR data.
  // Supported formats:
  //   1. "slug=trip7hge34" or "...?slug=trip7hge34&foo=bar"
  //   2. "https://trip.redplanetresorts.com/trip7hge34"
  //   3. "https://trip.redplanetresorts.com/trip7hge34/" (trailing slash)
  //   4. "https://trip.redplanetresorts.com/trip7hge34/locationbg.jpg"
  //      (trailing segment is a filename; we skip it and use the real slug)
  //   5. "trip7hge34" (plain slug)
  const extractSlug = (data: string) => {
    const raw = (data || '').trim();

    // 1. explicit slug= query/param anywhere in the string
    const slugMatch = raw.match(/[?&]slug=([^&#\s]+)/) || raw.match(/(?:^|\b)slug=([^&#\s]+)/);
    if (slugMatch?.[1]) return decodeURIComponent(slugMatch[1]);

    // 2. URL: strip query/hash, then find the last non-filename path segment
    if (/^https?:\/\//i.test(raw)) {
      const pathOnly = raw.split('?')[0].split('#')[0];
      // drop scheme://host
      const afterScheme = pathOnly.replace(/^https?:\/\/[^/]+/i, '');
      const segments = afterScheme.split('/').filter(Boolean);

      // strip trailing filename-like segments (e.g. locationbg.jpg, logo.png)
      while (segments.length > 1 && /\.[a-z0-9]{2,5}$/i.test(segments[segments.length - 1])) {
        segments.pop();
      }

      const last = segments.pop();
      if (last) return decodeURIComponent(last);
    }

    // 3. plain text
    return raw;
  };

  const goToNotificationSettings = (slug: string) => {
    router.push({
      pathname: '/notification-settings',
      params: { slug },
    });
  };

  // 📷 Camera scan
  const handleScan = ({ data }: { data: string }) => {
    setScanned(true);
    goToNotificationSettings(extractSlug(data));
    setTimeout(() => setScanned(false), 2000);
  };

  // 🔎 Send a QR image to the QR decode API and route on success.
  const decodeQrAndRoute = async (body: FormData) => {
    setProcessing(true);
    try {
      const res = await fetch(QR_API_URL, {
        method: 'POST',
        body,
      });

      const data = await res.json();
      console.log('QR API response:', data);

      const qrData = data?.[0]?.symbol?.[0]?.data;

      if (qrData) {
        goToNotificationSettings(extractSlug(qrData));
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

  // 🖥️ Web: browse file from PC. React Native Web does not render raw DOM
  // <input> elements, so we create one imperatively, trigger the OS file
  // picker, and clean it up after the user makes a selection.
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

    document.body.appendChild(input);
    input.click();
  };

  // 📱 Native: pick image from device library
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

  // 🔒 Permission handling (only meaningful on native)
  if (Platform.OS !== 'web') {
    if (!permission) {
      return <Text>Requesting permission...</Text>;
    }

    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={{ color: '#fff', marginBottom: 10 }}>
            No camera access
          </Text>

          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Allow Camera</Text>
          </TouchableOpacity>

          {/* Even without camera, user can still upload an image */}
          <TouchableOpacity
            style={[styles.button, { marginTop: 20 }]}
            onPress={handleUploadPress}
            disabled={processing}
          >
            <Text style={styles.buttonText}>
              {processing ? 'Scanning...' : 'Upload QR Image'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  return (
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
              onBarcodeScanned={scanned ? undefined : handleScan}
            />
          </View>

          {/* Controls */}
          <View style={styles.controlRow}>
            {/* Flash */}
            <TouchableOpacity
              style={[styles.button, { marginRight: 10 }]}
              onPress={() => setFlash(flash === 'off' ? 'torch' : 'off')}
            >
              <Text style={styles.buttonText}>
                Flash: {flash === 'off' ? 'OFF' : 'ON'}
              </Text>
            </TouchableOpacity>

            {/* Camera switch */}
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

      {Platform.OS === 'web' && (
        <Text style={styles.webHint}>
          Upload a QR code image from your computer to scan it.
        </Text>
      )}

      {/* Upload (works on mobile library + PC file browse on web) */}
      <TouchableOpacity
        style={[styles.button, { marginTop: 20 }]}
        onPress={handleUploadPress}
        disabled={processing}
      >
        <Text style={styles.buttonText}>
          {processing
            ? 'Scanning...'
            : Platform.OS === 'web'
              ? 'Browse QR Image'
              : 'Upload QR Image'}
        </Text>
      </TouchableOpacity>

      {/* Preview */}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {/* Scan again (native camera only) */}
      {Platform.OS !== 'web' && scanned && (
        <TouchableOpacity
          style={[styles.button, { marginTop: 10 }]}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.buttonText}>Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 20,
    fontWeight: '600',
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
  button: {
    backgroundColor: '#00ddf1',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
  },
  webHint: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});
