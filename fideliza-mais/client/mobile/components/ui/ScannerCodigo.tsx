import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface ScannerCodigoProps {
  resultado: (codigo: string) => void;
}

export default function ScannerCodigo({ resultado }: ScannerCodigoProps) {
  // 1. Recurso Nativo: Sistema de Permissão de Câmera do Dispositivo
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  
  // 2. Recurso Nativo: Animated API do React Native para a linha de Scan
  const scanAnim = useRef(new Animated.Value(0)).current;

  // Efeito para rodar a animação infinita da linha amarela de scan
  useEffect(() => {
    if (permission?.granted) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false, // Injetado via JS para propriedades de layout como 'top'
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          })
        ])
      ).start();
    }
  }, [permission, scanAnim]);

  // Interpolação para mover a linha de 15% até 85% da altura da caixinha
  const scanLineTop = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['15%', '85%']
  });

  // Gatilho nativo disparado ao detectar um código na imagem da câmera
  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return; // Trava para não disparar múltiplos bips seguidos
    setScanned(true);
    console.log(`[NATIVO] Código detectado do tipo ${type} com dados: ${data}`);
    resultado(data);
  };

  // Tratamento do estado de carregamento da permissão
  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="small" color="#227C9D" />
      </View>
    );
  }

  // Estado de Erros/Bloqueado (Semelhante à classe .sem-permissao)
  if (!permission.granted) {
    return (
      <View style={styles.scannerContainer}>
        <View style={styles.scannerCard}>
          <Text style={styles.scannerTitle}>Escanear QR Code</Text>
          <Text style={styles.scannerSubtitle}>Aproxime o código da área de leitura</Text>

          <View style={[styles.scannerArea, styles.semPermissao]}>
            <View style={styles.cameraPlaceholder}>
              <FontAwesome name="video-camera" size={44} color="#94a3b8" />
              <Text style={styles.msgPermissao}>Acesso à câmera negado.</Text>
              
              <TouchableOpacity style={styles.btnPermissao} onPress={requestPermission}>
                <Text style={styles.btnPermissaoText}>Pedir Permissão</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Estado de Câmera Ativa e Pronta
  return (
    <View style={styles.scannerContainer}>
      <View style={styles.scannerCard}>
        <Text style={styles.scannerTitle}>Escanear QR Code</Text>
        <Text style={styles.scannerSubtitle}>Aproxime o código da área de leitura</Text>

        <View style={styles.scannerArea}>
          
          {/* 3. Recurso Nativo: Renderizador de Câmera física do Dispositivo */}
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr'], // Otimiza para ler estritamente QR Codes, ignorando barras tradicionais
            }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          />

          {/* Linha de Scan Animada Nativa */}
          <Animated.View style={[styles.scanLine, { top: scanLineTop }]} />
          
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  scannerContainer: {
    alignItems: 'center',
    width: '100%',
    color: '#1e293b',
  },
  scannerCard: {
    width: '100%',
    alignItems: 'center',
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#0f172a',
    textAlign: 'center',
  },
  scannerSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#64748b',
    marginBottom: 24,
    textAlign: 'center',
  },
  scannerArea: {
    width: 240,
    height: 180,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#227C9D',
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  semPermissao: {
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  scanLine: {
    position: 'absolute',
    left: '10%',
    width: '80%',
    height: 3,
    backgroundColor: '#FFD000',
    shadowColor: '#FFD000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  cameraPlaceholder: {
    width: '100%',
    alignItems: 'center',
    padding: 12,
  },
  msgPermissao: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 13,
  },
  btnPermissao: {
    marginTop: 12,
    backgroundColor: '#227C9D',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnPermissaoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
