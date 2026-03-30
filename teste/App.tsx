import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

// 1. Importe o seu componente (ajuste o caminho se necessário)
import Carteira from './components/carteira'; 

export default function App() {
  return (
    <View style={styles.container}>
      {/* 2. Coloque o componente aqui no lugar do <Text> antigo */}
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