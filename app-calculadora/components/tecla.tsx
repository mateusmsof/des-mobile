import { StyleSheet, Text, TouchableHighlight } from 'react-native';

type TeclaProps = {
  label: string;
  onAdicionar?: (valor: string) => void;
  onPress?: () => void;
  style?: object;
  textStyle?: object;
};

export default function Tecla({
  label,
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
      <Text style={[styles.texto, textStyle]}>{label}</Text>
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
  texto: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
