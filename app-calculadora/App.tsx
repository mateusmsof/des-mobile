import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Display from './components/display';
import Tecla from './components/tecla';

export default function App() {
  const [expressao, setExpressao] = useState<string[]>([]);

  const adicionarElemento = (valor: string) => {
    setExpressao((expressaoAtual) => [...expressaoAtual, valor]);
  };

  const excluirUltimoElemento = () => {
    setExpressao((expressaoAtual) => expressaoAtual.slice(0, -1));
  };

  const limpar = () => {
    setExpressao([]);
  };

  const calcular = () => {
    const expressaoString = expressao.join('');

    if (expressaoString === '') {
      return;
    }

    const resultado = Function(`"use strict"; return (${expressaoString});`)();

    setExpressao([String(resultado)]);
  };

  return (
    <View style={styles.container}>
      <Display expressao={expressao} />

      <View style={styles.tecladoContainer}>
        <View style={styles.grupo}>
          <View style={styles.linhaTeclas}>
            <Tecla label="AC" onPress={limpar} style={[styles.tecla, styles.teclaLimpar]} />
            <Tecla label="(" onAdicionar={adicionarElemento} style={[styles.tecla, styles.teclaOperador]} />
            <Tecla label=")" onAdicionar={adicionarElemento} style={[styles.tecla, styles.teclaOperador]} />
            <Tecla label="/" onAdicionar={adicionarElemento} style={[styles.tecla, styles.teclaOperador]} />
          </View>

          <View style={styles.linhaTeclas}>
            <Tecla label="7" onAdicionar={adicionarElemento} style={styles.tecla} />
            <Tecla label="8" onAdicionar={adicionarElemento} style={styles.tecla} />
            <Tecla label="9" onAdicionar={adicionarElemento} style={styles.tecla} />
            <Tecla label="*" onAdicionar={adicionarElemento} style={[styles.tecla, styles.teclaOperador]} />
          </View>

          <View style={styles.linhaTeclas}>
            <Tecla label="4" onAdicionar={adicionarElemento} style={styles.tecla} />
            <Tecla label="5" onAdicionar={adicionarElemento} style={styles.tecla} />
            <Tecla label="6" onAdicionar={adicionarElemento} style={styles.tecla} />
            <Tecla label="-" onAdicionar={adicionarElemento} style={[styles.tecla, styles.teclaOperador]} />
          </View>

          <View style={styles.linhaTeclas}>
            <Tecla label="1" onAdicionar={adicionarElemento} style={styles.tecla} />
            <Tecla label="2" onAdicionar={adicionarElemento} style={styles.tecla} />
            <Tecla label="3" onAdicionar={adicionarElemento} style={styles.tecla} />
            <Tecla label="+" onAdicionar={adicionarElemento} style={[styles.tecla, styles.teclaOperador]} />
          </View>

          <View style={styles.linhaTeclas}>
            <Tecla label="0" onAdicionar={adicionarElemento} style={styles.tecla} />
            <Tecla label="." onAdicionar={adicionarElemento} style={styles.tecla} />
            <Tecla label="DEL" onPress={excluirUltimoElemento} style={styles.tecla} />
            <Tecla label="=" onPress={calcular} style={[styles.tecla, styles.teclaOperador]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'flex-start',
  },
  tecladoContainer: {
    flex: 1,
    width: '100%',
  },
  grupo: {
    flex: 1,
    gap: 10,
  },
  linhaTeclas: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  tecla: {
    flex: 1,
    minHeight: 0,
  },
  teclaOperador: {
    backgroundColor: '#0f766e',
  },
  teclaLimpar: {
    backgroundColor: '#15803d',
  },
});
