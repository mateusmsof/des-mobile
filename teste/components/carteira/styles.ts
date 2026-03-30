import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // O "card" completo (o fundo azul claro com bordas arredondadas)
  container: {
    backgroundColor: '#E1F5FE',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#039BE5',
  },

  // A seção que engloba os textos do topo (República... e Identidade Virtual)
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  // O texto principal (REPÚBLICA FEDERATIVA DO BRASIL)
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#01579B',
    textAlign: 'center',
  },

  // O texto secundário (IDENTIDADE VIRTUAL)
  headerSubtitle: {
    fontSize: 12,
    color: '#546E7A',
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  // O container da foto (o quadrado cinza com bordas arredondadas)
  avatarWrapper: {
    alignSelf: 'center',
    backgroundColor: '#CFD8DC',
    borderRadius: 15,
    padding: 10,
    marginBottom: 25,
  },

  // A imagem do perfil em si
  profileImage: {
    width: 120,
    height: 120,
  },

  // Os rótulos pequenos (Nome, CPF, Data de Nascimento)
  fieldLabel: {
    fontSize: 12,
    color: '#78909C',
    marginBottom: 2,
  },

  // Os dados em negrito (CHARLES CHAPLIN, etc)
  fieldValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#263238',
    marginBottom: 15,
  },
});