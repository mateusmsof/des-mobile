import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { LoyaltyCardItem } from '@/components/ui/LoyaltyCardItem';
import { useRouter } from 'expo-router';

export default function MyCardsScreen() {
  const router = useRouter();
  const cards = [{ id: '1', title: 'Campanha de Verão', store: 'Pausa & Sabor', exp: '31/12/2026', current: 3, total: 8 }];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meus Cartões</Text>
      <FlatList 
        data={cards}
        renderItem={({ item }) => (
          <LoyaltyCardItem {...item} storeName={item.store} expiresAt={item.exp} stamps={item.current} maxStamps={item.total} onPress={() => router.push(`/cards/${item.id}`)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F2F4F7' },
  header: { fontSize: 22, fontWeight: '700', color: '#333C48', marginBottom: 16, fontFamily: 'Poppins-Bold' }
});