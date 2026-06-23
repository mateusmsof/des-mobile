import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Text, Card, List, Divider } from 'react-native-paper';
import axios from 'axios';

export default function Detalhes() {
  const { deputado } = useLocalSearchParams();
  const dataBasica = JSON.parse(deputado as string);

  const [detalhes, setDetalhes] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca dados detalhados usando o ID da params inicial
    axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${dataBasica.id}`)
      .then(response => {
        setDetalhes(response.data.dados);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [dataBasica.id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: dataBasica.nome, // Mantém o nome da busca original
          headerBackTitle: 'Voltar',
          headerShown: true
        }}
      />

      <Card style={styles.card}>
        <Image
          source={{ uri: dataBasica.urlFoto }}
          style={styles.fullImage}
          resizeMode="contain"
        />

        <Card.Content style={styles.content}>
          <Text variant="headlineSmall" style={styles.name}>{dataBasica.nome}</Text>
          <Text variant="titleMedium" style={styles.details}>{dataBasica.siglaPartido}</Text>
        </Card.Content>

        <Divider />

        <List.Item
          title="Nome Completo"
          description={detalhes.nomeCivil}
          left={props => <List.Icon {...props} icon="account-details" />}
        />
        <List.Item
          title="Escolaridade"
          description={detalhes.escolaridade}
          left={props => <List.Icon {...props} icon="school" />}
        />
        <List.Item
          title="Nascimento"
          description={() => {
            // Converte YYYY-MM-DD para DD/MM/YYYY
            const [ano, mes, dia] = detalhes.dataNascimento.split('-');
            const dataFormatada = `${dia}/${mes}/${ano}`;
            return (
              <Text style={{ color: '#555' }}>
                {dataFormatada} - {detalhes.municipioNascimento}/{detalhes.ufNascimento}
              </Text>
            );
          }}
          left={props => <List.Icon {...props} icon="cake-variant" />}
        />
        <List.Item
          title="Sexo"
          description={detalhes.sexo === 'M' ? 'Masculino' : 'Feminino'}
          left={props => <List.Icon {...props} icon="gender-male-female" />}
        />
        <List.Item
          title="E-mail"
          description={detalhes.ultimoStatus.gabinete.email}
          left={props => <List.Icon {...props} icon="email" />}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { margin: 16, borderRadius: 12 },
  fullImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#eee',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  content: { paddingVertical: 20 },
  name: { fontWeight: 'bold' },
  details: { color: '#666', marginTop: 4 }
});