{/*narazie niezaimplementowane nigdzie w kodzie*/}
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function FallbackComponent({ error, resetErrorBoundary }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coś poszło nie tak w tej sekcji!</Text>
      <Text style={styles.errorText}>{error.message}</Text>
      <Button title="Spróbuj ponownie" onPress={resetErrorBoundary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 20 
},
  title: {
     fontSize: 18,
     fontWeight: 'bold', 
     marginBottom: 10, 
     textAlign: 'center' 
    },
  errorText: { 
    color: 'red', 
    marginBottom: 20, 
    textAlign: 'center' },
});