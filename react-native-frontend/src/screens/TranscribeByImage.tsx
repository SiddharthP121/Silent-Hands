import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';
import { RootStackParamList } from '../constants/index.d';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TranscribeByImageNavigationalProps = StackNavigationProp<
  RootStackParamList,
  'TranscribeByImage'
>;

// App: User picks an image from their gallery or camera. done

// S3: The app uploads the image to an S3 Bucket (Simple Storage Service).

// Lambda: A function is triggered automatically when the image hits the bucket.

// Rekognition: The Lambda sends the image to Rekognition to identify the gesture.

// DynamoDB: The results (e.g., "This is the 'Peace' sign") are saved to your user's table.

const TranscribeByImage = () => {
  const navigation = useNavigation<TranscribeByImageNavigationalProps>();
  const [image, setImage] = useState<Asset[]>();
  const handlePickFromGallery = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        Alert.alert('Image gallery closed');
      } else if (response.errorCode) {
        console.log(
          'Facing issue in launchImageLibrary() ::',
          response.errorMessage,
        );
      } else {
        setImage(response.assets);
      }
    });
  };
  const handleCapture = () => {
    const options: CameraOptions = {
      mediaType: 'photo',
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        Alert.alert('Mobile camera turned off');
      } else if (response.errorCode) {
        Alert.alert(
          'Error occured in launchCamera::',
          response.errorMessage || 'Unknown error',
        );
      } else {
        setImage(response.assets);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (image) {
              setImage(undefined);
            } else {
              navigation.goBack();
            }
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>
            {image ? '← Clear' : '← Back'}
          </Text>
        </TouchableOpacity>
      </View>
      {image ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: image[0].uri }}
            style={styles.previewImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#74be46', margin: 20 }]}
          >
            <Text style={styles.cardText}>Transcribe</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.innerContainer}>
          <TouchableOpacity
            onPress={() => handlePickFromGallery()}
            style={styles.placeholderContainer}
          >
            <Image
              source={require('../../assets/clickToAddImage.png')}
              style={styles.placeholderImage}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Upload Image</Text>
          <Text style={styles.subtitle}>Choose an option to transcribe</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: '#00B4D8' }]}
              activeOpacity={0.8}
              onPress={() => handlePickFromGallery()}
            >
              <Text style={styles.cardText}>🖼️ Pick from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: '#FFD166' }]}
              activeOpacity={0.8}
              onPress={() => handleCapture()}
            >
              <Text style={styles.cardText}>📸 Open Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default TranscribeByImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    marginBottom: 30,
    opacity: 0.7,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 50,
  },
  optionsContainer: {
    width: '100%',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewImage: {
    width: '100%',
    height: '80%',
    borderRadius: 20,
    backgroundColor: '#000',
  },
  card: {
    width: '100%',
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  transcribe: {},
});
