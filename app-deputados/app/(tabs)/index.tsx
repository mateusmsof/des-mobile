import React, { useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View } from 'react-native';
import axios from 'axios';
import { useRouter, useNavigation } from 'expo-router';
import { IconButton } from 'react-native-paper';
import DeputadoCard from '../../components/ui/DeputadoCard';
import FiltroPanel from '../../components/ui/FiltroPanel';

export default function TabOneScreen() {
  const [deputados, setDeputados] = useState([]); // Lista mestre (todos)
  const [deputadosFiltrados, setDeputadosFiltrados] = useState([]); // Buffer filtrado
  const [visiveis, setVisiveis] = useState([]); // O que a FlatList renderiza (paginado)
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  
  const [filtroVisible, setFiltroVisible] = useState(false);
  const [filtros, setFiltros] = useState({ uf: '', siglaPartido: '' });
  
  const router = useRouter();
  const navigation = useNavigation();

  const ITENS_POR_PAGINA = 10;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton 
          icon={filtroVisible ? "close" : "filter-variant"} 
          onPress={() => setFiltroVisible(!filtroVisible)} 
          iconColor="#6750A4"
        />
      ),
    });
  }, [navigation, filtroVisible]);

  useEffect(() => {
    axios.get('https://dadosabertos.camara.leg.br/api/v2/deputados')
      .then(response => {
        const dados = response.data.dados;
        setDeputados(dados);
        setDeputadosFiltrados(dados); // Inicializa com todos
        setVisiveis(dados.slice(0, ITENS_POR_PAGINA));
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, []);

  const aplicarFiltro = (novosFiltros: any) => {
    setFiltros(novosFiltros);
    setFiltroVisible(false);
    
    // Filtra baseando-se na lista mestra
    const filtrados = deputados.filter(d => 
      (!novosFiltros.uf || d.siglaUf === novosFiltros.uf) && 
      (!novosFiltros.siglaPartido || d.siglaPartido === novosFiltros.siglaPartido)
    );
    
    setDeputadosFiltrados(filtrados); // Atualiza o buffer
    setVisiveis(filtrados.slice(0, ITENS_POR_PAGINA)); // Reseta exibição
    setPagina(1); // Reseta paginação
  };

  const carregarMais = () => {
    // Agora verifica o tamanho do buffer filtrado, não da lista mestre
    if (visiveis.length >= deputadosFiltrados.length) return;
    
    const proximaPagina = pagina + 1;
    const novosDados = deputadosFiltrados.slice(0, proximaPagina * ITENS_POR_PAGINA);
    setVisiveis(novosDados);
    setPagina(proximaPagina);
  };

  const irParaDetalhes = (item: any) => {
    router.push({
      pathname: '/detalhes',
      params: { deputado: JSON.stringify(item) }
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FiltroPanel 
        visible={filtroVisible} 
        onClose={() => setFiltroVisible(false)} 
        onApply={aplicarFiltro}
        filtrosAtuais={filtros}
      />
      
      <FlatList
        data={visiveis}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.2}
        renderItem={({ item }) => (
          <DeputadoCard 
            item={item} 
            onPress={() => irParaDetalhes(item)} 
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});