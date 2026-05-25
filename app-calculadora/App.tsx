import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Display from './components/Display';
import Tecla from './components/Tecla';

export default function App() {
  const [expressao, setExpressao] = useState<string[]>([]);
  const [resultadoFinalizado, setResultadoFinalizado] = useState(false);

  const ehOperador = (valor: string) => ['/', '*', '-', '+'].includes(valor);

  const contarParentesesAbertos = (expressaoAtual: string[]) => {
    return expressaoAtual.reduce((total, valor) => {
      if (valor === '(') return total + 1;
      if (valor === ')') return total - 1;
      return total;
    }, 0);
  };

  const expressaoEstaFechada = (expressaoAtual: string[]) => {
    if (expressaoAtual.length === 0) {
      return false;
    }

    const ultimo = expressaoAtual[expressaoAtual.length - 1];
    if (ehOperador(ultimo) || ultimo === '(') {
      return false;
    }

    return contarParentesesAbertos(expressaoAtual) === 0;
  };

  const podeAdicionarElemento = (valor: string, expressaoAtual: string[]) => {
    if (valor === '(') {
      return true;
    }

    if (valor === ')') {
      if (expressaoAtual.length === 0) {
        return false;
      }

      const ultimo = expressaoAtual[expressaoAtual.length - 1];
      return (
        !ehOperador(ultimo) &&
        ultimo !== '(' &&
        contarParentesesAbertos(expressaoAtual) > 0
      );
    }

    if (ehOperador(valor)) {
      if (expressaoAtual.length === 0) {
        return false;
      }

      const ultimo = expressaoAtual[expressaoAtual.length - 1];
      return !ehOperador(ultimo) && ultimo !== '(';
    }

    return true;
  };

  const avaliarExpressao = (expressaoAtual: string[]) => {
    const expressaoString = expressaoAtual.join('');

    if (
      expressaoString === '' ||
      expressaoAtual.length === 0 ||
      resultadoFinalizado ||
      !expressaoEstaFechada(expressaoAtual) ||
      (expressaoAtual.length === 1 && /^[0-9.]+$/.test(expressaoString))
    ) {
      return '';
    }

    try {
      const resultado = Function(`"use strict"; return (${expressaoString});`)();
      return typeof resultado === 'number' && Number.isFinite(resultado) ? String(resultado) : '';
    } catch {
      return '';
    }
  };

  const isNumeroOuPonto = (valor: string) => /[0-9.]/.test(valor);

  const adicionarElemento = (valor: string) => {
    setExpressao((expressaoAtual) => {
      if (!podeAdicionarElemento(valor, expressaoAtual)) {
        return expressaoAtual;
      }

      if (resultadoFinalizado && isNumeroOuPonto(valor)) {
        setResultadoFinalizado(false);
        return [valor];
      }

      setResultadoFinalizado(false);
      return [...expressaoAtual, valor];
    });
  };

  const excluirUltimoElemento = () => {
    setResultadoFinalizado(false);
    setExpressao((expressaoAtual) => expressaoAtual.slice(0, -1));
  };

  const limpar = () => {
    setResultadoFinalizado(false);
    setExpressao([]);
  };

  const calcular = () => {
    const expressaoString = expressao.join('');

    if (expressaoString === '' || expressao.length === 0 || !expressaoEstaFechada(expressao)) {
      return;
    }

    const resultado = Function(`"use strict"; return (${expressaoString});`)();

    setExpressao([String(resultado)]);
    setResultadoFinalizado(true);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Display expressao={expressao} resultadoPrevio={avaliarExpressao(expressao)} />

          <View style={styles.tecladoContainer}>
            <View style={styles.grupo}>
              <View style={styles.linhaTeclas}>
                <Tecla label="AC" onPress={limpar} style={[styles.tecla, styles.teclaLimpar]} />
                <Tecla label="(" onAdicionar={adicionarElemento} style={[styles.tecla, styles.teclaOperador]} />
                <Tecla label=")" onAdicionar={adicionarElemento} style={[styles.tecla, styles.teclaOperador]} />
                <Tecla
                  label="/"
                  icon={<MaterialCommunityIcons name="division" size={28} color="#fff" />}
                  onAdicionar={adicionarElemento}
                  style={[styles.tecla, styles.teclaOperador]}
                />
              </View>

              <View style={styles.linhaTeclas}>
                <Tecla label="7" onAdicionar={adicionarElemento} style={styles.tecla} />
                <Tecla label="8" onAdicionar={adicionarElemento} style={styles.tecla} />
                <Tecla label="9" onAdicionar={adicionarElemento} style={styles.tecla} />
                <Tecla
                  label="*"
                  icon={<MaterialIcons name="close" size={28} color="#fff" />}
                  onAdicionar={adicionarElemento}
                  style={[styles.tecla, styles.teclaOperador]}
                />
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
                <Tecla label="." displayLabel="," onAdicionar={adicionarElemento} style={styles.tecla} />
                <Tecla
                  label="DEL"
                  icon={<MaterialIcons name="backspace" size={28} color="#fff" />}
                  onPress={excluirUltimoElemento}
                  style={styles.tecla}
                />
                <Tecla label="=" onPress={calcular} style={[styles.tecla, styles.teclaCalcular]} />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  container: {
    flex: 1,
    backgroundColor: '#172031',
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
    backgroundColor: '#1b9c92',
  },
  teclaLimpar: {
    backgroundColor: '#0f766e',
  },
  teclaCalcular: {
    backgroundColor: '#15803d',
  },
});
