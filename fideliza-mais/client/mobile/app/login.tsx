import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Modal } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { requestOtp, verifyOtp } = useAuth();

  const handleSendOtp = async () => {
    if (!email.trim()) {
      Alert.alert('Login', 'Informe seu e-mail para receber o código.');
      return;
    }

    setIsSubmitting(true);

    try {
      await requestOtp(email);
      setShowOtpModal(true);
    } catch (error) {
      Alert.alert('Login', error instanceof Error ? error.message : 'Não foi possível enviar o código.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) {
      Alert.alert('Login', 'Informe o código recebido.');
      return;
    }

    setIsSubmitting(true);

    try {
      await verifyOtp(email, otpCode);
      setShowOtpModal(false);
      setOtpCode('');
    } catch (error) {
      Alert.alert('Login', error instanceof Error ? error.message : 'Não foi possível validar o código.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fideliza+</Text>
      <Text style={styles.subtitle}>Informe seu e-mail para receber um código de acesso</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Pressable style={styles.button} onPress={handleSendOtp} disabled={isSubmitting}>
        <Text style={styles.buttonText}>{isSubmitting ? 'Aguarde...' : 'Enviar código'}</Text>
      </Pressable>

      <Modal visible={showOtpModal} transparent animationType="slide" onRequestClose={() => setShowOtpModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Digite o código</Text>
            <Text style={styles.modalSubtitle}>Enviamos um código para {email || 'seu e-mail'}</Text>

            <TextInput
              style={styles.input}
              placeholder="Código OTP"
              keyboardType="number-pad"
              value={otpCode}
              onChangeText={setOtpCode}
            />

            <Pressable style={styles.button} onPress={handleVerifyOtp} disabled={isSubmitting}>
              <Text style={styles.buttonText}>{isSubmitting ? 'Validando...' : 'Verificar'}</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={() => setShowOtpModal(false)}>
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#227C9D',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6b7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  modalSubtitle: {
    color: '#6b7280',
    marginBottom: 16,
  },
});
