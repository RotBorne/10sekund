import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Rejestracja from './scene/rejestracja';
import Logowanie from './scene/logowanie';

const Stack=createNativeStackNavigator();
export default function App() {

  return (      
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Logowanie">
        <Stack.Screen 
        name="Logowanie"
        component={Logowanie}
        />
        <Stack.Screen 
        name="Rejestracja"
        component={Rejestracja}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}