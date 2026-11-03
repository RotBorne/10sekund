import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import {useState} from 'react';
import { useEffect } from 'react';

import Sidebar from "../scene/sidebar";

const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000' 
  : 'http://10.0.2.2:5000';

  //funkcje do obługi dat (DD_MM_YYYY do fronta i YYYY-MM-DD do bazy
const formatujDateNaPL = (d) => {
  const dzien = String(d.getDate()).padStart(2, '0');
  const miesiac = String(d.getMonth() + 1).padStart(2, '0');
  const rok = d.getFullYear();
  return `${dzien}.${miesiac}.${rok}`;
};

const formatujDateDoBazy = (d) => {
  const rok = d.getFullYear();
  const miesiac = String(d.getMonth() + 1).padStart(2, '0');
  const dzien = String(d.getDate()).padStart(2, '0');
  return `${rok}-${miesiac}-${dzien}`;
};

const pobierzPoczatekTygodnia = (data) => {
  const d = new Date(data);
  const dzienTygodnia = d.getDay();
  const roznica = d.getDate() - dzienTygodnia + (dzienTygodnia === 0 ? -6 : 1);
  return new Date(d.setDate(roznica));
};

export default function Profil({ navigation, route }) {

  const [ifopen,setifopen] = useState(false);
 
  const [nazwaZadania, setNazwaZadania] = useState('');
  const [dataZadania, setDataZadania] = useState('');
  const [czyWKalendarzu, setCzyWKalendarzu] = useState(false);
  
  const [zadania, setZadania] = useState([]);
  const [komunikat, setKomunikat] = useState('');
  const [poczatekTygodnia, setPoczatekTygodnia] = useState(pobierzPoczatekTygodnia(new Date()));
  const [pokazFormularz, setPokazFormularz] = useState(false);
//tu pobiera id użytkownika albo testowo 1
  const idUzytkownika = route?.params?.id_uzytkownika || route?.params?.user?.id_uzytkownika || 1;

  // Generowanie 7 dni tygodnia na podstawie stanu poczatekTygodnia
  const dniTygodniaNazwy = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
  const dniTygodnia = dniTygodniaNazwy.map((nazwa, index) => {
    const d = new Date(poczatekTygodnia);
    d.setDate(d.getDate() + index);
    return {
      nazwa,
      isoDate: formatujDateDoBazy(d),   // do dopasowania z bazą (YYYY-MM-DD)
      displayDate: formatujDateNaPL(d), // do ładnego wyświetlenia (DD-MM-YYYY)
    };
  });

  // Etykieta zakresu dat na samej górze (np. 01.06 - 07.06)
  const koniecTygodnia = new Date(poczatekTygodnia);
  koniecTygodnia.setDate(koniecTygodnia.getDate() + 6);
  const zakresEtykieta = `${formatujDateNaPL(poczatekTygodnia).slice(0, 5)} - ${formatujDateNaPL(koniecTygodnia).slice(0, 5)}`;

  // Nawigacja strzałkami tygodnia
  const poprzedniTydzien = () => {
    const nowaData = new Date(poczatekTygodnia);
    nowaData.setDate(nowaData.getDate() - 7);
    setPoczatekTygodnia(nowaData);
  };

  const nastepnyTydzien = () => {
    const nowaData = new Date(poczatekTygodnia);
    nowaData.setDate(nowaData.getDate() + 7);
    setPoczatekTygodnia(nowaData);
  };

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

    // Konwersja wpisanej daty DD-MM-YYYY z powrotem do formatu dla bazy YYYY-MM-DD (jeśli podano)
     let dataDoBazy = null;
    const wpisanaData = dataZadania.trim();
    if (wpisanaData) {
      const separator = wpisanaData.includes('.') ? '.' : '-';
      const czesci = wpisanaData.split(separator);
      if (czesci.length === 3) {
        // Jeśli wpisano DD-MM-YYYY lub DD.MM.YYYY -> przekształć do YYYY-MM-DD dla bazy
        if (czesci[0].length <= 2 && czesci[2].length === 4) {
          dataDoBazy = `${czesci[2]}-${czesci[1].padStart(2, '0')}-${czesci[0].padStart(2, '0')}`;
        } else if (czesci[0].length === 4) {
          // Jeśli wpisano już w formacie YYYY-MM-DD
          dataDoBazy = `${czesci[0]}-${czesci[1].padStart(2, '0')}-${czesci[2].padStart(2, '0')}`;
        }
      } else {
        dataDoBazy = wpisanaData;
      }
    }

    try {
      const response = await fetch(`${API_URL}/api/zadania`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nazwa_zadania: nazwaZadania.trim(),
          data_zadania: dataDoBazy,
          czy_w_kalendarzu: czyWKalendarzu,
          id_uzytkownika: idUzytkownika,
        }),
      });

      if (response.ok) {
        setNazwaZadania('');
        setDataZadania('');
        setCzyWKalendarzu(false);
        setKomunikat('Dodano zadanie!');
        setPokazFormularz(false);
        pobierzZadania();
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

       {/* DNI TYGODNIA JAKO OSOBNE BLOKI Z ZADANIAMI */}
            <Text style={styles.blackHeaderText}>Twoja lista:</Text>

            {/* NAGŁÓWEK ORAZ PRZYCISK DODAJ ZADANIE PO PRAWEJ */}
            <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
              <Text style={[styles.blackHeaderText, { textAlign: 'left', width: 'auto', marginBottom: 0 }]}>Twoja lista:</Text>
              <TouchableOpacity 
                style={[styles.menuButton, { width: 'auto', paddingHorizontal: 15, height: 40, justifyContent: 'center' }]} 
                onPress={() => setPokazFormularz(!pokazFormularz)}
              >
                <Text style={[styles.normalText, { color: 'white', marginTop: 0, fontSize: 24 }]}>
                  {pokazFormularz ? 'Anuluj' : 'Dodaj zadanie'}
                </Text>
              </TouchableOpacity>
            </View>

     {/* PASEK PRZEŁĄCZANIA TYGODNIA ZE STRZAŁKAMI */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 5 }}>
              <TouchableOpacity onPress={poprzedniTydzien} style={{ paddingHorizontal: 15 }}>
                <Text style={styles.normalText}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.blackHeaderText}>{zakresEtykieta}</Text>
              <TouchableOpacity onPress={nastepnyTydzien} style={{ paddingHorizontal: 15 }}>
                <Text style={styles.normalText}>▶</Text>
              </TouchableOpacity>
            </View>

        {/* FORMULARZ DODAWANIA ZADANIA (ROZWIJANY PO KLIKNIĘCIU) */}
            {pokazFormularz && (
              <View style={{ width: '90%', backgroundColor: 'rgba(255,255,255,0.95)', borderWidth: 1, borderColor: '#313131', padding: 15, marginBottom: 15, alignItems: 'center' }}>
                <TextInput
                  style={styles.inputText}
                  placeholder="podaj nazwę zadania"
                  placeholderTextColor="#666"
                  value={nazwaZadania}
                  onChangeText={(val) => setNazwaZadania(val)}
                />
                <TextInput
                  style={styles.inputText}
                  placeholder="podaj datę (DD-MM-YYYY)"
                  placeholderTextColor="#666"
                  value={dataZadania}
                  onChangeText={(val) => setDataZadania(val)}
                />

                <TouchableOpacity 
                  style={{ marginVertical: 5 }}
                  onPress={() => setCzyWKalendarzu(!czyWKalendarzu)}
                >
                  <Text style={styles.normalText}>
                    {czyWKalendarzu ? 'Ukryj w kalendarzu' : 'Pokaż w kalendarzu'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={dodajZadanie}>
                  <Text style={styles.button2}>Zapisz Zadanie</Text>
                </TouchableOpacity>
              </View>
            )}

            {komunikat !== '' && <Text style={styles.normalText}>{komunikat}</Text>}


            {dniTygodnia.map((dzien) => {
              // Filtrujemy zadania przypisane dokładnie do tego dnia tygodnia
              const zadaniaDlaDnia = zadania.filter((z) => {
                if (!z.data_zadania) return false;
                // Wycinamy pierwsze 10 znaków z formatu ISO (YYYY-MM-DD) i porównujemy z isoDate danego dnia
                return z.data_zadania.substring(0, 10) === dzien.isoDate;
              });


              return (
                <View key={dzien.isoDate} style={{ width: '90%', backgroundColor: 'rgba(255,255,255,0.85)', borderWidth: 1, borderColor: '#313131', marginVertical: 6, padding: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 2, marginBottom: 5 }}>
                    <Text style={[styles.normalText, { marginTop: 0, fontWeight: 'bold' }]}>{dzien.nazwa}</Text>
                    <Text style={[styles.normalText, { marginTop: 0, fontSize: 24 }]}>{dzien.displayDate}</Text>
                  </View>

                  {zadaniaDlaDnia.length === 0 ? (
                    <Text style={[styles.normalText, { marginTop: 5, fontSize: 24, color: '#666' }]}>Brak zadań</Text>
                  ) : (
                    zadaniaDlaDnia.map((zadanie) => (
                      <TouchableOpacity 
                        key={zadanie.id_zadania} 
                        onPress={() => zmienStatusZadania(zadanie.id_zadania, zadanie.czy_wykonane)}
                      >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                          <TouchableOpacity 
                            onPress={() => zmienStatusZadania(zadanie.id_zadania, zadanie.czy_wykonane)}
                            style={{ flex: 1 }}
                          >
                            <Text style={[styles.normalText, { marginTop: 0 }, zadanie.czy_wykonane && { textDecorationLine: 'line-through', color: '#777' }]}>
                              {zadanie.czy_wykonane ? '☑ ' : '☐ '} {zadanie.nazwa_zadania}
                            </Text>
                          </TouchableOpacity>

                          {/* Mały znaczek kalendarza po prawej stronie, jeśli zadanie jest w kalendarzu */}
                          {zadanie.czy_w_kalendarzu && (
                            <Text style={{ fontSize: 20, marginLeft: 10 }}>🗒</Text>
                          )}
                        </View>
         
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              );
            })}


          </ImageBackground>
        </View>    
      </View> 

      {ifopen ? <Sidebar navigation={navigation} onClose={() => setifopen(false)}/> : null}
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