import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Onboarding from './onboarding/OnBoardingScreen';
import HomeScreen from './onboarding/HomeScreen';
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();

const App= () => {
  const [fontsLoaded] = useFonts({
    Figtree: require('./assets/fonts/Figtree-Black.ttf'),
    JetBrains: require('./assets/fonts/IBMPlexMono-Regular.ttf'),
    JetBrainsBold: require('./assets/fonts/IBMPlexMono-SemiBold.ttf')
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="onboarding" component={Onboarding}/>
        <Stack.Screen name="homeScreen" component={HomeScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
