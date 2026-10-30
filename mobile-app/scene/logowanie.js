import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import { useFonts } from 'expo-font';

export default function Logowanie({navigation}) {
  const [login, setLogin] = useState('');
  const [haslo, setHaslo] = useState('');
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
    <View style={styles.conteiner2}>
      <ImageBackground source={require('../assets/background.jpg')} 
    style={styles.body}
    >
      <Text style={styles.blackHeaderText}>Logowanie</Text>
      <Text style={styles.normalText}> Login: </Text>
      <TextInput style={styles.inputText} placeholder="wpisz login" onChangeText={(val) => setLogin(val)} />
      <Text style={styles.normalText}>Hasło: </Text>
      <TextInput style={styles.inputText} placeholder="wpisz hasło" secureTextEntry={true} onChangeText={(val) => setHaslo(val)} />
      <TouchableOpacity>
        {/*przeszukaj baze czy istenie para: taki login z wpisanym hasłem*/}
      <Text style={styles.button2} onPress={() => navigation.navigate('Nowa rodzina')}> Zaloguj się </Text>
      </TouchableOpacity>
      <Text style={styles.normalText}> Nie masz konta? </Text>
      <TouchableOpacity>
      <Text style={styles.button2} onPress={() => navigation.navigate('Rejestracja')}> Zarejestruj się </Text>
      </TouchableOpacity>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
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