import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Vibration } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Pack3D from './Pack3D';

export default function OpenPackScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleOpenSequence = async () => {
        if (loading) return;
        
        setLoading(true);

        // Controle para o encerramento seguro do loop assíncrono
        let isRunning = true;

        // --- FEEDBACK TÁTIL COMPACTO E ASSÍNCRONO DURANTE O GIRO ---
        const runHapticsLoop = async () => {
            while (isRunning) {
                try {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                } catch (e) {
                    console.warn("Haptics não suportado:", e);
                }
                await new Promise(resolve => setTimeout(resolve, 120)); 
            }
        };

        // Inicia o ciclo de trepidação em background
        runHapticsLoop();

        // Aguarda 1.8 segundos rodando a animação de aceleração 3D em tela
        await new Promise(resolve => setTimeout(resolve, 1800));
        
        // Finaliza o loop de background antes de dar a pancada final
        isRunning = false;

        // --- ESTOURO FINAL IMPACTANTE (MÁXIMA INTENSIDADE) ---
        try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            await new Promise(resolve => setTimeout(resolve, 80));
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            Vibration.vibrate(300);
        }

        try {
            // Simulação assíncrona da rota da API para computar o selo no banco
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error("Erro simulado da API:", error);
        } finally {
            setLoading(false);
            
            // 1. Recurso Nativo: Redireciona substituindo a rota atual da pilha (Evita histórico de volta)
            // 2. Passa os parâmetros de controle para a tela de destino acionar o Haptics e a Animação
            router.replace({
                pathname: '/cards/[id]',
                params: { 
                    id: '1', // ID dinâmico ou fixo do cartão para o MVP
                    recebendoSelo: 'true' 
                }
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.view3D}>
                <Pack3D isAnimatingOpen={loading} />
            </View>

            <TouchableOpacity 
                style={[styles.openButton, loading && styles.disabledButton]} 
                onPress={handleOpenSequence}
                disabled={loading}
                activeOpacity={0.7}
            >
                {loading ? (
                    <ActivityIndicator color="#333C48" size="small" />
                ) : (
                    <Text style={styles.buttonText}>ABRIR PACOTE</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#1C1C1E' 
    },
    view3D: { 
        flex: 1, 
        width: '100%' 
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
        elevation: 4
    },
    disabledButton: {
        opacity: 0.6,
        backgroundColor: '#C7D0D8'
    },
    buttonText: { 
        color: '#333C48', 
        fontWeight: '700', 
        fontSize: 16, 
        fontFamily: 'Poppins-Bold',
        letterSpacing: 0.5
    }
});
