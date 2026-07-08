import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View, Text, StatusBar, ActivityIndicator } from 'react-native';
import { LoyaltyCardItem } from '@/components/ui/LoyaltyCardItem';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';

const API_BASE_URL = 'https://ubiquitous-spork-wjpgvqqxqjj2w79-3000.app.github.dev/api';

interface LoyaltyCard {
  id: string;
  title: string;
  storeName: string;
  expiresAt: string;
  currentStamps: number;
  maxStamps: number;
  imageUrl?: string | null;
}

export default function MyCardsScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCards = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!token) {
      setCards([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/me/cards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && Array.isArray(data.data)) {
        setCards(
          data.data.map((card: any) => ({
            id: String(card.id),
            title: card.title,
            storeName: card.store?.name ?? 'Loja parceira',
            expiresAt: card.expiresAt ? card.expiresAt.split('T')[0] : 'Não informado',
            currentStamps: Number(card.currentStamps ?? 0),
            maxStamps: Number(card.maxStamps ?? 0),
            imageUrl: card.imageUrl ?? null,
          }))
        );
      } else {
        setError(data.message || 'Não foi possível carregar seus cartões.');
        setCards([]);
      }
    } catch (err) {
      console.error('Erro ao buscar cartões:', err);
      setError('Erro de rede ao carregar seus cartões.');
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [loadCards])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#227C9D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F4F7" />

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

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
            storeName={item.storeName}
            expiresAt={item.expiresAt}
            stamps={item.currentStamps}
            maxStamps={item.maxStamps}
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
    backgroundColor: '#F2F4F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F4F7',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 20,
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
  errorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  errorText: {
    color: '#d14343',
    fontSize: 14,
    textAlign: 'center',
  },
});
