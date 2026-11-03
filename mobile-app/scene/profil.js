import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import {useState} from 'react';
import { useEffect } from 'react';

import Sidebar from "../scene/sidebar";

const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000' 
  : 'http://10.0.2.2:5000';

export default function Profil({ navigation, route }) {

  const [ifopen,setifopen] = useState(false);
 
  const [nazwaZadania, setNazwaZadania] = useState('');
  const [dataZadania, setDataZadania] = useState('');
  const [czyWKalendarzu, setCzyWKalendarzu] = useState(false);
  
  const [zadania, setZadania] = useState([]);
  const [komunikat, setKomunikat] = useState('');
//tu pobiera id użytkownika albo testowo 1
  const idUzytkownika = route?.params?.id_uzytkownika || route?.params?.user?.id_uzytkownika || 1;

  // Funkcja pobierająca zadania z backendu
  const pobierzZadania = async () => {
    try {
      const response = await fetch(`${API_URL}/api/zadania/${idUzytkownika}`);
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setZadania(data);
      }
    } catch (err) {
      console.error('Błąd pobierania zadań:', err);
    }
  };

  // useEffect uruchamia się raz po wejściu na ekran – pobiera zadania
  useEffect(() => {
    pobierzZadania();
  }, [idUzytkownika]);

  // Funkcja dodająca zadanie
  const dodajZadanie = async () => {
    if (!nazwaZadania.trim()) {
      setKomunikat('Wpisz nazwę zadania!');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/zadania`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nazwa_zadania: nazwaZadania.trim(),
          data_zadania: dataZadania.trim() || null,
          czy_w_kalendarzu: czyWKalendarzu,
          id_uzytkownika: idUzytkownika,
        }),
      });

      if (response.ok) {
        setNazwaZadania('');
        setDataZadania('');
        setCzyWKalendarzu(false);
        setKomunikat('Dodano zadanie!');
        pobierzZadania(); // Odśwież listę zadań
      } else {
        setKomunikat('Błąd podczas dodawania zadania');
      }
    } catch (err) {
      console.error('Błąd sieci:', err);
      setKomunikat('Błąd połączenia z serwerem!');
    }
  };

  // Funkcja zmieniająca status zadania (wykonane / niewykonane)
  const zmienStatusZadania = async (idZadania, aktualnyStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/zadania/${idZadania}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ czy_wykonane: !aktualnyStatus }),
      });

      if (response.ok) {
        pobierzZadania(); // Odśwież listę po zmianie
      }
    } catch (err) {
      console.error('Błąd zmiany statusu:', err);
    }
  };

  const [fontsLoaded] = useFonts({
    'common font': require('../assets/JustMeAgainDownHere-Regular.ttf'),
  });
  if (!fontsLoaded) {
    return <Text>błąd przy ładowaniu czcionki</Text>;
  }
  return (   
    <ScrollView> 
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={()=>setifopen(true)}>
    <Text style={styles.normalText}>=</Text>
    </TouchableOpacity>
      <Text style={styles.whiteHeaderText}> Co Kto?</Text>
      </View> 
    <View style={styles.container}>
      <ImageBackground source={require('../assets/background.jpg')} style={styles.body}>
      <Text style={styles.blackHeaderText}>Profil</Text>

      {/* Formularz dodawania zadania ZMIENIC*/}
          <TextInput
            style={styles.inputText}
            placeholder="podaj nazwę zadania"
            value={nazwaZadania}
            onChangeText={(val) => setNazwaZadania(val)}
          />
          <TextInput
            style={styles.inputText}
            placeholder="podaj datę (np. 2026-06-10)"
            value={dataZadania}
            onChangeText={(val) => setDataZadania(val)}
          />

          {/* Przycisk do kalendarza wyglądający jak Wasze zwykłe przyciski */}
          <TouchableOpacity onPress={() => setCzyWKalendarzu(!czyWKalendarzu)}>
            <Text style={styles.normalText}>
              {czyWKalendarzu ? 'Wspólny kalendarz: TAK' : 'Wspólny kalendarz: NIE'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={dodajZadanie}>
            <Text style={styles.button2}>Dodaj Zadanie</Text>
          </TouchableOpacity>

          {komunikat !== '' && <Text style={styles.normalText}>{komunikat}</Text>}

          {/* Lista zadań korzystająca z Waszego stylu normalText */}
          <Text style={styles.blackHeaderText}>Twoje obowiązki:</Text>
          {zadania.length === 0 ? (
            <Text style={styles.normalText}>Brak zadań na liście.</Text>
          ) : (
            zadania.map((zadanie) => (
              <TouchableOpacity 
                key={zadanie.id_zadania} 
                onPress={() => zmienStatusZadania(zadanie.id_zadania, zadanie.czy_wykonane)}
              >
                <Text style={styles.normalText}>
                  {zadanie.czy_wykonane ? '[ZROBIONE] ' : '[DO ZROBIENIA] '} 
                  {zadanie.nazwa_zadania} 
                  {zadanie.data_zadania ? ` (${zadanie.data_zadania.split('T')[0]})` : ''}
                  {zadanie.czy_w_kalendarzu ? ' [Kalendarz]' : ''}
                </Text>
              </TouchableOpacity>
            ))
          )}

      </ImageBackground>
    </View>    
    </View> 
      {ifopen ? <Sidebar navigation={navigation} onClose={() => setifopen(false)}/>:null}
      <StatusBar style="auto" />     
    </ScrollView>
    
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
    flexDirection: 'row',
    justifyContent: 'flex-start', 
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
    minHeight:500,
  },
  whiteHeaderText:{
    flex:1,
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
    marginBottom: 10,
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
  menuButton:{
    fontSize: 30,
    color: 'black',
    fontFamily: 'common font',
    textAlign: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#3a0e00bb',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  }
});