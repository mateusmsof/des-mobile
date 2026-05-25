import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef } from 'react';

type DisplayProps = {
  expressao: string[];
  resultadoPrevio: string;
};

const formatarNumeroParaExibicao = (valor: string) => {
  const ehNegativo = valor.startsWith('-');
  const valorNormalizado = ehNegativo ? valor.slice(1) : valor;
  const [parteInteira, parteDecimal] = valorNormalizado.split('.');
  const digitosInteiros = parteInteira === '' ? '0' : parteInteira;
  const inteiroFormatado = digitosInteiros.length > 3
    ? digitosInteiros.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    : digitosInteiros;

  const numeroFormatado = parteDecimal !== undefined
    ? `${inteiroFormatado},${parteDecimal}`
    : inteiroFormatado;

  return ehNegativo ? `-${numeroFormatado}` : numeroFormatado;
};

const formatarExpressaoParaExibicao = (tokens: string[]) => {
  const tokensFormatados: string[] = [];
  let numeroAtual = '';

  const flushNumber = () => {
    if (numeroAtual === '') {
      return;
    }

    tokensFormatados.push(formatarNumeroParaExibicao(numeroAtual));
    numeroAtual = '';
  };

  for (const token of tokens) {
    if (/^[0-9.]+$/.test(token)) {
      numeroAtual += token;
      continue;
    }

    flushNumber();
    tokensFormatados.push(token);
  }

  flushNumber();
  return tokensFormatados.join(' ');
};

const formatarPreviaParaExibicao = (valor: string) => {
  if (!/^-?\d+(?:\.\d+)?$/.test(valor)) {
    return valor;
  }

  return formatarNumeroParaExibicao(valor);
};

export default function Display({ expressao, resultadoPrevio }: DisplayProps) {
  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  }, [expressao]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.expressaoContainer}
        contentContainerStyle={styles.expressaoContent}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <Text style={styles.expressao} numberOfLines={1}>
          {formatarExpressaoParaExibicao(expressao) || ''}
        </Text>
      </ScrollView>
      <Text style={styles.resultado} numberOfLines={1}>
        {formatarPreviaParaExibicao(resultadoPrevio)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 140,
    borderRadius: 18,
    backgroundColor: '#1f2937',
    paddingLeft: 0,
    paddingRight: 18,
    paddingVertical: 20,
    marginBottom: 16,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  expressaoContainer: {
    maxHeight: 60,
    width: '100%',
  },
  expressaoContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  expressao: {
    color: '#f9fafb',
    fontSize: 38,
    fontWeight: '700',
    textAlign: 'right',
  },
  resultado: {
    color: '#94a3b8',
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 8,
  },
});
