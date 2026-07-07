import React from 'react';
import { FlatList, StyleSheet, View, Text, StatusBar } from 'react-native';
import { LoyaltyCardItem } from '@/components/ui/LoyaltyCardItem';
import { useRouter } from 'expo-router';

export default function MyCardsScreen() {
  const router = useRouter();
  
  // Dados fictícios simulando tb_loyalty_cards populados com informações do template e da loja
  const cards = [
    { 
      id: '1', 
      title: 'Combo Burguer Clássico', 
      store: 'Pausa & Sabor', 
      exp: '31/12/2026', 
      current: 3, 
      total: 8,
      imageUrl: 'https://unsplash.com'
    },
    { 
      id: '2', 
      title: 'Milkshake de Ovomaltine', 
      store: 'Estação do Doce', 
      exp: '15/11/2026', 
      current: 5, 
      total: 6,
      imageUrl: null // Cenário sem imagem (usa o fallback elegante)
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F4F7" />
      
      <View style={styles.headerGroup}>
        <Text style={styles.header}>Meus Cartões</Text>
        <Text style={styles.subtitle}>Acompanhe seus selos e resgate suas recompensas</Text>
      </View>

      <FlatList 
        data={cards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhum cartão ativo</Text>
            <Text style={styles.emptyText}>Consuma nos estabelecimentos parceiros para começar a pontuar!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <LoyaltyCardItem 
            title={item.title} 
            storeName={item.store} 
            expiresAt={item.exp} 
            stamps={item.current} 
            maxStamps={item.total} 
            imageUrl={item.imageUrl}
            onPress={() => router.push(`/cards/${item.id}`)} 
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F2F4F7' 
  },
  headerGroup: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  header: { 
    fontSize: 26, 
    fontWeight: '700', 
    color: '#333C48', 
    fontFamily: 'Poppins-Bold' 
  },
  subtitle: {
    fontSize: 13,
    color: '#717d8a',
    fontFamily: 'Poppins-Regular',
    marginTop: 2
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333C48',
    fontFamily: 'Poppins-Bold',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 14,
    color: '#a0aab2',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    lineHeight: 20
  }
});
