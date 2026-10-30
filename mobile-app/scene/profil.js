import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import {useState} from 'react';

import Sidebar from "../scene/sidebar";

export default function ListaZakupow({navigation}) {
  const [ifopen,setifopen] = useState(false);
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