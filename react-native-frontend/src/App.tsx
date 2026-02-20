import 'react-native-gesture-handler'; 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import GestureScreen from './screens/GestureScreen';
import LearnGestures from './screens/LearnGestures';
import GestureDetails from './screens/GestureDetails';
import { Gesture } from './constants/index.d';
import { RootStackParamList } from './constants/index.d';


const Stack = createStackNavigator<RootStackParamList>();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false, 
            cardStyle: { backgroundColor: '#F5F5F5' }, 
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="GestureScreen" component={GestureScreen} />
          <Stack.Screen name="GestureDetails" component={GestureDetails} />
          <Stack.Screen name="LearnGestures" component={LearnGestures} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
