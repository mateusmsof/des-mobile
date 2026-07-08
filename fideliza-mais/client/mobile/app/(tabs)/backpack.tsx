import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Dimensions, ViewStyle, TextStyle, Image } from 'react-native';
import { useRouter } from 'expo-router';

// Interface estruturada conforme o modelo da tabela tb_stamp_packs
interface StampPackGroup {
  id: string;
  storeName: string;
  count: number;
}

// Dados fictícios simulando o agrupamento por estabelecimento
const PACKS: StampPackGroup[] = [
  { id: '1', storeName: 'Pausa & Sabor', count: 3 },
  { id: '2', storeName: 'Panificadora Japão', count: 1 },
  { id: '3', storeName: 'Burguer House', count: 5 },
  { id: '4', storeName: 'Café Central', count: 2 },
  { id: '5', storeName: 'Pausa & Sabor', count: 3 },
  { id: '6', storeName: 'Panificadora Japão', count: 1 },
  { id: '7', storeName: 'Burguer House', count: 5 },
  { id: '8', storeName: 'Café Central', count: 2 },
];

// Cálculo para garantir que os cards fiquem simétricos independente do tamanho da tela
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 10;
const CARD_WIDTH = (SCREEN_WIDTH - 40 - (CARD_MARGIN * 2)) / 2;

export default function BackpackScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F4F7" />

      <FlatList
        data={PACKS}
        numColumns={2} // Transforma a lista em uma grade/grid estilo inventário de jogo
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Mochila vazia</Text>
            <Text style={styles.emptyText}>Visite lojas parceiras e acumule pacotes fechados aqui.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.packCard}
            activeOpacity={0.8}
            onPress={() => router.push(`/packs/${item.id}`)}
          >
            {/* ÁREA VISUAL CENTRALIZADA DO CARD COM A IMAGEM */}
            <View style={styles.cardVisual}>
              <Image
                source={require('../../assets/images/pack.webp')}
                style={styles.packImage}
                resizeMode="contain"
              />
            </View>

            {/* INFORMAÇÕES DO ESTABELECIMENTO */}
            <View style={styles.cardInfo}>
              <Text style={styles.storeNameText} numberOfLines={1}>{item.storeName}</Text>
            </View>

            {/* BADGE DE QUANTIDADE ESTILO ITEM COLECIONÁVEL */}
            <View style={styles.qtyBadge}>
              <Text style={styles.qtyText}>x{item.count}</Text>
            </View>

          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// Tipagem explícita dos objetos para evitar inferências incorretas de CSS Web/Mobile no TS
interface Styles {
  container: ViewStyle;
  listContent: ViewStyle;
  columnWrapper: ViewStyle;
  packCard: ViewStyle;
  cardVisual: ViewStyle;
  packImage: import('react-native').ImageStyle; // Alterado para ImageStyle
  itemIconWrapper: ViewStyle;
  iconLetter: TextStyle;
  cardInfo: ViewStyle;
  storeNameText: TextStyle;
  qtyBadge: ViewStyle;
  qtyText: TextStyle;
  emptyContainer: ViewStyle;
  emptyTitle: TextStyle;
  emptyText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7'
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 24
  },
  columnWrapper: {
    justifyContent: 'flex-start',
    gap: CARD_MARGIN * 2
  },
  /* CARD EM FORMATO DE GRADE DE INVENTÁRIO */
  packCard: {
    backgroundColor: '#FFFFFF',
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.25, // Aumentado levemente para acomodar a imagem
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C7D0D8',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    shadowColor: '#333C48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2
  },
  cardVisual: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 8, // Espaçamento extra para a imagem não tocar as bordas
  },
  packImage: {
    width: '85%',  // Ocupa a maior parte do espaço mantendo respiro
    height: '85%', // Ocupa a maior parte do espaço mantendo respiro
  },
  itemIconWrapper: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(34, 124, 157, 0.08)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34, 124, 157, 0.15)'
  },
  iconLetter: {
    fontSize: 24,
    fontWeight: '700',
    color: '#227C9D',
    fontFamily: 'Poppins-Bold'
  },
  cardInfo: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7'
  },
  storeNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333C48',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center'
  },
  /* BADGE DE QUANTIDADE DO INVENTÁRIO */
  qtyBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFD000',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#333C48',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  qtyText: {
    fontWeight: '700',
    color: '#333C48',
    fontSize: 11,
    fontFamily: 'Poppins-Bold'
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 80
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
