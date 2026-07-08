import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Dimensions, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';

const API_BASE_URL = 'https://ubiquitous-spork-wjpgvqqxqjj2w79-3000.app.github.dev/api';

interface StampPackGroup {
  id: string;
  storeName: string;
  count: number;
  firstPackId: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 10;
const CARD_WIDTH = (SCREEN_WIDTH - 40 - CARD_MARGIN * 2) / 2;

export default function BackpackScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [packs, setPacks] = useState<StampPackGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPacks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!token) {
      setPacks([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/me/packs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && Array.isArray(data.data)) {
        setPacks(
          data.data.map((group: any) => ({
            id: String(group.storeId),
            storeName: group.storeName ?? 'Loja parceira',
            count: group.count,
            firstPackId: String(group.packs?.[0]?.id ?? ''),
          }))
        );
      } else {
        setError(data.message || 'Não foi possível carregar os pacotes.');
        setPacks([]);
      }
    } catch (err) {
      console.error(err);
      setError('Erro de rede ao carregar os pacotes.');
      setPacks([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadPacks();
    }, [loadPacks])
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#227C9D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F4F7" />

      {error ? (
        <View style={styles.messageContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={packs}
        numColumns={2}
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
            onPress={() => item.firstPackId && router.push(`/packs/${item.firstPackId}`)}
            disabled={!item.firstPackId}
          >
            <View style={styles.cardVisual}>
              <Image
                source={require('../../assets/images/pack.webp')}
                style={styles.packImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.storeNameText} numberOfLines={1}>{item.storeName}</Text>
            </View>

            <View style={styles.qtyBadge}>
              <Text style={styles.qtyText}>x{item.count}</Text>
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
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: CARD_MARGIN,
  },
  packCard: {
    backgroundColor: '#FFFFFF',
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.25,
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
    elevation: 2,
  },
  cardVisual: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 8,
  },
  packImage: {
    width: '85%',
    height: '85%',
  },
  cardInfo: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
  },
  storeNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333C48',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
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
    elevation: 1,
  },
  qtyText: {
    fontWeight: '700',
    color: '#333C48',
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333C48',
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#a0aab2',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
  },
  messageContainer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  errorText: {
    color: '#d14343',
    fontSize: 14,
    textAlign: 'center',
  },
});
