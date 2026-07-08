import React, { useState } from 'react';
import { Modal, Pressable, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Importações dos futuros subcomponentes da pasta UI
import ScannerCodigo from './ScannerCodigo';
import InputCodigo from './InputCodigo';
// Se decidir criar o feedback como componente isolado posteriormente:
// import ResultadoFeedback from './ui/ResultadoFeedback';

interface ValidarSeloProps {
  visible: boolean;
  onClose: () => void;
  primaryColor?: string;
  onCodigoConfirmado?: (data: any) => void;
}

interface FeedbackState {
  ativo: boolean;
  tipo: 'sucesso' | 'erro' | 'aviso';
  titulo: string;
  detalhe: string;
}

export default function ValidarSelo({ 
  visible, 
  onClose, 
  primaryColor = '#227C9D',
  onCodigoConfirmado 
}: ValidarSeloProps) {
  
  // Estados replicando a lógica dos Signals do Angular
  const [modo, setModo] = useState<'qr' | 'manual'>('qr');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({
    ativo: false,
    tipo: 'sucesso',
    titulo: '',
    detalhe: ''
  });

  const alternarModo = () => {
    setModo((m) => (m === 'qr' ? 'manual' : 'qr'));
  };

  const exibirFeedback = (tipo: 'sucesso' | 'erro' | 'aviso', titulo: string, detalhe: string) => {
    setFeedback({ ativo: true, tipo, titulo, detalhe });
  };

  const fecharFeedback = () => {
    setFeedback((f) => ({ ...f, ativo: false }));
    // Se o código foi um sucesso, fecha o modal inteiro ao fechar o feedback positivo
    if (feedback.tipo === 'sucesso') {
      handleCloseTotal();
    }
  };

  const handleCloseTotal = () => {
    // Reseta os estados internos ao fechar o modal principal
    setModo('qr');
    setFeedback({ ativo: false, tipo: 'sucesso', titulo: '', detalhe: '' });
    setLoading(false);
    onClose();
  };

  // Centraliza o processamento e validação vindo de ambos os componentes de entrada
  const processarEValidar = async (valor: string) => {
    if (!valor) return;

    const prefixo = valor.charAt(0).toUpperCase();
    const codigoLimpo = valor.substring(1);
    
    let endpoint = '';
    let tituloSucesso = '';

    if (prefixo === 'P') {
      endpoint = 'http://localhost:3000/vouchers/pontos/validar';
      tituloSucesso = 'Pontos Creditados!';
    } else if (prefixo === 'R') {
      endpoint = 'http://localhost:3000/vouchers/recompensas/validar';
      tituloSucesso = 'Resgate Confirmado!';
    } else {
      exibirFeedback('erro', 'Prefixo Inválido', 'O código lido não pertence ao nosso sistema.');
      return;
    }

    const payload = {
      codigo: codigoLimpo,
      idCliente: 'f012602b-fbf2-11f0-9d6b-cecd02c24f20' // ID fixo do MVP
    };

    try {
      setLoading(true);
      console.log(`🚀 Validando no Ecossistema (${prefixo}):`, payload);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const res = await response.json();

      if (response.ok) {
        const resultadoFinal = res?.resultado || 'ERRO_DESCONHECIDO';

        if (resultadoFinal === 'SUCESSO') {
          exibirFeedback('sucesso', tituloSucesso, 'A transação foi processada com sucesso.');
          if (onCodigoConfirmado) onCodigoConfirmado(res);
        } else {
          exibirFeedback('aviso', 'Atenção', resultadoFinal.replace(/_/g, ' '));
        }
      } else {
        const mensagemErro = res?.erro || res?.resultado || 'FALHA_NA_COMUNICACAO';
        exibirFeedback('erro', 'Falha na Validação', String(mensagemErro).replace(/_/g, ' '));
      }
    } catch (err) {
      console.error('❌ Erro de comunicação com o servidor:', err);
      exibirFeedback('erro', 'Falha na Validação', 'Erro de rede ou conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Mapeamento de cores baseado no tipo do Feedback
  const getFeedbackColor = () => {
    if (feedback.tipo === 'sucesso') return '#2a9d8f';
    if (feedback.tipo === 'erro') return '#e63946';
    return '#f4a261'; // aviso
  };

  const getFeedbackIcon = () => {
    if (feedback.tipo === 'sucesso') return 'check-circle';
    if (feedback.tipo === 'erro') return 'times-circle';
    return 'exclamation-circle';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCloseTotal}>
      
      <View style={styles.modalScreenOverlay}>
        
        {/* Container da validação (Semelhante à classe .validacao-container) */}
        <View style={styles.validacaoContainer}>
          
          {/* Botão X superior para fechar o Modal principal */}
          <TouchableOpacity style={styles.topCloseButton} onPress={handleCloseTotal}>
            <FontAwesome name="close" size={20} color="#94a3b8" />
          </TouchableOpacity>

          {/* Área de Conteúdo (.validacao-content) */}
          <View style={styles.validacaoContent}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={primaryColor} />
                <Text style={styles.loadingText}>Processando transação...</Text>
              </View>
            ) : modo === 'qr' ? (
              <View style={styles.scannerBox}>
                <ScannerCodigo resultado={processarEValidar} />
              </View>
            ) : (
              <View style={styles.manualBox}>
                <InputCodigo codigoValido={processarEValidar} primaryColor={primaryColor} />
              </View>
            )}
          </View>

          {/* Rodapé Alternador (.footer-alternador) */}
          <View style={styles.footerAlternador}>
            <TouchableOpacity style={styles.btnTrocaModo} onPress={alternarModo}>
              <FontAwesome 
                name={modo === 'qr' ? 'keyboard-o' : 'qrcode'} 
                size={20} 
                color={primaryColor} 
              />
              <Text style={[styles.btnTrocaModoText, { color: primaryColor }]}>
                {modo === 'qr' ? 'Digitar Código Manual' : 'Escanear QR Code'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal de Feedback Embutido (Replicando o app-resultado-feedback) */}
        {feedback.ativo && (
          <View style={[StyleSheet.absoluteFillObject, styles.feedbackOverlay]}>
            <View style={styles.feedbackCard}>
              <FontAwesome name={getFeedbackIcon()} size={60} color={getFeedbackColor()} />
              <Text style={styles.feedbackTitle}>{feedback.titulo}</Text>
              <Text style={styles.feedbackDetail}>{feedback.detalhe}</Text>
              
              <TouchableOpacity 
                style={[styles.feedbackButton, { backgroundColor: getFeedbackColor() }]} 
                onPress={fecharFeedback}>
                <Text style={styles.feedbackButtonText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalScreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  validacaoContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 35,
    elevation: 10,
    position: 'relative',
  },
  topCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 20,
    padding: 8,
  },
  validacaoContent: {
    padding: 20,
    minHeight: 350,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  scannerBox: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manualBox: {
    width: '100%',
  },
  footerAlternador: {
    padding: 15,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTrocaModo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 8,
  },
  btnTrocaModoText: {
    fontWeight: '700',
    fontSize: 14,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  // Estilos equivalentes ao app-resultado-feedback
  feedbackOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  feedbackCard: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
    textAlign: 'center',
  },
  feedbackDetail: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  feedbackButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  feedbackButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
