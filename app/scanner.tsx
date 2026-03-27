import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  if (!permission) {
    return <Text>Requesting permission...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No camera access</Text>
        <Text onPress={requestPermission}>Allow Camera</Text>
      </View>
    );
  }

  const handleScan = ({ data }) => {
    setScanned(true);

    // 👉 scanned URL dashboard এ পাঠানো
    router.push({
      pathname: '/dashboard',
      params: { apiUrl: data },
    });
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Scan Ticket</Text>

      {/* 📷 Half Scanner */}
      <View style={styles.scannerBox}>
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'], // only QR scan
          }}
          onBarcodeScanned={scanned ? undefined : handleScan}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
  },
  scannerBox: {
    width: '90%',
    height: '50%',
    borderRadius: 10,
    overflow: 'hidden',
  },
});