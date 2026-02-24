import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import React from 'react';

const { width } = Dimensions.get('window');

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splashScreenLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Silent Hands</Text>
      <Text style={styles.tagline}>Let them talk, the mute</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#00B4D8',
    marginBottom: 10,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 18,
    color: '#555',
    fontStyle: 'italic',
  },
});
    