import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Rejestracja from './scene/rejestracja';
import Logowanie from './scene/logowanie';
import Nowarodzina from './scene/nowarodzina';
import Profil from './scene/profil';
import Zadania from './scene/zadania';
import ListaZakupow from './scene/lista-zakupow';
import Statystyki from './scene/statystyki';
import Ustawienia from './scene/ustawienia';
import Sidebar from './scene/sidebar';
import Kalendarz from './scene/kalendarz';

const Stack=createNativeStackNavigator();
export default function App() {

  return (      
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Logowanie" screenOptions={{headerShown: false}}>
        <Stack.Screen 
        name="Logowanie"
        component={Logowanie}
        />
        <Stack.Screen 
        name="Rejestracja"
        component={Rejestracja}
        />
        <Stack.Screen 
        name="Nowa rodzina"
        component={Nowarodzina}
        />
        <Stack.Screen 
        name="Profil"
        component={Profil}
        />
        <Stack.Screen 
        name="Zadania"
        component={Zadania}
        />
        <Stack.Screen 
        name="ListaZakupow"
        component={ListaZakupow}
        />
        <Stack.Screen 
        name="Statystyki"
        component={Statystyki}
        />
        <Stack.Screen 
        name="Ustawienia"
        component={Ustawienia}
        />
        <Stack.Screen 
        name="Sidebar"
        component={Sidebar}
        />
        <Stack.Screen 
        name="Kalendarz"
        component={Kalendarz}
        />
      </Stack.Navigator>      
    </NavigationContainer>
  );
}