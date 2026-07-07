import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, PanResponder, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Pack3D from './Pack3D';

export default function OpenPackScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    
    const [loading, setLoading] = useState(false);
    const [isOpened, setIsOpened] = useState(false);
    
    // Estados para controlar o ângulo que repassamos para o Three.js
    const [rotateY, setRotateY] = useState(0);
    const [rotateX, setRotateX] = useState(0);

    // Guarda o último ponto para calcular o intervalo de vibração por rastro
    const lastHapticX = useRef(0);

    // Lógica para enviar a requisição de abertura ao backend
    const handleOpenPackAction = async () => {
        if (loading || isOpened) return;
        
        try {
            setLoading(true);
            
            // Sucesso Tátil Crítico: Vibração forte de impacto (Sucesso de abertura de recompensa)
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Simulação da chamada POST para a sua API associando o selo do pacote à cartela
            // await api.post(`/stamp-packs/${id}/open`);
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            setIsOpened(true);
            Alert.alert("Sucesso!", "Pacote aberto com sucesso e selo creditado no seu cartão fidelidade!", [
                { text: "Ver Cartão", onPress: () => router.replace('/(tabs)/backpack') }
            ]);

        } catch (error) {
            console.error(error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Erro", "Não foi possível abrir seu pacote de selos no momento.");
        } finally {
            setLoading(false);
        }
    };

    // Configuração do PanResponder para capturar arrastos na tela 3D
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                if (loading || isOpened) return;

                // Converte a distância do arrasto em radianos simples para o Three.js
                setRotateY(gestureState.dx * 0.01);
                setRotateX(gestureState.dy * 0.01);

                // --- SISTEMA TÁTIL DINÂMICO (Efeito de Catraca/Ranhura) ---
                // A cada 25 pixels arrastados na horizontal, o motor tátil dá um estalinho sutil
                if (Math.abs(gestureState.dx - lastHapticX.current) > 25) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    lastHapticX.current = gestureState.dx;
                }

                // Se o usuário arrastar por mais de 160 pixels, o pacote estoura de forma automática
                if (Math.abs(gestureState.dx) > 160 || Math.abs(gestureState.dy) > 160) {
                    handleOpenPackAction();
                }
            },
            onPanResponderRelease: () => {
                // Ao soltar o dedo, o pacote retorna suavemente à rotação original
                if (!isOpened) {
                    setRotateY(0);
                    setRotateX(0);
                    lastHapticX.current = 0;
                }
            }
        })
    ).current;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.idLabel}>PACOTE #{id}</Text>
                <Text style={styles.title}>
                    {isOpened ? "Pacote Aberto!" : "Arrastar para rasgar"}
                </Text>
            </View>

            {/* O PanResponder envolve toda a área 3D para rastrear o toque */}
            <View style={styles.view3D} {...panResponder.panHandlers}>
                <Pack3D rotationX={rotateX} rotationY={rotateY} />
            </View>

            <TouchableOpacity 
                style={[styles.openButton, (loading || isOpened) && styles.disabledButton]} 
                onPress={handleOpenPackAction}
                disabled={loading || isOpened}
                activeOpacity={0.7}
            >
                {loading ? (
                    <ActivityIndicator color="#333C48" />
                ) : (
                    <Text style={styles.buttonText}>
                        {isOpened ? "CONCLUÍDO" : "ABRIR PACOTE"}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1C1C1E' }, 
    header: { marginTop: 80, alignItems: 'center', paddingHorizontal: 20 },
    idLabel: { color: '#FFD000', fontSize: 12, letterSpacing: 2, fontFamily: 'Poppins-Bold' },
    title: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginTop: 10, textAlign: 'center', fontFamily: 'Poppins-Bold' },
    view3D: { flex: 1, width: '100%' },
    openButton: { 
        margin: 20, 
        backgroundColor: '#FFD000', // Destaque oficial do DS para recompensas
        padding: 20, 
        borderRadius: 15, 
        alignItems: 'center',
        marginBottom: 40,
        height: 64,
        justifyContent: 'center'
    },
    disabledButton: {
        opacity: 0.5
    },
    buttonText: { color: '#333C48', fontWeight: 'bold', fontSize: 16, fontFamily: 'Poppins-Bold' }
});
