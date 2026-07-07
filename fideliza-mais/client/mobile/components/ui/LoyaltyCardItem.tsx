import React from 'react';
// Corrigido: Todos os componentes nativos importados corretamente do pacote 'react-native'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface Props {
  title: string;
  storeName: string;
  expiresAt: string;
  stamps: number;
  maxStamps: number;
  imageUrl?: string | null;
  onPress: () => void;
}

export const LoyaltyCardItem = ({ title, storeName, expiresAt, stamps, maxStamps, imageUrl, onPress }: Props) => {
  // Cálculo dinâmico para preencher a barra de progresso de selos
  const progressPercent = Math.min((stamps / maxStamps) * 100, 100);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        
        {/* ÁREA VISUAL: Imagem ou Placeholder Reduzido Lateral */}
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Text style={styles.placeholderLetter}>{storeName.charAt(0).toUpperCase()}</Text>
          </View>
        )}

        {/* ÁREA DE TEXTOS E METADADOS */}
        {/* Corrigido: Substituído 'div' por 'View' do React Native */}
        <View style={styles.infoArea}>
          <Text style={styles.storeName}>{storeName}</Text>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.date}>Validade: {expiresAt}</Text>
        </View>

      </View>

      {/* SEÇÃO INFERIOR DO CARD: PROGRESSO VISUAL */}
      <View style={styles.progressSection}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>Progresso do Cartão</Text>
          <Text style={styles.progressCount}>{stamps} / {maxStamps} selos</Text>
        </View>
        
        {/* Barra de Progresso Estilizada conforme o Design System */}
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#C7D0D8',
    padding: 16,
    shadowColor: '#333C48',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16
  },
  thumbnail: { 
    width: 56, 
    height: 56, 
    borderRadius: 8,
    backgroundColor: '#F2F4F7'
  },
  thumbnailPlaceholder: { 
    width: 56, 
    height: 56, 
    borderRadius: 8, 
    backgroundColor: 'rgba(34, 124, 157, 0.1)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  placeholderLetter: {
    fontSize: 20,
    fontWeight: '700',
    color: '#227C9D',
    fontFamily: 'Poppins-Bold'
  },
  infoArea: { 
    flex: 1,
    justifyContent: 'center'
  },
  storeName: { 
    fontSize: 11, 
    fontWeight: '600',
    color: '#227C9D', 
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Poppins-SemiBold'
  },
  title: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#333C48', 
    fontFamily: 'Poppins-Bold',
    marginTop: 1,
    marginBottom: 3
  },
  date: { 
    fontSize: 11, 
    color: '#717d8a', 
    fontFamily: 'Poppins-Regular' 
  },
  progressSection: {
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
    paddingTop: 12
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  progressLabel: {
    fontSize: 12,
    color: '#717d8a',
    fontFamily: 'Poppins-Regular'
  },
  progressCount: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#333C48', 
    fontFamily: 'Poppins-Bold' 
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#F2F4F7',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#227C9D', // Cor oficial do Design System
    borderRadius: 4
  }
});
