import { Image, StyleSheet, Text, View, Pressable } from 'react-native';
import React, { useState, useEffect, Component } from 'react';
import { getAllGestures } from '../services/gestureService';
import Loading from '../components/Loading';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import GestureDetails from './GestureDetails';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../constants/index.d';
import { Gesture } from '../constants/index.d';

type LearnScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LearnGestures'
>;

const LearnGestures = () => {
  const navigation = useNavigation<LearnScreenNavigationProp>();
  const [gestures, setGestures] = useState<Gesture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Gesture[]>([]);

  useEffect(() => {
    const getInitialData = async () => {
      const data = await getAllGestures();
      // console.log(data)
      // Map data to match Gesture interface
      const mappedData: Gesture[] = (data as any[]).map(item => ({
        gesture_id: item.gesture_id || item.id || Math.random().toString(),
        meaning: item.gesture_name || 'Unknown',
        description: item.description || '',
        image_url: item.image_url || item.imageUrl || '',
      }));
      setGestures(mappedData);
      setFilteredData(mappedData);
      setLoading(false);
    };
    getInitialData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const queryResult = gestures.filter(gesture =>
      gesture.meaning.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredData(queryResult);
  };

  const renderItem = ({ item }: { item: Gesture }) => {
    return (
      <Pressable
        onPress={() => navigation.navigate('GestureDetails', { gesture: item })}
      >
        <View style={styles.card}>
          <Image
            source={{
              uri: item.image_url || 'https://via.placeholder.com/150',
            }}
            resizeMode="center"
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.meaningText}>{item.meaning}</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Library</Text>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="🔍Search Gestures..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchBar}
        />
      </View>
      <FlatList
        data={filteredData ? filteredData : gestures}
        renderItem={renderItem}
        keyExtractor={item => item.gesture_id}
        contentContainerStyle={styles.listPadding}
      />
    </SafeAreaView>
  );
};

export default LearnGestures;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { fontSize: 28, fontWeight: 'bold', margin: 20, color: '#333' },
  listPadding: { paddingHorizontal: 15, paddingBottom: 20 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 16,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  image: { width: 120, height: 120 },
  textContainer: { flex: 1, padding: 12, justifyContent: 'center' },
  meaningText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  descriptionText: { fontSize: 14, color: '#666', marginTop: 4 },

  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    height: 45,
    backgroundColor: '#f1f1f1',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
