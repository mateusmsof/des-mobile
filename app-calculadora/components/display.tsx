import { StyleSheet, Text } from 'react-native';

type DisplayProps = {
  expressao: string[];
};

export default function Display({ expressao }: DisplayProps) {
  return (
    <Text style={styles.display} numberOfLines={1}>
      {expressao.join(' ') || ''}
    </Text>
  );
}

const styles = StyleSheet.create({
  display: {
    width: '100%',
    minHeight: 140,
    borderRadius: 18,
    backgroundColor: '#1f2937',
    color: '#f9fafb',
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'right',
    paddingHorizontal: 18,
    paddingVertical: 28,
    marginBottom: 16,
    overflow: 'hidden',
  },
});
