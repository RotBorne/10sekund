import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import {useState} from 'react';

export default function Zadania({navigation}) {
  const [fontsLoaded] = useFonts({
    'common font': require('../assets/JustMeAgainDownHere-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <Text>błąd przy ładowaniu czcionki</Text>;
  }

  return (    
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.whiteHeaderText}>Co Kto?</Text>
      </View>
    <ScrollView>
    <View style={styles.conteiner2}>
        <View style={styles.sidebar}>
          <TouchableOpacity>
            <Text style={styles.button} onPress={() => navigation.navigate('Profil')}> profil </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.button} onPress={() => navigation.navigate('Zadania')}> zadania </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.button} onPress={() => navigation.navigate('ListaZakupow')}> lista zakupów </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.button} onPress={() => navigation.navigate('Statystyki')}> statystyki </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.button} onPress={() => navigation.navigate('Ustawienia')}> ustawienia </Text>
          </TouchableOpacity>
        </View>
      <ImageBackground source={require('../assets/background.jpg')} 
    style={styles.body}>
      <Text style={styles.blackHeaderText}>Zadania</Text>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  conteiner2:{
    flex: 1,
    flexDirection: 'row',
  },
  header:{
    width: '100%',
    backgroundColor: '#4e1f08de',
    alignItems: 'center', 
    paddingTop: 30,
  },
  normalText:{    
    fontSize: 30,
    color: 'black',
    fontFamily: 'common font',
    textAlign: 'left',
    marginTop: 20,

  },
  body:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  whiteHeaderText:{
    width: '100%',
    fontWeight: 'bold',
    fontSize: 40,
    paddingBottom: 10,
    color: 'white',
    fontFamily: 'common font',
    textAlign: 'center',
  },
  blackHeaderText:{
    width: '100%',
    fontWeight: 'bold',
    fontSize: 40,
    paddingBottom: 10,
    color: 'black',
    fontFamily: 'common font',
    textAlign: 'center',
  },
  sidebar:{
    width: '20%',
    height: '100%',
    backgroundColor: '#99451ea2',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  button:{
    fontSize: 30,
    color: 'black',
    fontFamily: 'common font',
    textAlign: 'center',
    width:'60%',
    backgroundColor: '#3a0e00a2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom:10,
  },
  button2:{
    fontSize: 30,
    color: 'black',
    fontFamily: 'common font',
    textAlign: 'center',
    width: '60%',
    backgroundColor: '#3a0e00bb',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 30,
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  inputText:{
    borderWidth: 2,
    borderColor: '#313131',
    fontSize: 30,
    color: 'black',
    fontFamily: 'common font',
    textAlign: 'center',
    padding: 5,
    margin:5,
  },
});