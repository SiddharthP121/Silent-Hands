import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { RootStackParamList } from '../constants/index.d';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '../components/Loading';

type GestureDetailsRouteProps = RouteProp<RootStackParamList, 'GestureDetails'>;

const GestureDetails = ({ route }: { route: GestureDetailsRouteProps }) => {
  const navigation = useNavigation();
  const gesture = route.params?.gesture;
  if (!gesture) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back to Library</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: gesture.image_url || 'https://via.placeholder.com/300',
            }}
            style={styles.referenceImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.meaningText}>{gesture.meaning}</Text>
          <Text style={styles.descriptionText}>{gesture.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            gesture.isLearned = !gesture.isLearned;
          }}
        >
          <Text style={styles.buttonText}>
            {gesture.isLearned ? 'Unmark as Learned' : 'Mark as Learned'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GestureDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  imageContainer: {
    margin: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  referenceImage: {
    width: '100%',
    height: 300,
    borderRadius: 15,
  },
  detailsContainer: {
    paddingHorizontal: 25,
    marginTop: 10,
  },
  meaningText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  descriptionText: {
    fontSize: 17,
    color: '#555',
    lineHeight: 26,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(248, 249, 250, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#00B4D8',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#00B4D8',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
