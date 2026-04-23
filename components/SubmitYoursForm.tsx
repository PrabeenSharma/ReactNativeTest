import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void; // ✅ ADD
};

export default function SubmitStoryModal({ visible, onClose, onSuccess }: Props) {
  const [name, setName] = useState('');
  const [passenger, setPassenger] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Permission required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !passenger) {
      alert('Name & Passenger Number required');
      return;
    }

    try {
      setLoading(true);

      let base64Image = '';

      if (image) {
        if (Platform.OS === 'web') {
          const response = await fetch(image);
          const blob = await response.blob();

          const reader = new FileReader();
          base64Image = await new Promise((resolve, reject) => {
            reader.onloadend = () => {
              const base64data = reader.result as string;
              resolve(base64data.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } else {
          base64Image = await FileSystem.readAsStringAsync(image, {
            encoding: 'base64',
          });
        }
      }

      const res = await fetch(
        'https://dev4work.com/thefirstonmars/wp-json/custom/v1/submit-story',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            passenger,
            message,
            image: base64Image,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setName('');
        setPassenger('');
        setMessage('');
        setImage(null);

        onClose();

        // ✅ FIX
        if (onSuccess) {
          onSuccess();
        }
      } else {
        alert('Submit failed ❌');
      }
    } catch (err) {
      console.log(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>

          <View style={styles.header}>
            <Text style={styles.title}>SUBMIT YOUR STORY</Text>
            <Text onPress={onClose} style={styles.close}>✕</Text>
          </View>

          <Text style={styles.label}>NAME</Text>
          <TextInput
            placeholder="Your Name"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>PASSENGER NUMBER</Text>
          <TextInput
            placeholder="Your Passenger Number"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={passenger}
            onChangeText={setPassenger}
          />

          <Text style={styles.label}>UPLOAD IMAGE</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
            <Text style={{ color: '#fff' }}>
              {image ? 'Image Selected' : 'Choose File'}
            </Text>
          </TouchableOpacity>

          {image && (
            <Image source={{ uri: image }} style={styles.preview} />
          )}

          <Text style={styles.label}>YOUR MESSAGE (OPTIONAL)</Text>
          <TextInput
            placeholder="Your message"
            placeholderTextColor="#aaa"
            style={[styles.input, { height: 80 }]}
            multiline
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? 'Submitting...' : 'SUBMIT'}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#0b2a44',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#00d9ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  close: {
    color: '#fff',
    fontSize: 18,
  },
  label: {
    color: '#aaa',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#3aaed8',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
  },
  uploadBtn: {
    borderWidth: 1,
    borderColor: '#3aaed8',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: 150,
    marginTop: 10,
    borderRadius: 10,
  },
  submitBtn: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#00d9ff',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  submitText: {
    color: '#00d9ff',
    fontWeight: 'bold',
  },
});