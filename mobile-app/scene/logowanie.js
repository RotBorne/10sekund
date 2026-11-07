import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import { setSessionUser } from './session';

const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000/api/logowanie' 
  : 'http://10.0.2.2:5000/api/logowanie';

export default function Logowanie({navigation}) {
  const [login, setLogin] = useState('');
  const [haslo, setHaslo] = useState('');
  const [komunikat, setKomunikat] = useState('');

  const handleLogin = async () => {
    if (login === '' || haslo === '') {
      setKomunikat('Wpisz login i hasło!');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: login,
          haslo: haslo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Serwer zwrócił błąd (np. status 400 lub 404)
        setKomunikat(data.error || 'Nieprawidłowy login lub hasło!');
      } else {
        // Logowanie udane!
        setKomunikat('');
        setSessionUser(data.user);

        // Jeśli użytkownik należy już do rodziny, kierujemy go bezpośrednio do Profilu
        if (data.user?.kod_rodziny) {
          navigation.navigate('Profil', { user: data.user });
        } else {
          navigation.navigate('Nowa rodzina', { user: data.user });
        }
      }
    } catch (err) {
      console.error(err);
      setKomunikat('Błąd połączenia z serwerem!');
    }
  };

  const [fontsLoaded] = useFonts({
    'common font': require('../assets/OpenSans-VariableFont_wdth,wght.ttf'),
  });

  if (!fontsLoaded) {
    return <Text>błąd przy ładowaniu czcionki</Text>;
  }

  return ( 
    <ScrollView>   
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.whiteHeaderText}>Co Kto?</Text>
      </View>
    <View style={styles.body}>
      <Text style={styles.blackHeaderText}>Logowanie</Text>
      <Text style={styles.normalText}> Login: </Text>
      <TextInput style={styles.inputText} placeholder="wpisz login" value={login} onChangeText={(val) => setLogin(val)} />
      <Text style={styles.normalText}>Hasło: </Text>
      <TextInput style={styles.inputText} placeholder="wpisz hasło" secureTextEntry={true} value={haslo} onChangeText={(val) => setHaslo(val)} />

      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.button2}> Zaloguj się </Text>
      </TouchableOpacity>

      {komunikat !== '' && (
        <Text style={styles.error}>{komunikat}</Text>
      )}

      <Text style={styles.normalText}> Nie masz konta? </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Rejestracja')}>
        <Text style={styles.button2}> Zarejestruj się </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    minHeight: 800,
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
    backgroundColor: '#f1d1b7',
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
  error: {
    fontSize: 25,
    color: 'red',
    fontFamily: 'common font',
    textAlign: 'center',
    marginTop: 10,
  },
});
