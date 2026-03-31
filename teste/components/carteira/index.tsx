import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from './styles'; // Importando o arquivo de estilo

export function Carteira() {
  return (
    <View style={styles.container}>
      
      {/* Seção do Topo / Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          REPÚBLICA FEDERATIVA DO BRASIL
        </Text>
        <Text style={styles.headerSubtitle}>
          IDENTIDADE VIRTUAL
        </Text>
      </View>

      {/* Seção da Foto / Avatar */}
      <View style={styles.avatarWrapper}>
        <Image 
          source={{ uri: 'https://images.icon-icons.com/1371/PNG/512/charliechaplin_90809.png' }} // Ou require('./assets/chaplin.png')
          style={styles.profileImage}
          resizeMode="contain"
        />
      </View>

      {/* Seção de Dados / Fields */}
      <View style={styles.fieldSection}>
        <Text style={styles.fieldLabel}>Nome</Text>
        <Text style={styles.fieldValue}>CHARLES CHAPLIN</Text>

        <Text style={styles.fieldLabel}>CPF</Text>
        <Text style={styles.fieldValue}>320.212.530-31</Text>

        <Text style={styles.fieldLabel}>Data de Nascimento</Text>
        <Text style={styles.fieldValue}>01/01/2000</Text>
      </View>

    </View>
  );
}