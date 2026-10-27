import { StyleSheet, Text, View,  TouchableOpacity} from 'react-native';
import { useFonts } from 'expo-font';
import {useState} from 'react';

export default function Sidebar({navigation, onClose}) {
  const [fontsLoaded] = useFonts({
    'common font': require('../assets/JustMeAgainDownHere-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <Text>błąd przy ładowaniu czcionki</Text>;
  }
  const closesidebar = (screen) =>{
    if(onClose) onClose();
    navigation.navigate(screen);
  };
  return ( 
    <View style={styles.conteiner}>
    <View style={styles.sidebar}>
        <TouchableOpacity style={styles.touchableButton}>
            <Text style={styles.button} onPress={() => closesidebar('Profil')}> profil </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableButton}>
            <Text style={styles.button} onPress={() => closesidebar('Zadania')}> zadania </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableButton}>
            <Text style={styles.button} onPress={() => closesidebar('ListaZakupow')}> lista zakupów </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableButton}>
            <Text style={styles.button} onPress={() => closesidebar('Statystyki')}> statystyki </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableButton}>
            <Text style={styles.button} onPress={() => closesidebar('Ustawienia')}> ustawienia </Text>
        </TouchableOpacity>
    </View>
      <TouchableOpacity style={styles.tlo} activeOpacity={1} onPress={onClose}/> 
    </View>
  );
}
const styles = StyleSheet.create({
  conteiner:{
    position:'absolute',
    flexDirection: 'row',
    zIndex: 999,
    top:0,
    left: 0,
    right: 0,
    bottom:0,
  },
  sidebar:{
    width: '60%',
    height: '100%',
    backgroundColor: '#3a1b0c',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tlo:{
    backgroundColor: '#2b2a2a5e',
    flex:1,
    height: '100%',
  },
  button:{
    fontSize: 30,
    color: 'black',
    fontFamily: 'common font',
    textAlign: 'center',
    width:'80%',
    backgroundColor: '#914a34e7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom:10,
  },
  touchableButton: {
    width: '85%',
    alignItems: 'center',
  },
});