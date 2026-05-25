import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import type { ReactNode } from 'react';

type TeclaProps = {
  label: string;
  displayLabel?: string;
  icon?: ReactNode;
  onAdicionar?: (valor: string) => void;
  onPress?: () => void;
  style?: object;
  textStyle?: object;
};

export default function Tecla({
  label,
  displayLabel,
  icon,
  onAdicionar,
  onPress,
  style,
  textStyle,
}: TeclaProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (onAdicionar) {
      onAdicionar(label);
    }
  };

  return (
    <TouchableHighlight style={[styles.botao, style]} onPress={handlePress} underlayColor="#1d4ed8">
      {icon ? (
        <View style={styles.conteudoIcone}>{icon}</View>
      ) : (
        <Text style={[styles.texto, textStyle]}>{displayLabel ?? label}</Text>
      )}
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  botao: {
    minHeight: 68,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  conteudoIcone: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
