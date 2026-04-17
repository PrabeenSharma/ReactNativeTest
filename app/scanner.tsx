import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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
  const webInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      ImagePicker.requestMediaLibraryPermissionsAsync();
    }
  }, []);

  // 🔍 Extract slug
  const extractSlug = (data: string) => {
    let slug = '';

    if (data.includes('slug=')) {
      slug = data.split('slug=')[1];
    } else if (data.startsWith('http')) {
      slug = data.split('/').filter(Boolean).pop() || '';
    } else {
      slug = data;
    }

    return slug;
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

  // 🖥️ Web: browse file from PC via hidden <input type="file"/>
  const onWebUploadPress = () => {
    webInputRef.current?.click();
  };

  const onWebFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    // reset so selecting the same file again still fires the change event
    event.target.value = '';
    if (!file) return;

    setImageUri(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);

    await decodeQrAndRoute(formData);
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
      onWebUploadPress();
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

      {/* Hidden file input used on web to open the OS file browser */}
      {Platform.OS === 'web' && (
        <input
          ref={webInputRef}
          type="file"
          accept="image/*"
          onChange={onWebFileSelected}
          style={{ display: 'none' }}
        />
      )}

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
