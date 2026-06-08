import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState('');
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Crie sua conta</Text>
        
        <TextInput 
          placeholder="Nome completo" 
          onChangeText={setNome} 
          style={styles.input} 
        />
        <TextInput 
          placeholder="E-mail" 
          onChangeText={setEmail} 
          style={styles.input}
          keyboardType="email-address"
        />
        <TextInput 
          placeholder="Idade" 
          onChangeText={setIdade} 
          style={styles.input}
          keyboardType="numeric"
        />

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push({ pathname: '/detalhes', params: { nome, email, idade } })}
        >
          <Text style={styles.buttonText}>Enviar Dados</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    backgroundColor: '#f5f5f5',
    padding: 20 
  },
  card: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fafafa'
  },
  button: {
    backgroundColor: '#007AFF', // Azul padrão iOS/Moderno
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});