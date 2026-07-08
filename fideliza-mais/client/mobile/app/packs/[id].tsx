import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Vibration, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Pack3D from './Pack3D';
import { useAuth } from '@/hooks/useAuth';

const API_BASE_URL = 'https://ubiquitous-spork-wjpgvqqxqjj2w79-3000.app.github.dev/api';

interface PackDetail {
  id: string;
  externalId: string;
  status: string;
  createdAt: string;
  store: {
    id: string;
    name: string;
  };
  card: {
    id: string;
    externalId: string;
    title: string;
    maxStamps: number;
    currentStamps: number;
  };
}

export default function OpenPackScreen() {
  const params = useLocalSearchParams();
  const packId = String(params.id || '');
  const router = useRouter();
  const { token } = useAuth();

  const [pack, setPack] = useState<PackDetail | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPack = async () => {
      if (!packId || !token) {
        setError('Pacote inválido.');
        setApiLoading(false);
        return;
      }

      setApiLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/packs/${packId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Não foi possível carregar o pacote.');
        }

        const packData = data.data;

        setPack({
          id: packData.id,
          externalId: packData.externalId,
          status: packData.status,
          createdAt: packData.createdAt,
          store: {
            id: packData.store.id,
            name: packData.store.name,
          },
          card: {
            id: packData.card.id,
            externalId: packData.card.externalId,
            title: packData.card.title,
            maxStamps: Number(packData.card.maxStamps ?? 0),
            currentStamps: Number(packData.card.currentStamps ?? 0),
          },
        });
      } catch (err) {
        console.error('Erro ao carregar detalhe do pacote:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar o pacote.');
      } finally {
        setApiLoading(false);
      }
    };

    fetchPack();
  }, [packId, token]);

  const handleOpenSequence = async () => {
    if (opening || !pack || !token) return;

    setOpening(true);
    let isRunning = true;

    const runHapticsLoop = async () => {
      while (isRunning) {
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } catch (e) {
          console.warn('Haptics não suportado:', e);
        }
        await new Promise((resolve) => setTimeout(resolve, 120));
      }
    };

    runHapticsLoop();
    await new Promise((resolve) => setTimeout(resolve, 1800));
    isRunning = false;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await new Promise((resolve) => setTimeout(resolve, 80));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Vibration.vibrate(300);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/packs/${packId}/open`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Não foi possível abrir o pacote.');
      }

      const cardId = data.data?.cardId;
      if (!cardId) {
        throw new Error('Resposta inesperada do servidor.');
      }

      router.replace({
        pathname: '/cards/[id]',
        params: {
          id: String(cardId),
          recebendoSelo: 'true',
        },
      });
      return;
    } catch (err) {
      console.error('Erro ao abrir pacote:', err);
      Alert.alert('Erro', err instanceof Error ? err.message : 'Não foi possível abrir o pacote.');
    } finally {
      setOpening(false);
    }
  };

  if (apiLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#FFD000" />
      </View>
    );
  }

  if (error || !pack) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error || 'Pacote não encontrado.'}</Text>
      </View>
    );
  }

  const canOpen = pack.status === 'sealed';

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Abrir Pacote' }} />
      <View style={styles.view3D}>
        <Pack3D isAnimatingOpen={opening} />
      </View>

      <View style={styles.infoPanel}>
        <Text style={styles.storeTitle}>{pack.store.name}</Text>
        <Text style={styles.packMeta}>Pacote #{pack.externalId}</Text>
        <Text style={styles.cardTitle}>{pack.card.title}</Text>
        <Text style={styles.cardSubtitle}>Selo {pack.card.currentStamps + 1} de {pack.card.maxStamps}</Text>
      </View>

      <TouchableOpacity
        style={[styles.openButton, (!canOpen || opening) && styles.disabledButton]}
        onPress={handleOpenSequence}
        disabled={!canOpen || opening}
        activeOpacity={0.8}
      >
        {opening ? (
          <ActivityIndicator color="#333C48" size="small" />
        ) : (
          <Text style={styles.buttonText}>{canOpen ? 'ABRIR PACOTE' : 'PACOTE JÁ ABERTO'}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  view3D: {
    flex: 1,
    width: '100%',
  },
  infoPanel: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#111111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  storeTitle: {
    color: '#FFD000',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  packMeta: {
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    fontFamily: 'Poppins-Bold',
  },
  cardSubtitle: {
    color: '#CBD5E1',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  openButton: {
    marginHorizontal: 24,
    backgroundColor: '#FFD000',
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 48,
    height: 60,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: '#C7D0D8',
  },
  buttonText: {
    color: '#333C48',
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
  },
  errorText: {
    color: '#FFD000',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
