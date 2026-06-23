import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View } from 'react-native';
import { Searchbar, Text, IconButton } from 'react-native-paper';
import axios from 'axios';
import { useRouter, useNavigation } from 'expo-router';
import DeputadoCard from '../../components/ui/DeputadoCard';
import FiltroPanel from '../../components/ui/FiltroPanel';

export default function TabTwoScreen() {
  const [query, setQuery] = useState('');
  const [todosResultados, setTodosResultados] = useState([]); // Lista mestre da busca
  const [visiveis, setVisiveis] = useState([]); // Lista exibida (após filtros)
  const [loading, setLoading] = useState(false);

  // Estados para o FiltroPanel
  const [filtroVisible, setFiltroVisible] = useState(false);
  const [filtros, setFiltros] = useState({ uf: '', siglaPartido: '' });

  const router = useRouter();
  const navigation = useNavigation();

  // Injeta o botão de filtro no cabeçalho
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon={filtroVisible ? "close" : "filter-variant"}
          iconColor="#6750A4"
          onPress={() => setFiltroVisible(!filtroVisible)}
        />
      ),
    });
  }, [navigation, filtroVisible]);

  const buscarDeputado = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados?nome=${query}`);
      const dados = response.data.dados;
      setTodosResultados(dados);
      setVisiveis(dados); // Exibe todos os encontrados
      setFiltros({ uf: '', siglaPartido: '' }); // Reseta filtros ao buscar novo nome
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltro = (novosFiltros: any) => {
    setFiltros(novosFiltros);
    setFiltroVisible(false);

    // Filtra o resultado atual da busca pelos critérios do painel
    const filtrados = todosResultados.filter(d =>
      (!novosFiltros.uf || d.siglaUf === novosFiltros.uf) &&
      (!novosFiltros.siglaPartido || d.siglaPartido === novosFiltros.siglaPartido)
    );

    setVisiveis(filtrados);
  };

  const irParaDetalhes = (item: any) => {
    router.push({
      pathname: '/detalhes',
      params: { deputado: JSON.stringify(item) }
    });
  };

  return (
    <View style={styles.container}>
      <FiltroPanel
        visible={filtroVisible}
        onClose={() => setFiltroVisible(false)}
        onApply={aplicarFiltro}
        filtrosAtuais={filtros}
      />

      <Searchbar
        placeholder="Buscar deputado..."
        onChangeText={setQuery}
        value={query}
        onIconPress={buscarDeputado}
        onSubmitEditing={buscarDeputado}
        style={styles.searchBar}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" />
      ) : (
        <FlatList
          data={visiveis}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <DeputadoCard item={item} onPress={() => irParaDetalhes(item)} />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum deputado encontrado.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: { margin: 10, borderRadius: 8 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#666' }
});