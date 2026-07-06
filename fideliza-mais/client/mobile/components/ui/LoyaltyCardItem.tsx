import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface Props {
  title: string;
  storeName: string;
  expiresAt: string;
  stamps: number;
  maxStamps: number;
  onPress: () => void;
}

export const LoyaltyCardItem = ({ title, storeName, expiresAt, stamps, maxStamps, onPress }: Props) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.visualArea}>
      <Text style={styles.placeholderText}>Logo/Banner</Text>
    </View>
    <View style={styles.infoArea}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.storeName}>{storeName}</Text>
      <View style={styles.row}>
        <Text style={styles.date}>Expira em: {expiresAt}</Text>
        <Text style={styles.progress}>{stamps}/{maxStamps} selos</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#C7D0D8' },
  visualArea: { height: 80, backgroundColor: '#F2F4F7', justifyContent: 'center', alignItems: 'center' },
  infoArea: { padding: 12 },
  title: { fontSize: 16, fontWeight: '700', color: '#333C48', fontFamily: 'Poppins-Bold' },
  storeName: { fontSize: 13, color: '#333C48', fontFamily: 'Poppins-Regular', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  date: { fontSize: 12, color: '#333C48', fontFamily: 'Poppins-Regular' },
  progress: { fontSize: 12, fontWeight: '600', color: '#227C9D', fontFamily: 'Poppins-SemiBold' },
  placeholderText: { color: '#C7D0D8' }
});