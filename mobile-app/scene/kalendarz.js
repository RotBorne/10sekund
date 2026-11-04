import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { useState, useEffect } from 'react';
import Sidebar from "../scene/sidebar";

const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000' 
  : 'http://10.0.2.2:5000';

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

export default function Kalendarz({ navigation, route }) {
  const [ifopen, setifopen] = useState(false);
  const [zadaniaKalendarza, setZadaniaKalendarza] = useState([]);
  const [poczatekTygodnia, setPoczatekTygodnia] = useState(pobierzPoczatekTygodnia(new Date()));

  const [fontsLoaded] = useFonts({
    'common font': require('../assets/OpenSans-VariableFont_wdth,wght.ttf'),
  });

  const pobierzZadaniaKalendarza = async () => {
    try {
      const response = await fetch(`${API_URL}/api/zadania-kalendarz`);
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setZadaniaKalendarza(data);
      } else {
        console.error("Błąd z serwera:", data.error);
      }
    } catch (error) {
      console.error("Błąd podczas pobierania zadań kalendarza:", error);
    }
  };

  useEffect(() => {
    pobierzZadaniaKalendarza();
  }, []);

  const dniTygodniaNazwy = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
  const dniTygodnia = dniTygodniaNazwy.map((nazwa, index) => {
    const d = new Date(poczatekTygodnia);
    d.setDate(d.getDate() + index);
    return {
      nazwa,
      isoDate: formatujDateDoBazy(d),
      displayDate: formatujDateNaPL(d),
    };
  });

  const koniecTygodnia = new Date(poczatekTygodnia);
  koniecTygodnia.setDate(koniecTygodnia.getDate() + 6);
  const zakresEtykieta = `${formatujDateNaPL(poczatekTygodnia).slice(0, 5)} - ${formatujDateNaPL(koniecTygodnia).slice(0, 5)}`;

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

  if (!fontsLoaded) {
    return <Text>błąd przy ładowaniu czcionki</Text>;
  }

  return (   
    <ScrollView> 
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={() => setifopen(true)}>
            <Text style={styles.normalText}>=</Text>
          </TouchableOpacity>
          <Text style={styles.whiteHeaderText}> Co Kto?</Text>
        </View> 

        <View style={styles.container}>
          <ImageBackground source={require('../assets/background.jpg')} style={styles.body}>
            <Text style={styles.blackHeaderText}>Kalendarz</Text>

            {/* PASEK PRZEŁĄCZANIA TYGODNIA */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 5 }}>
              <TouchableOpacity onPress={poprzedniTydzien} style={{ paddingHorizontal: 15 }}>
                <Text style={styles.normalText}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.blackHeaderText}>{zakresEtykieta}</Text>
              <TouchableOpacity onPress={nastepnyTydzien} style={{ paddingHorizontal: 15 }}>
                <Text style={styles.normalText}>▶</Text>
              </TouchableOpacity>
            </View>

            {/* WYŚWIETLANIE DNI TYGODNIA I ZADAŃ */}
            {dniTygodnia.map((dzien) => {
              const zadaniaDlaDnia = zadaniaKalendarza.filter((z) => {
                if (!z.data_zadania) return false;
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
                      <View key={zadanie.id_zadania} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                        
                        {/* Lewa strona: Status + Nazwa */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 }}>
                          <Text style={{ fontSize: 22, marginRight: 8 }}>
                            {zadanie.czy_wykonane ? '☑' : '☐'}
                          </Text>
                          <Text style={[styles.normalText, { marginTop: 0, fontSize: 25, flex: 1 }]}>
                            {zadanie.nazwa_zadania}
                          </Text>
                        </View>

                        {/* Prawa strona: Login */}
                        <Text style={[styles.normalText, { marginTop: 0, fontSize: 20, textAlign: 'right' }]}>
                          @{zadanie.login || 'użytkownik'}
                        </Text>

                      </View>
                    ))
                  )}
                </View>
              );
            })}

          </ImageBackground>
        </View>    
      </View> 
<<<<<<< HEAD
    <View style={styles.body}>
      <Text style={styles.blackHeaderText}>Kalendarz</Text>
    </View>    
    </View> 
      {ifopen ? <Sidebar navigation={navigation} onClose={() => setifopen(false)}/>:null}
=======
      {ifopen ? <Sidebar navigation={navigation} onClose={() => setifopen(false)} /> : null}
>>>>>>> 1c7d2dd314f2d6678a1821c9ca30fae971939e33
      <StatusBar style="auto" />     
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#f1d1b7',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 500,
  },
  whiteHeaderText:{
    flex: 1,
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