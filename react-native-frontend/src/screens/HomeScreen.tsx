import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme colors
  const theme = {
    background: isDarkMode ? '#121212' : '#F8F9FA',
    text: isDarkMode ? '#FFFFFF' : '#1A1A1A',
    cardSubtext: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.9)',
  };

  const menuItems = [
    { title: 'Identify gesture', color: '#00B4D8', screen: 'GestureScreen' },
    { title: 'Live transcript', color: '#4CAF50', screen: 'Live' },
    { title: 'Upload Image', color: '#FFD166', screen: 'Upload' },
    { title: 'Record gesture', color: '#F77F00', screen: 'Record' },
    { title: 'Learn gestures', color: '#9D4EDD', screen: 'LearnGestures' },
    { title: 'Upload window', color: '#06D6A0', screen: 'Window' },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Top Bar with Dark Mode Toggle */}
      <View style={styles.topBar}>
        <Text style={[styles.headerText, { color: theme.text }]}>HOME</Text>
        <TouchableOpacity
          style={[
            styles.modeToggle,
            { backgroundColor: isDarkMode ? '#333' : '#E0E0E0' },
          ]}
          onPress={() => setIsDarkMode(!isDarkMode)}
        >
          <Text style={{ fontSize: 20 }}>{isDarkMode ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.85}
              style={[styles.card, { backgroundColor: item.color }]}
              onPress={() => {
                item.screen === 'GestureScreen' &&
                  navigation.navigate('GestureScreen');
                item.screen === 'LearnGestures' &&
                  navigation.navigate('LearnScreen');
              }}
            >
              <View style={styles.cardOverlay} />
              <Text style={styles.cardText}>{item.title}</Text>
              <View style={styles.dot} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.quitButton}>
        <Text style={styles.quitText}>Quit app</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 20,
    width: '100%',
  },
  headerText: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  modeToggle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  scrollContent: { paddingBottom: 120 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  card: {
    width: (width - 60) / 2,
    height: 160,
    borderRadius: 24,
    marginBottom: 20,
    padding: 20,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.1)', // Subtle sheen
  },
  cardText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  quitButton: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 35,
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    elevation: 8,
  },
  quitText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

export default HomeScreen;
