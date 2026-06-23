import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';

const PURPLE = '#6750A4';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
}) {
  return (
    <FontAwesome
      size={28}
      color={PURPLE}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PURPLE,
        tabBarInactiveTintColor: PURPLE,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      {/* Aba 1: Lista Geral */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Deputados',
          tabBarIcon: () => <TabBarIcon name="list" />,
          headerTitle: 'Lista de Parlamentares',
          headerRight: () => (
            <FontAwesome
              name="filter"
              size={22}
              color={PURPLE}
              style={{ marginRight: 15 }}
            />
          ),
        }}
      />

      {/* Aba 2: Busca Avançada */}
      <Tabs.Screen
        name="two"
        options={{
          title: 'Buscar',
          tabBarIcon: () => <TabBarIcon name="search" />,
          headerTitle: 'Busca Avançada',
        }}
      />
    </Tabs>
  );
}