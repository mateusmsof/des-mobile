import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Pack3D from './Pack3D';

export default function OpenPackScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.idLabel}>PACOTE #{id}</Text>
                <Text style={styles.title}>Preparado para abrir?</Text>
            </View>

            <View style={styles.view3D}>
                <Pack3D />
            </View>

            <TouchableOpacity 
                style={styles.openButton} 
                onPress={() => console.log("Ação de abrir chamada")}
            >
                <Text style={styles.buttonText}>ABRIR PACOTE</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1C1C1E' }, // Fundo escuro realça o dourado
    header: { marginTop: 80, alignItems: 'center' },
    idLabel: { color: '#FFD000', fontSize: 12, letterSpacing: 2 },
    title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 10 },
    view3D: { flex: 1, width: '100%' },
    openButton: { 
        margin: 20, 
        backgroundColor: '#FFD000', 
        padding: 20, 
        borderRadius: 15, 
        alignItems: 'center',
        marginBottom: 40
    },
    buttonText: { color: '#333C48', fontWeight: 'bold', fontSize: 18 }
});