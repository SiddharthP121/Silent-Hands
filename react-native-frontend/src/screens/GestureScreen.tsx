import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import axios from 'axios';

// --- CONFIGURATION ---
const SERVER_IP = '172.26.106.100'; // Update only this line next time!
const BASE_URL = `http://${SERVER_IP}:5000/predict`;

const GestureScreen = ({ navigation }: any) => {
  const [prediction, setPrediction] = useState<string>('Initializing AI...');
  const [cameraDevice, setCameraDevice] = useState(CameraType.Front);
  const cameraRef = useRef<any>(null);
  const isAnalyzing = useRef(false);

  useEffect(() => {
    const stream = setInterval(() => {
      detectGesture();
    }, 1000);

    return () => clearInterval(stream);
  }, []);

  const detectGesture = async () => {
    if (isAnalyzing.current || !cameraRef.current) return;

    isAnalyzing.current = true;
    try {
      const frame = await cameraRef.current.capture();

      if (frame && frame.uri) {
        const formData = new FormData();

        // Creating the file object properly for Axios
        const photo = {
          uri:
            Platform.OS === 'android'
              ? frame.uri
              : frame.uri.replace('file://', ''),
          type: 'image/jpeg',
          name: 'live_frame.jpg',
        };

        formData.append('image', photo as any);

        const response = await axios.post(BASE_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 3000,
        });

        if (response.data.sign && response.data.sign !== 'None') {
          setPrediction(response.data.sign);
        } else if (response.data.sign === 'None') {
          setPrediction('No Hand Detected');
        }
      }
    } catch (err: any) {
      // If you see "Network Error" here, the IP is wrong or the server is off
      console.log('Actual Error:', err.message);
      setPrediction('Network Error 🛑');
    } finally {
      isAnalyzing.current = false;
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        cameraType={cameraDevice}
        flashMode="auto"
        focusMode="on"
        {...({
          playSoundOnCapture: false,
          shutterSound: false,
        } as any)}
      />
      <View style={styles.uiOverlay}>
        <TouchableOpacity
          style={styles.flipBtn}
          onPress={() =>
            setCameraDevice(
              cameraDevice === CameraType.Back
                ? CameraType.Front
                : CameraType.Back,
            )
          }
        >
          <Text style={styles.btnText}>🔄 FLIP CAMERA</Text>
        </TouchableOpacity>

        <View style={styles.meaningBox}>
          <Text style={styles.label}>MEANING</Text>
          <Text style={styles.meaningText}>{prediction}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  uiOverlay: { flex: 1, justifyContent: 'space-between', padding: 30 },
  flipBtn: {
    alignSelf: 'flex-end',
    marginTop: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 15,
  },
  meaningBox: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    elevation: 20,
  },
  label: { fontSize: 12, color: '#00B4D8', fontWeight: 'bold' },
  meaningText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
  },
  btnText: { color: 'white', fontWeight: 'bold' },
});

export default GestureScreen;
