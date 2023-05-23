import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet} from 'react-native';
import CameraScreen from '../app/CameraScreen';
import ResultScreen from '../app/ResultScreen';
import AICamera from '../app/AICamera';
const COLORS = {primary: '#FFE7C9' , white: '#FFF'};

const Stack = createNativeStackNavigator();

const HomeScreen = () => {
    return (
        <NavigationContainer independent={true}>
          <Stack.Navigator 
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#ddf0f6',
                },
                headerShadowVisible: false,
                headerTintColor: '#062639',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                }}
            >
            <Stack.Screen name='Barcode' component={CameraScreen}
              // options={{
              //   title: 'Camera',
              //   headerStyle: {
              //     backgroundColor: '#ffffff',
              //   },
              //   headerShadowVisible: false,
              //   headerTintColor: '#000000',
              //   headerTitleStyle: {
              //     fontWeight: 'bold',
              //   },
              // }}
              />
            <Stack.Screen name='Result' component={ResultScreen}/>
            <Stack.Screen 
              name='AICamera' 
              component={AICamera}
              options={{
                headerShown: false
              }}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
}

const styles = StyleSheet.create({
    
})

export default HomeScreen