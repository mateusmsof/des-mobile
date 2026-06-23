import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Button, List, Text } from 'react-native-paper';
import axios from 'axios';

export default function FiltroPanel({ visible, onClose, onApply, filtrosAtuais }) {
  const [estados, setEstados] = useState([]);
  const [partidos, setPartidos] = useState([]);
  
  const [expandedUf, setExpandedUf] = useState(false);
  const [expandedPartido, setExpandedPartido] = useState(false);

  const [uf, setUf] = useState(filtrosAtuais.uf);
  const [siglaPartido, setSiglaPartido] = useState(filtrosAtuais.siglaPartido);

  useEffect(() => {
    axios.get('https://dadosabertos.camara.leg.br/api/v2/referencias/uf').then(r => setEstados(r.data.dados));
    axios.get('https://dadosabertos.camara.leg.br/api/v2/partidos').then(r => setPartidos(r.data.dados));
  }, []);

  // Lógica para alternar listas (apenas uma aberta por vez)
  const toggleUf = () => {
    setExpandedUf(!expandedUf);
    setExpandedPartido(false);
  };

  const togglePartido = () => {
    setExpandedPartido(!expandedPartido);
    setExpandedUf(false);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}><View style={styles.overlay} /></TouchableWithoutFeedback>
      
      <View style={styles.panel}>
        {/* Título fixo fora do scroll */}
        <Text variant="titleMedium" style={styles.header}>Filtrar Deputados</Text>
        
        {/* Acordeão de Estados */}
        <List.Accordion title={uf || "Estado"} expanded={expandedUf} onPress={toggleUf}>
          <ScrollView style={styles.listScroll}>
            {estados.map(e => (
              <List.Item key={e.sigla} title={e.sigla} onPress={() => { setUf(e.sigla); setExpandedUf(false); }} />
            ))}
          </ScrollView>
        </List.Accordion>
        
        {/* Acordeão de Partidos */}
        <List.Accordion title={siglaPartido || "Partido"} expanded={expandedPartido} onPress={togglePartido}>
          <ScrollView style={styles.listScroll}>
            {partidos.map(p => (
              <List.Item key={p.sigla} title={p.sigla} onPress={() => { setSiglaPartido(p.sigla); setExpandedPartido(false); }} />
            ))}
          </ScrollView>
        </List.Accordion>

        {/* Ações fixas no rodapé */}
        <View style={styles.actions}>
          <Button onPress={() => { setUf(''); setSiglaPartido(''); }}>Limpar</Button>
          <Button mode="contained" onPress={() => onApply({ uf, siglaPartido })}>Aplicar</Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  panel: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    maxHeight: '80%' 
  },
  listScroll: {
    maxHeight: 200,
    // Ajustes de borda solicitados:
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd', // Cor cinza clara para ser sutil
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#fafafa', // Opcional: um fundo leve ajuda a destacar a lista
  },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  header: { marginBottom: 10, fontWeight: 'bold' }
});