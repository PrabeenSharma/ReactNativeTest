import { CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  // ✅ ENUM BASED (type-safe)
  const [flash, setFlash] = useState<FlashMode>('off');
  const [cameraType, setCameraType] = useState<CameraType>('back');

  const router = useRouter();

  const extractSlug = (data: any) => {
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

  const handleScan = ({ data }: { data: any }) => {
    setScanned(true);

    const slug = extractSlug(data);

    router.push({
      pathname: '/dashboard',
      params: { slug },
    });

    setTimeout(() => setScanned(false), 2000);
  };

  const pickImageAndScan = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const [imageUri, setImageUri] = useState<string | null>(null);

      const formData = new FormData();
      formData.append(
        'file',
        {
          uri: uri,
          name: 'qr.jpg',
          type: 'image/jpeg',
        } as unknown as Blob
      );

      try {
        const res = await fetch(
          'https://api.qrserver.com/v1/read-qr-code/',
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await res.json();
        const qrData = data?.[0]?.symbol?.[0]?.data;

        if (qrData) {
          const slug = extractSlug(qrData);

          router.push({
            pathname: '/dashboard',
            params: { slug },
          });
        } else {
          alert('No QR found in image');
        }
      } catch (err) {
        alert('Error scanning image');
      }
    }
  };

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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Ticket</Text>

      <View style={styles.scannerBox}>
        <CameraView
          style={{ flex: 1 }}
          facing={cameraType}   // ✅ works
          flash={flash}         // ✅ works
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleScan}
        />
      </View>

      <View style={styles.controlRow}>
        {/* 🔦 Flash */}
        <TouchableOpacity
          style={[styles.button, { marginRight: 10 }]}
          onPress={() =>
            setFlash((flash === 'off' ? 'torch' : 'off') as FlashMode)
          }
        >
          <Text style={styles.buttonText}>
            Flash: {flash === 'off' ? 'OFF' : 'ON'}
          </Text>
        </TouchableOpacity>

        {/* 🔄 Camera */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setCameraType(
              cameraType === 'back' ? 'front' : 'back'
            )
          }
        >
          <Text style={styles.buttonText}>
            Camera: {cameraType === 'back' ? 'Back' : 'Front'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, { marginTop: 20 }]}
        onPress={pickImageAndScan}
      >
        <Text style={styles.buttonText}>Upload QR Image</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      {scanned && (
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
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});