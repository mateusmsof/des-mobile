import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';

interface DeputadoCardProps {
  item: any;
  onPress: () => void;
}

export default function DeputadoCard({ item, onPress }: DeputadoCardProps) {
  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.cardLayout}>
        {/* Foto do deputado */}
        <Image source={{ uri: item.urlFoto }} style={styles.cardImage} />
        
        {/* Informações */}
        <View style={styles.cardContent}>
          <Text variant="titleMedium" numberOfLines={1}>{item.nome}</Text>
          <Text variant="bodyMedium" style={{ marginBottom: 10 }}>
            {item.siglaPartido} - {item.siglaUf}
          </Text>
          <Button mode="contained" compact onPress={onPress}>
            Ver detalhes
          </Button>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginTop: 12,
    borderRadius: 8,
    elevation: 2,
  },
  cardLayout: {
    flexDirection: 'row',
    padding: 10,
  },
  cardImage: {
    width: 80,
    height: 100,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  cardContent: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
  },
});