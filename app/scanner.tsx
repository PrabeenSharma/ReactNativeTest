import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  // 🔒 Permission loading
  if (!permission) {
    return <Text>Requesting permission...</Text>;
  }

  // ❌ Permission denied
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
const handleScan = ({ data }: { data: string }) => {
  setScanned(true);

  let slug = '';

  if (data.includes('slug=')) {
    // 👉 extract from query param
    slug = data.split('slug=')[1];
  } else if (data.startsWith('http')) {
    // 👉 extract from normal URL
    slug = data.split('/').filter(Boolean).pop() || '';
  } else {
    // 👉 already slug
    slug = data;
  }

  router.push({
    pathname: '/dashboard',
    params: { slug },
  });

  setTimeout(() => setScanned(false), 2000);
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Ticket</Text>

      {/* 📷 Scanner Box */}
      <View style={styles.scannerBox}>
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleScan}
        />
      </View>

      {/* 🔁 Rescan Button */}
      {scanned && (
        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
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
  button: {
    backgroundColor: '#00ddf1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
  },
});