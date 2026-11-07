import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';
import { useFonts } from 'expo-font';
import { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Checkbox from 'expo-checkbox';

import Sidebar from '../scene/sidebar';
import { getSessionUser, setSessionUser } from './session';

const API_URL_DOLACZ = Platform.OS === 'web' 
  ? 'http://localhost:5000/api/dolacz-rodzina' 
  : 'http://10.0.2.2:5000/api/dolacz-rodzina';

const API_URL_NOWA = Platform.OS === 'web' 
  ? 'http://localhost:5000/api/nowa-rodzina' 
  : 'http://10.0.2.2:5000/api/nowa-rodzina';

export default function Nowarodzina({ navigation, route }) {
  const currentUser = route?.params?.user || getSessionUser();
  const userLogin = currentUser?.login || route?.params?.login || '';

  const [ifopen, setifopen] = useState(false);
  const [openTyp, setopenTyp] = useState(false);
  const [valueTyp, setvalueTyp] = useState(null);
  const [itemTyp, setitemTyp] = useState([
    { label: 'Rodzina', value: 'rodzina' },
    { label: 'Współlokatorzy', value: 'wspollokatorzy' },
  ]);
  const [openRola_W, setopenRola_W] = useState(false);
  const [valueRola_W, setvalueRola_W] = useState(null);
  const [itemRola_W, setitemRola_W] = useState([
    { label: 'Administrator', value: 'admin' },
    { label: 'Czlonek', value: 'czlonek' },
  ]);
  const [openRola_R, setopenRola_R] = useState(false);
  const [valueRola_R, setvalueRola_R] = useState(null);
  const [itemRola_R, setitemRola_R] = useState([
    { label: 'Rodzic', value: 'rodzina' },
    { label: 'Dziecko', value: 'dziecko' },
  ]);

  const [kod, setkod] = useState(null);
  const [kodWpisany, setKodWpisany] = useState('');
  const [komunikat, setKomunikat] = useState('');
  const [typ, setTyp] = useState('error');

  const generujKod = () => {
    const losowyKod = Math.random().toString(36).substring(2, 8);
    setkod(losowyKod);
  };

  const zmianakodu = () => {
    generujKod();
  };

  const dolaczDoRodziny = async () => {
    if (!kodWpisany) {
      setKomunikat('Wpisz kod rodziny!');
      setTyp('error');
      return;
    }

    try {
      const response = await fetch(API_URL_DOLACZ, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: userLogin,
          kod_rodziny: kodWpisany,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setKomunikat(data.error || 'Taka rodzina nie istnieje!');
        setTyp('error');
      } else {
        const updatedUser = { ...currentUser, kod_rodziny: kodWpisany };
        setSessionUser(updatedUser);
        setKomunikat('Dołączono do rodziny!');
        setTyp('poprawny');
        setTimeout(() => {
          navigation.navigate('Profil', { user: updatedUser });
        }, 1000);
      }
    } catch (err) {
      console.error('Błąd połączenia:', err);
      setKomunikat('Błąd połączenia z serwerem!');
      setTyp('error');
    }
  };

  const stworzNowaRodzine = async () => {
    if (!kod) {
      setKomunikat('Wygeneruj najpierw kod rodziny!');
      setTyp('error');
      return;
    }

    const wybranaRola = valueTyp === 'rodzina' ? valueRola_R : valueRola_W;

    try {
      const response = await fetch(API_URL_NOWA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: userLogin,
          nazwa_rodziny: valueTyp || 'Nowa Rodzina',
          kod_rodziny: kod,
          rola: wybranaRola || 'czlonek',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setKomunikat(data.error || 'Błąd tworzenia rodziny');
        setTyp('error');
      } else {
        const updatedUser = { ...currentUser, kod_rodziny: kod };
        setSessionUser(updatedUser);
        setKomunikat('Stworzono nową rodzinę!');
        setTyp('poprawny');
        setTimeout(() => {
          navigation.navigate('Profil', { user: updatedUser });
        }, 1000);
      }
    } catch (err) {
      console.error('Błąd połączenia:', err);
      setKomunikat('Błąd połączenia z serwerem!');
      setTyp('error');
    }
  };

  const [check, setcheck] = useState(false);
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
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setifopen(true)}>
            <Text style={styles.normalText}>=</Text>
          </TouchableOpacity>
          <Text style={styles.whiteHeaderText}> Co Kto?</Text>
        </View>
        <View style={styles.body}>
            <Text style={styles.blackHeaderText}>Nowa rodzina</Text>
            <View style={styles.conteiner2}>
            <Checkbox
            style={styles.checkboxStyle}
            value={check}
            onValueChange={setcheck}
            color={check ? '#4e1f08de':'black'}
            />
            <Text style={styles.normalText}>Załóż nową rodzine</Text>
            </View>
            {check===false ? (
            <View style={{ alignItems: 'center', width: '100%' }}>
            <TextInput 
              style={styles.inputText} 
              placeholder="wpisz kod"
              value={kodWpisany}
              onChangeText={setKodWpisany}
            />
            <TouchableOpacity onPress={() => navigation.navigate('Profil')}>{/*onPress={dolaczDoRodziny} chwilowa zmiana zeby zobaczyc jak działa reszta aplikacji*/}
              <Text style={styles.button2}> Potwierdź </Text>
            </TouchableOpacity>
            </View>
            ) : (
            <View style={{ alignItems: 'center', width: '100%' }}>
            <Text style={styles.normalText}>Wybierz typ rodziny:</Text>
            <View style={styles.dropdown}>
              <DropDownPicker
                open={openTyp}
                value={valueTyp}
                items={itemTyp}
                setOpen={setopenTyp}
                setValue={setvalueTyp}
                setItems={setitemTyp}
                style={styles.button3}
                textStyle={styles.dropdownbutton}
                placeholder="Wybierz Typ"
              />
            </View>
            <Text style={styles.normalText}>Wybierz role:</Text>
            {valueTyp === 'rodzina' ? (
              <View style={styles.dropdown}>
                <DropDownPicker
                  open={openRola_R}
                  value={valueRola_R}
                  items={itemRola_R}
                  setOpen={setopenRola_R}
                  setValue={setvalueRola_R}
                  setItems={setitemRola_R}
                  style={styles.button3}
                  textStyle={styles.dropdownbutton}
                  placeholder="Wybierz role"
                />
              </View>
            ) : (
              <View style={styles.dropdown}>
                <DropDownPicker
                  open={openRola_W}
                  value={valueRola_W}
                  items={itemRola_W}
                  setOpen={setopenRola_W}
                  setValue={setvalueRola_W}
                  setItems={setitemRola_W}
                  style={styles.button3}
                  textStyle={styles.dropdownbutton}
                  placeholder="Wybierz role"
                />
              </View>
            )}
            <Text style={styles.normalText}> Twój kod rodziny: </Text>
            <TouchableOpacity onPress={zmianakodu} style={styles.button2}>
              <Text style={styles.normalText}> pokaż kod </Text>
            </TouchableOpacity>
            {/*tu zostaje przekazany wygenerowny kod rodziny*/}
            {kod !== null && (
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.normalText}>{kod}</Text>
                <TouchableOpacity onPress={stworzNowaRodzine}>
                  <Text style={styles.button2}> Zatwierdź nową rodzinę </Text>
                </TouchableOpacity>
              </View>
            )}
            </View>
            )}

            {komunikat !== '' && (
              <Text style={typ === 'error' ? styles.error : styles.komunikaty}>
                {komunikat}
              </Text>
            )}
        </View>
      </View>
      {ifopen ? (
        <Sidebar navigation={navigation} onClose={() => setifopen(false)} />
      ) : null}
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignContent: 'center',
    minHeight: 800,
  },
  conteiner2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  checkboxStyle:{
    marginRight: 10,
  },
  header: {
    width: '100%',
    backgroundColor: '#4e1f08de',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    backgroundColor: '#f1d1b7',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 500,
  },
  whiteHeaderText: {
    flex: 1,
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
    marginBottom: 10,
    color: 'black',
    fontFamily: 'common font',
    textAlign: 'center',
  },
  button2: {
    fontSize: 30,
    width: '60%',
    backgroundColor: '#3a0e00bb',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 30,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
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
  menuButton: {
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
  },
  dropdown: {
    zIndex:998,
    alignItems: 'center',
    textAlign: 'center',
    justifycontent: 'center',
    margin: 30,
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
  dropdownbutton: {
    fontSize: 30,
    color: 'black',
    fontFamily: 'common font',
    textAlgin: 'center',
  },
  button3:{
    fontSize: 30,
    backgroundColor:'#3a0e00bb',
    alginItem:'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset:{width: 2, hight: 20},
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
});