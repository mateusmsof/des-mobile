import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

// Exemplo de dados retornados pelo GET /stamp-packs
const PACKS = [
  { id: '1', storeName: 'Pausa & Sabor', count: 3 },
  { id: '2', storeName: 'Panificadora Japão', count: 1 },
];

export default function BackpackScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Minha Mochila</Text>
      
      <FlatList
        data={PACKS}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.packItem} 
            // Ajustado para navegar usando o id para a rota dinâmica
            onPress={() => router.push(`/packs/${item.id}`)}
          >
            <View style={styles.storeIcon} />
            <View style={styles.infoContainer}>
              <Text style={styles.storeNameText}>{item.storeName}</Text>
              <Text style={styles.packCountText}>{item.count} pacotes selados</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.count}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F2F4F7', 
    padding: 20 
  },
  pageTitle: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#333C48', 
    marginBottom: 20, 
    marginTop: 40, 
    fontFamily: 'Poppins-Bold' 
  },
  listContent: { 
    paddingBottom: 20 
  },
  packItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2
  },
  storeIcon: { 
    width: 48, 
    height: 48, 
    backgroundColor: '#E1E4E8', 
    borderRadius: 8, 
    marginRight: 16 
  },
  infoContainer: { 
    flex: 1 
  },
  storeNameText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#333C48', 
    fontFamily: 'Poppins-Bold' 
  },
  packCountText: { 
    fontSize: 12, 
    color: '#333C48', 
    opacity: 0.6, 
    fontFamily: 'Poppins-Regular' 
  },
  badge: { 
    backgroundColor: '#FFD000', 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  badgeText: { 
    fontWeight: '700', 
    color: '#333C48', 
    fontSize: 12, 
    fontFamily: 'Poppins-Bold' 
  }
});