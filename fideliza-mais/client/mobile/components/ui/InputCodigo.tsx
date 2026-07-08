import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Pressable } from 'react-native';

interface InputCodigoProps {
  codigoValido: (codigo: string) => void;
  primaryColor?: string;
}

export default function InputCodigo({ codigoValido, primaryColor = '#227C9D' }: InputCodigoProps) {
  const [codigoCompleto, setCodigoCompleto] = useState('');
  const TAMANHO_MAXIMO = 7;
  
  // Referência nativa para controlar o elemento de Input de Texto e abrir o teclado
  const inputRef = useRef<TextInput>(null);

  // Força o teclado nativo a subir automaticamente assim que o modo manual é aberto
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Garante que o clique em qualquer lugar da caixinha cinza jogue o foco para o input
  const focarInput = () => {
    inputRef.current?.focus();
  };

  // Transforma o texto corrido em um array fixo de 7 posições (Igual ao getter do Angular)
  const renderDigitosVisuais = () => {
    const digitos = codigoCompleto.split('');
    const caixas = [];
    
    for (let i = 0; i < TAMANHO_MAXIMO; i++) {
      const char = digitos[i] || '';
      const isActive = codigoCompleto.length === i;
      
      caixas.push(
        <View 
          key={i} 
          style={[
            styles.codeBox, 
            isActive ? { borderColor: primaryColor, shadowColor: primaryColor } : null
          ]}
        >
          <Text style={styles.codeText}>{char}</Text>
        </View>
      );
    }
    return caixas;
  };

  const handleTextChange = (text: string) => {
    // Filtro via Regex: Apenas letras e números, transformando tudo em maiúsculo
    const filtrado = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCodigoCompleto(filtrado);
  };

  const isComplete = codigoCompleto.length === TAMANHO_MAXIMO;

  const confirmar = () => {
    if (isComplete) {
      console.log('✅ [NATIVO] Enviando código para o ecossistema:', codigoCompleto);
      codigoValido(codigoCompleto);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputCard}>
        <Text style={styles.inputTitle}>Código Manual</Text>
        <Text style={styles.inputSubtitle}>Digite os {TAMANHO_MAXIMO} caracteres do voucher</Text>

        {/* Pressable detecta o clique e abre o teclado físico via ref */}
        <Pressable style={styles.manualCaptureArea} onPress={focarInput}>
          <View style={styles.codeWrapper}>
            
            {/* Input nativo real que fica completamente invisível por trás */}
            <TextInput
              ref={inputRef}
              style={styles.hiddenInput}
              value={codigoCompleto}
              onChangeText={handleTextChange}
              maxLength={TAMANHO_MAXIMO}
              autoCapitalize="characters"
              autoCorrect={false}
              autoComplete="off"
              keyboardType="visible-password" // Desativa sugestões de dicionário na barra de digitação
            />

            {/* Grupo de quadradinhos cosméticos */}
            <View style={styles.codeFieldGroup}>
              {renderDigitosVisuais()}
            </View>

          </View>
        </Pressable>

        <View style={styles.actionFooter}>
          <TouchableOpacity 
            style={[
              styles.btnConfirmar, 
              isComplete ? { backgroundColor: primaryColor } : styles.btnDisabled
            ]} 
            disabled={!isComplete}
            onPress={confirmar}
          >
            <Text style={styles.btnConfirmarText}>Validar Código</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputCard: {
    width: '100%',
    alignItems: 'center',
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#0f172a',
    textAlign: 'center',
  },
  inputSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#64748b',
    marginBottom: 24,
    textAlign: 'center',
  },
  manualCaptureArea: {
    width: '100%',
    maxWidth: 280,
    height: 180,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  codeWrapper: {
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0, // Truque crucial: Invisível mas com área ativa de toque
    zIndex: 10,
    color: 'transparent',
  },
  codeFieldGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 6,
  },
  codeBox: {
    flex: 1,
    minWidth: 30,
    maxWidth: 36,
    aspectRatio: 1 / 1.4,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra suave para simular o efeito de foco ativo
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  codeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  actionFooter: {
    width: '100%',
    alignItems: 'center',
  },
  btnConfirmar: {
    marginTop: 24,
    width: 240,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  btnDisabled: {
    backgroundColor: '#94a3b8',
    opacity: 0.6,
  },
  btnConfirmarText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
});
