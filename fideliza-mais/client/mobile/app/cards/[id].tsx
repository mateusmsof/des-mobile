import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Animated, ActivityIndicator, Vibration } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/hooks/useAuth';
import ValidarSelo from '../../components/ui/ValidarSelo';

const PRIMARY_COLOR = '#227C9D';
const API_BASE_URL = 'https://ubiquitous-spork-wjpgvqqxqjj2w79-3000.app.github.dev/api';

interface Reward {
  id: string;
  title: string;
}

interface CardDetail {
  id: string;
  externalId: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  store: {
    id: string;
    name: string;
  };
  title: string;
  maxStamps: number;
  currentStamps: number;
  selectedReward: Reward | null;
  availableRewards: Reward[];
}

export default function CardDetailScreen() {
  const params = useLocalSearchParams();
  const cardId = String(params.id || '');
  const veioDeAberturaPacote = params.recebendoSelo === 'true';
  const { token } = useAuth();

  const [card, setCard] = useState<CardDetail | null>(null);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carimboAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchCard = async () => {
      if (!cardId || !token) {
        setError('Cartão inválido.');
        setApiLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Não foi possível carregar o cartão.');
        }

        const cardData = data.data;
        const availableRewards = Array.isArray(cardData.availableRewards) ? cardData.availableRewards : [];
        const rewardSelected = cardData.selectedReward ? cardData.selectedReward : availableRewards[0] || null;

        setCard({
          id: cardData.id,
          externalId: cardData.externalId,
          status: cardData.status,
          createdAt: cardData.createdAt,
          expiresAt: cardData.expiresAt,
          store: {
            id: cardData.store.id,
            name: cardData.store.name,
          },
          title: cardData.title,
          maxStamps: Number(cardData.maxStamps ?? 0),
          currentStamps: Number(cardData.currentStamps ?? 0),
          selectedReward: rewardSelected,
          availableRewards,
        });
        setSelectedReward(rewardSelected);
      } catch (err) {
        console.error('Erro ao carregar detalhe do cartão:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar o cartão.');
      } finally {
        setApiLoading(false);
      }
    };

    fetchCard();
  }, [cardId, token]);

  useEffect(() => {
    if (!veioDeAberturaPacote || !card) {
      return;
    }

    const dispararPancadaTatil = async () => {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await new Promise((resolve) => setTimeout(resolve, 80));
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        Vibration.vibrate(300);
      }
    };

    Animated.parallel([
      Animated.timing(carimboAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();

    dispararPancadaTatil();
  }, [veioDeAberturaPacote, card, carimboAnim]);

  const renderStampGrid = () => {
    const stamps = [];
    const total = card?.maxStamps ?? 0;
    const filled = card?.currentStamps ?? 0;
    const lastFilledIndex = filled - 1;

    for (let i = 0; i < total; i++) {
      const isFilled = i < filled;
      const isLastFilled = i === lastFilledIndex && veioDeAberturaPacote;

      if (isLastFilled) {
        const stampScale = carimboAnim.interpolate({ inputRange: [0, 1], outputRange: [3, 1] });
        const stampOpacity = carimboAnim;

        stamps.push(
          <View key={i} style={[styles.stamp, styles.stampVazio]}>
            <Text style={styles.stampNumber}>{i + 1}</Text>
            <Animated.View
              style={[
                styles.stamp,
                styles.stampCarimbado,
                {
                  position: 'absolute',
                  transform: [{ scale: stampScale }],
                  opacity: stampOpacity,
                },
              ]}
            >
              <FontAwesome name="check" size={16} color="#FFF" />
            </Animated.View>
          </View>
        );
      } else {
        stamps.push(
          <View key={i} style={[styles.stamp, isFilled ? styles.stampCarimbado : styles.stampVazio]}>
            {isFilled ? <FontAwesome name="check" size={16} color="#FFF" /> : <Text style={styles.stampNumber}>{i + 1}</Text>}
          </View>
        );
      }
    }

    return stamps;
  };

  if (apiLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ title: 'Carregando...' }} />
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  if (error || !card) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error || 'Cartão não encontrado.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Stack.Screen
        options={{
          title: card.store.name,
          headerTitleStyle: { fontFamily: 'Poppins-Bold', fontSize: 16 },
        }}
      />

      {veioDeAberturaPacote && (
        <View style={styles.alertBox}>
          <FontAwesome name="gift" size={18} color="#227C9D" style={{ marginRight: 8 }} />
          <Text style={styles.alertText}>Você acabou de ganhar um novo selo!</Text>
        </View>
      )}

      <View style={styles.floatingCard}>
        <Text style={styles.headerLabel}>CARTÃO FIDELIDADE</Text>
        <Text style={styles.storeName}>{card.store.name}</Text>
        <Text style={styles.title}>{card.title}</Text>

        <TouchableOpacity style={styles.rewardContainer} onPress={() => setModalVisible(true)}>
          <View style={[styles.imageCard, { transform: [{ rotate: '-1deg' }] }]}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>IMG</Text>
            </View>
            <View style={[styles.overlay, selectedReward ? styles.overlaySelected : null]}>
              <Text style={styles.overlayText} numberOfLines={2}>
                {selectedReward ? selectedReward.title.substring(0, 50) : 'TOQUE PARA ESCOLHER'}
              </Text>
            </View>
          </View>
          <View style={[styles.ribbon, { transform: [{ rotate: '2deg' }] }]}> 
            <Text style={styles.ribbonText}>PRÓXIMO RESGATE</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.stampGrid}>{renderStampGrid()}</View>
        <View style={styles.divider} />
        <Text style={styles.validText}>VÁLIDO ATÉ</Text>
        <Text style={styles.dateText}>{card.expiresAt.split('T')[0]}</Text>

        <TouchableOpacity style={styles.validateButton} onPress={() => setQrModalVisible(true)}>
          <FontAwesome name="qrcode" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>VALIDAR NOVO SELO</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>Imagens meramente ilustrativas. Consulte a disponibilidade das recompensas no balcão.</Text>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha seu Prêmio</Text>
            <FlatList
              data={card.availableRewards}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.rewardGridItem}
                  onPress={() => {
                    setSelectedReward(item);
                    setModalVisible(false);
                  }}
                >
                  <View style={styles.rewardImageThumb} />
                  <Text style={styles.rewardOptionText}>{item.title}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyRewardText}>Nenhuma recompensa disponível no momento.</Text>
              }
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={{ fontFamily: 'Poppins-Regular', color: '#64748b' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ValidarSelo visible={qrModalVisible} onClose={() => setQrModalVisible(false)} primaryColor={PRIMARY_COLOR} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F7' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  alertBox: { backgroundColor: '#E6F4F8', borderColor: '#227C9D', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center' },
  alertText: { color: '#227C9D', fontSize: 13, fontWeight: '600', fontFamily: 'Poppins-Regular' },
  floatingCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  headerLabel: { fontSize: 10, letterSpacing: 1, color: '#333C48', opacity: 0.6, fontFamily: 'Poppins-Regular' },
  storeName: { fontSize: 24, fontWeight: '700', color: '#333C48', marginBottom: 6, fontFamily: 'Poppins-Bold' },
  title: { fontSize: 16, color: '#333C48', marginBottom: 20, fontFamily: 'Poppins-Regular' },
  rewardContainer: { position: 'relative', marginBottom: 30, alignItems: 'center' },
  imageCard: { width: 140, height: 140, backgroundColor: '#FFF', padding: 5, borderRadius: 8, borderWidth: 1, borderColor: '#C7D0D8', overflow: 'hidden' },
  imagePlaceholder: { flex: 1, backgroundColor: '#F2F4F7', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#C7D0D8', fontSize: 10 },
  overlay: { position: 'absolute', bottom: 5, left: 5, right: 5, backgroundColor: 'rgba(51,60,72,0.85)', padding: 8, borderRadius: 4 },
  overlaySelected: { backgroundColor: 'rgba(34,124,157,0.95)' },
  overlayText: { color: '#FFF', fontSize: 9, textAlign: 'center', fontFamily: 'Poppins-Bold', lineHeight: 12 },
  ribbon: { position: 'absolute', top: -5, right: -30, backgroundColor: '#FFD000', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 },
  ribbonText: { color: '#333C48', fontSize: 10, fontWeight: '700', fontFamily: 'Poppins-Bold' },
  stampGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 20 },
  stamp: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  stampVazio: { borderWidth: 1, borderColor: '#C7D0D8', borderStyle: 'dashed' },
  stampCarimbado: { backgroundColor: '#227C9D', borderWidth: 0 },
  stampNumber: { color: '#C7D0D8', fontSize: 12 },
  divider: { width: '100%', height: 1, backgroundColor: '#F2F4F7', marginBottom: 20 },
  validText: { fontSize: 10, color: '#333C48', fontFamily: 'Poppins-Regular' },
  dateText: { fontSize: 14, fontWeight: '700', color: '#333C48', marginBottom: 24, fontFamily: 'Poppins-Bold' },
  validateButton: { backgroundColor: '#227C9D', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 8, marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFF', fontWeight: '700', fontFamily: 'Poppins-Bold' },
  disclaimer: { fontSize: 10, color: '#333C48', textAlign: 'center', opacity: 0.6, fontFamily: 'Poppins-Regular', lineHeight: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 20, textAlign: 'center', fontFamily: 'Poppins-Bold' },
  closeButton: { marginTop: 20, alignItems: 'center' },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 15 },
  rewardGridItem: { width: '48%', padding: 10, backgroundColor: '#F9F9F9', borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#E1E4E8' },
  rewardImageThumb: { width: 60, height: 60, backgroundColor: '#C7D0D8', borderRadius: 8, marginBottom: 8 },
  rewardOptionText: { fontSize: 12, textAlign: 'center', fontFamily: 'Poppins-Regular', color: '#333C48' },
  emptyRewardText: { textAlign: 'center', color: '#6b7280', fontSize: 12, fontFamily: 'Poppins-Regular' },
  errorText: { color: '#d14343', fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
});
