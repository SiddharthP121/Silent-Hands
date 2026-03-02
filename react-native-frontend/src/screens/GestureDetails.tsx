import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { RootStackParamList } from '../constants/index.d';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '../components/Loading';

const { width } = Dimensions.get('window');

type GestureDetailsRouteProps = RouteProp<RootStackParamList, 'GestureDetails'>;

const GestureDetails = ({ route }: { route: GestureDetailsRouteProps }) => {
  const navigation = useNavigation();
  const gesture = route.params?.gesture;

  // State for immediate UI feedback
  const [isLearned, setIsLearned] = useState(gesture?.isLearned || false);

  if (!gesture) {
    return <Loading />;
  }

  const toggleLearned = () => {
    setIsLearned(!isLearned);
    // You can add your fetch call here to update the 'isLearned' status in your DB
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonIcon}>‹</Text>
          <Text style={styles.backButtonText}>Library</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Practice</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: gesture.image_url || 'https://via.placeholder.com/300',
            }}
            style={styles.referenceImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.meaningText}>{gesture.meaning}</Text>
          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Instruction</Text>
          <Text style={styles.descriptionText}>{gesture.description}</Text>

          {/* Category placed after description as requested */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Category:</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {gesture.category || 'General'}
              </Text>
            </View>
          </View>

          <View style={styles.statusBox}>
            <Text
              style={[
                styles.statusText,
                { color: isLearned ? '#2D6A4F' : '#666' },
              ]}
            >
              {isLearned
                ? '✓ You have mastered this gesture'
                : '○ Still practicing'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.mainButton,
            isLearned ? styles.buttonLearned : styles.buttonUnlearned,
          ]}
          onPress={toggleLearned}
        >
          <Text style={styles.mainButtonText}>
            {isLearned ? 'Learned' : 'Mark as Learned'}
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonIcon: {
    fontSize: 35,
    color: '#00B4D8',
    marginTop: -5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#00B4D8',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  imageWrapper: {
    width: width,
    height: 320,
    backgroundColor: '#F2F2F2',
  },
  referenceImage: {
    width: '100%',
    height: '100%',
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  meaningText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#111',
  },
  divider: {
    height: 5,
    width: 50,
    backgroundColor: '#00B4D8',
    borderRadius: 10,
    marginVertical: 15,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A0A0A0',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 28,
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  categoryLabel: {
    fontSize: 15,
    color: '#666',
    marginRight: 10,
    fontWeight: '500',
  },
  categoryBadge: {
    backgroundColor: '#EBFBFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CAF0F8',
  },
  categoryText: {
    fontSize: 14,
    color: '#0077B6',
    fontWeight: '600',
  },
  statusBox: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  mainButton: {
    height: 55,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonUnlearned: {
    backgroundColor: '#00B4D8',
  },
  buttonLearned: {
    backgroundColor: '#2D6A4F',
  },
  mainButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
