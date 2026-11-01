import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useFonts } from 'expo-font';

const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000/api/rejestracja' 
  : 'http://10.0.2.2:5000/api/rejestracja';

export default function Rejestracja({ navigation }) {
  const [login, setLogin] = useState('');
  const [haslo, setHaslo] = useState('');
  const [powtorz, setPowtorz] = useState('');
  const [komunikat, setKomunikat] = useState('');
  const [typ, setTyp] = useState('error');

  const warRej = async () => {
    if (haslo === '' || powtorz === '') {
      setKomunikat('Wprowadź hasło!');
      setTyp('error');
      return;
    }
    if (haslo !== powtorz) {
      setKomunikat('Hasła muszą być identyczne!');
      setTyp('error');
      return;
    }
    if (login === '') {
      setKomunikat('Podaj login!');
      setTyp('error');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: login,
          haslo: haslo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setKomunikat(data.error || 'Błąd podczas rejestracji');
        setTyp('error');
      } else {
        setKomunikat('Twoje dane zostały dodane do bazy!');
        setTyp('poprawny');

        setTimeout(() => {
          navigation.navigate('Logowanie');
        }, 1500);
      }
    } catch (err) {
      console.error('Błąd połączenia:', err);
      setKomunikat('Błąd połączenia z serwerem!');
      setTyp('error');
    }
  };

  const [fontsLoaded] = useFonts({
    'common font': require('../assets/JustMeAgainDownHere-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <Text>błąd przy ładowaniu czcionki</Text>;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.whiteHeaderText}>Co Kto?</Text>
        </View>
        <View style={styles.conteiner2}>
          <ImageBackground source={require('../assets/background.jpg')} style={styles.body}>
            <Text style={styles.blackHeaderText}>Rejestracja</Text>

            <Text style={styles.normalText}>Login:</Text>
            <TextInput
              style={styles.inputText}
              placeholder="podaj login"
              value={login}
              onChangeText={(val) => setLogin(val)}
            />

            <Text style={styles.normalText}>Hasło:</Text>
            <TextInput
              style={styles.inputText}
              placeholder="podaj hasło"
              secureTextEntry={true}
              value={haslo}
              onChangeText={(val) => setHaslo(val)}
            />

            <Text style={styles.normalText}>Powtórz hasło:</Text>
            <TextInput
              style={styles.inputText}
              placeholder="powtórz hasło"
              secureTextEntry={true}
              value={powtorz}
              onChangeText={(val) => setPowtorz(val)}
            />

            <TouchableOpacity onPress={warRej}>
              <Text style={styles.button2}>Zarejestruj</Text>
            </TouchableOpacity>

            {komunikat !== '' && (
              <Text style={typ === 'error' ? styles.error : styles.komunikaty}>
                {komunikat}
              </Text>
            )}

            <Text style={styles.normalText}>Masz Konto?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.button2}>Zaloguj się</Text>
            </TouchableOpacity>
          </ImageBackground>
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
  },
  conteiner2: {
    flex: 1,
    flexDirection: 'row',
  },
  header: {
    width: '100%',
    backgroundColor: '#4e1f08de',
    alignItems: 'center',
    paddingTop: 30,
  },
  normalText: {
    fontSize: 30,
    color: 'black',
    fontFamily: 'common font',
    textAlign: 'left',
    marginTop: 20,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 40,
  },
  whiteHeaderText: {
    width: '100%',
    fontWeight: 'bold',
    fontSize: 40,
    paddingBottom: 10,
    color: 'white',
    fontFamily: 'common font',
    textAlign: 'center',
  },
  blackHeaderText: {
    width: '100%',
    fontWeight: 'bold',
    fontSize: 40,
    paddingBottom: 10,
    color: 'black',
    fontFamily: 'common font',
    textAlign: 'center',
  },
  button2: {
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
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 2,
    shadowRadius: 10,
  },
  inputText: {
    borderWidth: 2,
    borderColor: '#313131',
    fontSize: 30,
    color: 'black',
    fontFamily: 'common font',
    textAlign: 'center',
    padding: 5,
    margin: 5,
    minWidth: 200,
  },
  error: {
    fontSize: 25,
    color: 'red',
    fontFamily: 'common font',
    textAlign: 'center',
    marginTop: 10,
  },
  komunikaty: {
    fontSize: 25,
    color: '#025e07',
    fontFamily: 'common font',
    textAlign: 'center',
    marginTop: 10,
  },
});