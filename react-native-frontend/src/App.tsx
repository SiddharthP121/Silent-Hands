import 'react-native-gesture-handler'; // Required for navigation to work
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import your custom screens
import HomeScreen from './screens/HomeScreen';
import GestureScreen from './screens/GestureScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false, // Removes the basic header for a modern full-screen UI
            cardStyle: { backgroundColor: '#F5F5F5' }, // Global background color
          }}
        >
          {/* Main Menu Screen */}
          <Stack.Screen name="Home" component={HomeScreen} />

          {/* Camera/Gesture Identification Screen */}
          <Stack.Screen name="GestureScreen" component={GestureScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
