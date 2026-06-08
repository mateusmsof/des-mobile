import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Detalhes() {
  const { nome, email, idade } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Dados Recebidos</Text>
        
        <View style={styles.item}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{nome}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>E-mail:</Text>
          <Text style={styles.value}>{email}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Idade:</Text>
          <Text style={styles.value}>{idade} anos</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5f5f5',
    padding: 20 
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Sombra no Android
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center'
  },
  item: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8
  },
  label: {
    fontWeight: '600',
    color: '#666',
    width: 70
  },
  value: {
    color: '#000',
    flex: 1
  }
});