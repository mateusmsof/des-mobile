import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { Carteira } from './components/carteira'; 

export default function App() {
  return (
    <View style={styles.container}>

      <Carteira />
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Cor de fundo da tela inteira
    alignItems: 'center',    // Centraliza o card horizontalmente
    justifyContent: 'center', // Centraliza o card verticalmente
  },
});