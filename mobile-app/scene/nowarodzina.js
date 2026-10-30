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
} from 'react-native';
import { useFonts } from 'expo-font';
import { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import Checkbox from 'expo-checkbox';

import Sidebar from '../scene/sidebar';

export default function Nowarodzina({ navigation }) {
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
  const zmianakodu = () => {
    setkod('6xy7mn');
    {
      /*zmienna która ustala kod*/
    }
  };
  const [check, setcheck] = useState(false);
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
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setifopen(true)}>
            <Text style={styles.normalText}>=</Text>
          </TouchableOpacity>
          <Text style={styles.whiteHeaderText}> Co Kto?</Text>
        </View>
        <View style={styles.container}>
          <ImageBackground
            source={require('../assets/background.jpg')}
            style={styles.body}>
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
            <View>
            <TextInput style={styles.inputText} placeholder="wpisz kod"/>
            <TouchableOpacity>
              <Text style={styles.button2} onPress={() => navigation.navigate('Profil')}> Potwierdź </Text>
            </TouchableOpacity>
            </View>
            ) : (
            <View>
            <Text style={styles.normalText}>Wybierz typ rodziny:</Text>
            <View style={styles.dropdown}>
              <DropDownPicker
                open={openTyp}
                value={valueTyp}
                items={itemTyp}
                setOpen={setopenTyp}
                setValue={setvalueTyp}
                setItems={setitemTyp}
                style={styles.button2}
                textStyle={styles.normalText}
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
                  style={styles.button2}
                  textStyle={styles.normalText}
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
                  style={styles.button2}
                  textStyle={styles.normalText}
                  placeholder="Wybierz role"
                />
              </View>
            )}
            <Text style={styles.normalText}> Twój kod rodziny: </Text>
            <TouchableOpacity onPress={zmianakodu} style={styles.button2}>
              <View> pokaż kod </View>
            </TouchableOpacity>
            {/*tu zostaje przekazany wygenerowny kod rodziny*/}
            {kod !== null && <Text style={styles.normalText}>{kod}</Text>}
            </View>
            )}
          </ImageBackground>
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
    width: '60%',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    margin: 30,
  },
});
