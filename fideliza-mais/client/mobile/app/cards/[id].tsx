import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';

const REWARDS = [
    { id: '1', name: '1 Cappuccino Gourmet' },
    { id: '2', name: '1 Bolo de Chocolate' },
    { id: '3', name: '1 Croissant Artesanal' },
];

export default function CardDetailScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedReward, setSelectedReward] = useState<{ name: string } | null>(null);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.floatingCard}>
                <Text style={styles.headerLabel}>CARTÃO FIDELIDADE</Text>
                <Text style={styles.storeName}>Pausa & Sabor</Text>

                <TouchableOpacity style={styles.rewardContainer} onPress={() => setModalVisible(true)}>
                    <View style={[styles.imageCard, { transform: [{ rotate: '-1deg' }] }]}>
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.placeholderText}>IMG</Text>
                        </View>

                        {/* Overlay que vira o rótulo da recompensa */}
                        <View style={[styles.overlay, selectedReward ? styles.overlaySelected : null]}>
                            <Text style={styles.overlayText} numberOfLines={2}>
                                {selectedReward ? selectedReward.name.substring(0, 50) : 'TOQUE PARA ESCOLHER'}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.ribbon, { transform: [{ rotate: '2deg' }] }]}>
                        <Text style={styles.ribbonText}>PRÓXIMO RESGATE</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.stampGrid}>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <View key={i} style={styles.stamp}><Text style={styles.stampNumber}>{i + 1}</Text></View>
                    ))}
                </View>

                <View style={styles.divider} />
                <Text style={styles.validText}>VÁLIDO ATÉ</Text>
                <Text style={styles.dateText}>06/07/2027</Text>

                <TouchableOpacity style={styles.validateButton}>
                    <Text style={styles.buttonText}>+ VALIDAR NOVO SELO</Text>
                </TouchableOpacity>

                <Text style={styles.disclaimer}>
                    Imagens meramente ilustrativas. Consulte a disponibilidade das recompensas no balcão.
                </Text>
            </View>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Escolha seu Prêmio</Text>
                        <FlatList
                            data={REWARDS}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            columnWrapperStyle={styles.columnWrapper}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.rewardGridItem}
                                    onPress={() => { setSelectedReward(item); setModalVisible(false); }}
                                >
                                    <View style={styles.rewardImageThumb} />
                                    <Text style={styles.rewardOptionText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F4F7' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    floatingCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
    headerLabel: { fontSize: 10, letterSpacing: 1, color: '#333C48', opacity: 0.6, fontFamily: 'Poppins-Regular' },
    storeName: { fontSize: 24, fontWeight: '700', color: '#333C48', marginBottom: 20, fontFamily: 'Poppins-Bold' },
    rewardContainer: { position: 'relative', marginBottom: 30, alignItems: 'center' },
    imageCard: { width: 140, height: 140, backgroundColor: '#FFF', padding: 5, borderRadius: 8, borderWidth: 1, borderColor: '#C7D0D8' },
    imagePlaceholder: { flex: 1, backgroundColor: '#F2F4F7', justifyContent: 'center', alignItems: 'center' },
    placeholderText: { color: '#C7D0D8', fontSize: 10 },

    // Ajustes do Overlay para comportamento dinâmico
    overlay: {
        position: 'absolute', bottom: 5, left: 5, right: 5,
        backgroundColor: 'rgba(51,60,72,0.85)', padding: 8, borderRadius: 4
    },
    overlaySelected: {
        backgroundColor: 'rgba(34,124,157,0.95)' // Cor de destaque para o prêmio selecionado
    },
    overlayText: {
        color: '#FFF', fontSize: 9, textAlign: 'center', fontFamily: 'Poppins-Bold', lineHeight: 12
    },

    ribbon: { position: 'absolute', top: -5, right: -30, backgroundColor: '#FFD000', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 },
    ribbonText: { color: '#333C48', fontSize: 10, fontWeight: '700', fontFamily: 'Poppins-Bold' },
    stampGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 20 },
    stamp: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: '#C7D0D8', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
    stampNumber: { color: '#C7D0D8', fontSize: 12 },
    divider: { width: '100%', height: 1, backgroundColor: '#F2F4F7', marginBottom: 20 },
    validText: { fontSize: 10, color: '#333C48', fontFamily: 'Poppins-Regular' },
    dateText: { fontSize: 14, fontWeight: '700', color: '#333C48', marginBottom: 24, fontFamily: 'Poppins-Bold' },
    validateButton: { backgroundColor: '#227C9D', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 8, marginBottom: 20 },
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
});