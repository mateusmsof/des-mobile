import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Pressable, View, StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import ValidarSelo from '../../components/ui/ValidarSelo';

const PRIMARY_COLOR = '#227C9D';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: PRIMARY_COLOR,
          headerShown: useClientOnlyValue(false, true),
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderTopColor: Colors[colorScheme ?? 'light'].tabIconDefault,
            paddingBottom: 8,
          },
        }}>
        <Tabs.Screen
          name="cards"
          options={{
            title: 'Cartões',
            tabBarIcon: ({ color }) => <TabBarIcon name="gift" color={color} />,
          }}
        />
        <Tabs.Screen
          name="backpack"
          options={{
            title: 'Mochila',
            tabBarIcon: ({ color }) => <TabBarIcon name="briefcase" color={color} />,
          }}
        />
      </Tabs>

      {/* Central QR Code Button - Floating above TabBar */}
      <View style={styles.floatingButtonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.floatingButton,
            { 
              backgroundColor: PRIMARY_COLOR,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          onPress={() => setModalVisible(true)}>
          <FontAwesome name="qrcode" size={32} color="#fff" />
        </Pressable>
      </View>

      {/* Chamada do Modal customizado importado */}
      <ValidarSelo 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        primaryColor={PRIMARY_COLOR}
      />
    </>
  );
}

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    marginLeft: -35,
    zIndex: 10,
  },
  floatingButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
