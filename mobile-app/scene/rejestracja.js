import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';

export default function Rejestracja({navigation}) {
  const [login, setLogin] = useState('');
  const [haslo, setHaslo] = useState('');
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
      <Text style={styles.whiteHeaderText}>Co Kto?</Text>
      </View>
    <View style={styles.conteiner2}>
        <View style={styles.sidebar}>
          <Text style={styles.button}>profil</Text>
          <Text style={styles.button}>zadania</Text>
          <Text style={styles.button}>lista zakupów</Text>
          <Text style={styles.button}>statystyki</Text>
          <Text style={styles.button}>ustawienia</Text>
        </View>
      <ImageBackground source={require('../assets/background.jpg')} 
    style={styles.body}
    >
      <Text style={styles.blackHeaderText}>Rejestracja</Text>
      <Text style={styles.normalText}> Login: </Text>
      <TextInput style={styles.inputText} placeholder="podaj login" onChangeText={(val) => setLogin(val)} />
      <Text style={styles.normalText}>Hasło: </Text>
      <TextInput style={styles.inputText} placeholder="podaj hasło" secureTextEntry={true} onChangeText={(val) => setHaslo(val)} />
         <Text style={styles.normalText}>Powtórz hasło: </Text>
      <TextInput style={styles.inputText} placeholder="powtórz hasło" secureTextEntry={true} onChangeText={(val) => setHaslo(val)} />
      <Text style={styles.button2}> Zarejestruj </Text>
      <Text style={styles.normalText}> Masz Konto? </Text>
      <TouchableOpacity>
      <Text style={styles.button2} onPress={()=>navigation.goBack()}> Zaloguj się </Text>
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
  conteiner2:{
    flex: 1,
    width: '100%',
    flexDirection: 'row',
  },
  header:{
    width: '100%',
    backgroundColor: '#4e1f08de',
    alignItems: 'flex-start', 
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
    padding: 100,
  },
  whiteHeaderText:{
    width: '100%',
    fontWeight: 'bold',
    fontSize: 50,
    paddingBottom: 10,
    color: 'white',
    fontFamily: 'common font',
    textAlign: 'center',
  },
  blackHeaderText:{
    width: '100%',
    fontWeight: 'bold',
    fontSize: 50,
    paddingBottom: 10,
    color: 'black',
    fontFamily: 'common font',
    textAlign: 'center',
  },
  sidebar:{
    width: '15%',
    backgroundColor: '#99451ea2',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  button:{
    fontSize: 30,
    color: 'black',
    fontFamily: 'common font',
    textAlign: 'center',
    width: '60%',
    backgroundColor: '#3a0e00a2',
    alignItems: 'center',
    justifyContent: 'center',
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