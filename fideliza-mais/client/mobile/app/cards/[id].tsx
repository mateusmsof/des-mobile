import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Animated, Vibration, ActivityIndicator } from 'react-native';

// Componente híbrido nativo de validação criado anteriormente
import ValidarSelo from '../../components/ui/ValidarSelo';

const REWARDS = [
    { id: '1', name: '1 Cappuccino Gourmet' },
    { id: '2', name: '1 Bolo de Chocolate' },
    { id: '3', name: '1 Croissant Artesanal' },
];

const PRIMARY_COLOR = '#227C9D';

// 1. Simulação dos dados que viriam de uma consulta assíncrona à API
const MOCK_API_DATA = {
    estabelecimentoNome: "Pausa & Sabor",
    recompensaSelecionadaId: "2", // Se fosse null, exibiria 'TOQUE PARA ESCOLHER'
    recompensaImagemUrl: null,    // URL simulada da imagem (se houver)
    totalStampsCartela: 10,       // Quantidade total de posições
    stampsPreenchidosAtual: 6     // Quantidade de selos já conquistados pelo cliente
};


export default function CardDetailScreen() {
    const params = useLocalSearchParams();
    const veioDeAberturaPacote = params.recebendoSelo === 'true';

    // Estados de controle de modais e prêmios
    const [modalVisible, setModalVisible] = useState(false);
    const [qrModalVisible, setQrModalVisible] = useState(false);
    
    const prêmioInicial = REWARDS.find(r => r.id === MOCK_API_DATA.recompensaSelecionadaId) || null;
    const [selectedReward, setSelectedReward] = useState<{ name: string } | null>(prêmioInicial);

    // Estado para controlar a espera da resposta da requisição fictícia
    const [apiLoading, setApiLoading] = useState(true);

    // 1. Recurso Nativo: Referência animada para controlar o impacto do carimbo
    const carimboAnim = useRef(new Animated.Value(0)).current;

    // Ciclo de vida controlado: Faz a chamada à API e engatilha a animação/vibração sequencialmente
    useEffect(() => {
        // Função isolada de vibração no mesmo estilo/padrão da tela OpenPackScreen
        const dispararPancadaTatil = async () => {
            try {
                // Estouro de impacto (Padrão idêntico ao que você usou com sucesso)
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                await new Promise(resolve => setTimeout(resolve, 80));
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
                // Fallback Nativo caso falhe ou esteja no simulador
                Vibration.vibrate(300);
            }
        };

        const carregarDadosEAnimar = async () => {
            try {
                // Simulação da chamada assíncrona à API (Aguarda 800ms)
                // const response = await api.get('/cards/detalhes');
                await new Promise(resolve => setTimeout(resolve, 800));
            } catch (error) {
                console.error("Erro na requisição fictícia:", error);
            } finally {
                // 1. A resposta chegou! Libera a renderização da tela/grade
                setApiLoading(false);

                // Dispara o fluxo apenas se veio de um pacote aberto
                if (veioDeAberturaPacote) {
                    
                    // 2. USO IDÊNTICO: Dispara a função assíncrona dedicada de vibração
                    // sem prendê-la dentro de callbacks ou travas da animação
                    dispararPancadaTatil();

                    // 3. Dispara a animação visual em paralelo correndo de forma independente
                    Animated.parallel([
                        Animated.timing(carimboAnim, {
                            toValue: 1,
                            duration: 450,
                            useNativeDriver: true,
                        })
                    ]).start(); 
                }
            }
        };

        carregarDadosEAnimar();
    }, [veioDeAberturaPacote]);


      const renderStampGrid = () => {
        const stamps = [];
        const indiceUltimoCarimbo = MOCK_API_DATA.stampsPreenchidosAtual - 1;

        for (let i = 0; i < MOCK_API_DATA.totalStampsCartela; i++) {
            const isCarimbado = i < MOCK_API_DATA.stampsPreenchidosAtual;
            const ehOUltimoColocado = i === indiceUltimoCarimbo && veioDeAberturaPacote;

            if (ehOUltimoColocado) {
                const stampScale = carimboAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [3, 1]
                });
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
                                    opacity: stampOpacity 
                                }
                            ]}
                        >
                            <FontAwesome name="check" size={16} color="#FFF" />
                        </Animated.View>
                    </View>
                );
            } else {
                stamps.push(
                    <View 
                        key={i} 
                        style={[
                            styles.stamp, 
                            isCarimbado ? styles.stampCarimbado : styles.stampVazio
                        ]}
                    >
                        {isCarimbado ? (
                            <FontAwesome name="check" size={16} color="#FFF" />
                        ) : (
                            <Text style={styles.stampNumber}>{i + 1}</Text>
                        )}
                    </View>
                );
            }
        }
        return stamps;
    };

    // Tela exibe um esqueleto de carregamento nativo limpo enquanto a API não responde
    if (apiLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Stack.Screen options={{ title: 'Carregando...' }} />
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

            {/* 4. Recurso Nativo: Modifica propriedades da barra nativa de cabeçalho do celular */}
            <Stack.Screen
                options={{
                    title: MOCK_API_DATA.estabelecimentoNome,
                    headerTitleStyle: { fontFamily: 'Poppins-Bold', fontSize: 16 }
                }}
            />

            {/* Alerta de Feedback Nativo Visual caso venha de uma abertura de pacote de selo */}
            {veioDeAberturaPacote && (
                <View style={styles.alertBox}>
                    <FontAwesome name="gift" size={18} color="#227C9D" style={{ marginRight: 8 }} />
                    <Text style={styles.alertText}>Você acabou de ganhar um novo selo!</Text>
                </View>
            )}

            <View style={styles.floatingCard}>
                <Text style={styles.headerLabel}>CARTÃO FIDELIDADE</Text>
                <Text style={styles.storeName}>{MOCK_API_DATA.estabelecimentoNome}</Text>

                <TouchableOpacity style={styles.rewardContainer} onPress={() => setModalVisible(true)}>
                    <View style={[styles.imageCard, { transform: [{ rotate: '-1deg' }] }]}>

                        {MOCK_API_DATA.recompensaImagemUrl ? (
                            <Image
                                source={{ uri: MOCK_API_DATA.recompensaImagemUrl }}
                                style={StyleSheet.absoluteFillObject}
                            />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Text style={styles.placeholderText}>IMG</Text>
                            </View>
                        )}

                        {/* Overlay com comportamento estético dependente de seleção */}
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

                {/* Grade Gerada Dinamicamente */}
                <View style={styles.stampGrid}>
                    {renderStampGrid()}
                </View>

                <View style={styles.divider} />
                <Text style={styles.validText}>VÁLIDO ATÉ</Text>
                <Text style={styles.dateText}>06/07/2027</Text>

                <TouchableOpacity style={styles.validateButton} onPress={() => setQrModalVisible(true)}>
                    <FontAwesome name="qrcode" size={18} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>VALIDAR NOVO SELO</Text>
                </TouchableOpacity>

                <Text style={styles.disclaimer}>
                    Imagens meramente ilustrativas. Consulte a disponibilidade das recompensas no balcão.
                </Text>
            </View>

            {/* Modal de escolha de prêmio */}
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
                            <Text style={{ fontFamily: 'Poppins-Regular', color: '#64748b' }}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Componente de validação híbrido consumido de forma limpa */}
            <ValidarSelo
                visible={qrModalVisible}
                onClose={() => setQrModalVisible(false)}
                primaryColor={PRIMARY_COLOR}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F4F7' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    alertBox: {
        backgroundColor: '#E6F4F8',
        borderColor: '#227C9D',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    alertText: {
        color: '#227C9D',
        fontSize: 13,
        fontWeight: '600',
        fontFamily: 'Poppins-Regular'
    },
    floatingCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
    headerLabel: { fontSize: 10, letterSpacing: 1, color: '#333C48', opacity: 0.6, fontFamily: 'Poppins-Regular' },
    storeName: { fontSize: 24, fontWeight: '700', color: '#333C48', marginBottom: 20, fontFamily: 'Poppins-Bold' },
    rewardContainer: { position: 'relative', marginBottom: 30, alignItems: 'center' },
    imageCard: { width: 140, height: 140, backgroundColor: '#FFF', padding: 5, borderRadius: 8, borderWidth: 1, borderColor: '#C7D0D8', overflow: 'hidden' },
    imagePlaceholder: { flex: 1, backgroundColor: '#F2F4F7', justifyContent: 'center', alignItems: 'center' },
    placeholderText: { color: '#C7D0D8', fontSize: 10 },

    overlay: {
        position: 'absolute', bottom: 5, left: 5, right: 5,
        backgroundColor: 'rgba(51,60,72,0.85)', padding: 8, borderRadius: 4
    },
    overlaySelected: {
        backgroundColor: 'rgba(34,124,157,0.95)'
    },
    overlayText: {
        color: '#FFF', fontSize: 9, textAlign: 'center', fontFamily: 'Poppins-Bold', lineHeight: 12
    },

    ribbon: { position: 'absolute', top: -5, right: -30, backgroundColor: '#FFD000', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 },
    ribbonText: { color: '#333C48', fontSize: 10, fontWeight: '700', fontFamily: 'Poppins-Bold' },
    // Configurações do Grid de Carimbos
    stampGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20
    },
    stamp: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' }, stampVazio: { borderWidth: 1, borderColor: '#C7D0D8', borderStyle: 'dashed' }, stampCarimbado: { backgroundColor: '#227C9D', borderWidth: 0 }, stampNumber: { color: '#C7D0D8', fontSize: 12 }, divider: { width: '100%', height: 1, backgroundColor: '#F2F4F7', marginBottom: 20 }, validText: { fontSize: 10, color: '#333C48', fontFamily: 'Poppins-Regular' }, dateText: { fontSize: 14, fontWeight: '700', color: '#333C48', marginBottom: 24, fontFamily: 'Poppins-Bold' }, validateButton: { backgroundColor: '#227C9D', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 8, marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, buttonText: { color: '#FFF', fontWeight: '700', fontFamily: 'Poppins-Bold' }, disclaimer: { fontSize: 10, color: '#333C48', textAlign: 'center', opacity: 0.6, fontFamily: 'Poppins-Regular', lineHeight: 14 }, modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }, modalContent: { backgroundColor: '#FFF', borderRadius: 12, padding: 20 }, modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 20, textAlign: 'center', fontFamily: 'Poppins-Bold' }, closeButton: { marginTop: 20, alignItems: 'center' }, columnWrapper: { justifyContent: 'space-between', marginBottom: 15 }, rewardGridItem: { width: '48%', padding: 10, backgroundColor: '#F9F9F9', borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#E1E4E8' }, rewardImageThumb: { width: 60, height: 60, backgroundColor: '#C7D0D8', borderRadius: 8, marginBottom: 8 }, rewardOptionText: { fontSize: 12, textAlign: 'center', fontFamily: 'Poppins-Regular', color: '#333C48' },
});