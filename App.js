import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppProvider, useApp }      from './src/context/AppContext';
import HomeScreen                   from './src/screens/HomeScreen';
import PacientesScreen              from './src/screens/PacientesScreen';
import CadastrarScreen              from './src/screens/CadastrarScreen';
import AtendimentosScreen           from './src/screens/AtendimentosScreen';
import AtendimentosListaScreen      from './src/screens/AtendimentosListaScreen';
import DetalheAtendimentoScreen     from './src/screens/DetalheAtendimentoScreen';
import EditarAtendimentoScreen      from './src/screens/EditarAtendimentoScreen';
import HistoricoScreen              from './src/screens/HistoricoScreen';
import EditarPacienteScreen         from './src/screens/EditarPacienteScreen';
import { COLORS }                   from './src/styles/colors';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 48, marginBottom: 20 }}>🦴</Text>
      <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 8 }}>FisioControl</Text>
      <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 32 }}>Carregando dados...</Text>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: () => {
          const icons = {
            HomeTab:         '🏠',
            PacientesTab:    '👥',
            AtendimentosTab: '📋',
            HistoricoTab:    '📅',
          };
          return <Text style={{ fontSize: 22 }}>{icons[route.name]}</Text>;
        },
        tabBarActiveTintColor:   COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.navBg,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 4,
          paddingTop: 6,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      })}
    >
      <Tab.Screen name="HomeTab"         component={HomeScreen}              options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="PacientesTab"    component={PacientesScreen}         options={{ tabBarLabel: 'Pacientes' }} />
      <Tab.Screen name="AtendimentosTab" component={AtendimentosListaScreen} options={{ tabBarLabel: 'Atendimentos' }} />
      <Tab.Screen name="HistoricoTab"    component={HistoricoScreen}         options={{ tabBarLabel: 'Histórico' }} />
    </Tab.Navigator>
  );
}

function RootStack() {
  const { carregando } = useApp();

  if (carregando) return <LoadingScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main"                component={MainTabs} />
      <Stack.Screen name="Cadastrar"           component={CadastrarScreen} />
      <Stack.Screen name="NovoAtendimento"     component={AtendimentosScreen} />
      <Stack.Screen name="DetalheAtendimento"  component={DetalheAtendimentoScreen} />
      <Stack.Screen name="EditarAtendimento"   component={EditarAtendimentoScreen} />
      <Stack.Screen name="Historico"           component={HistoricoScreen} />
      <Stack.Screen name="EditarPaciente"      component={EditarPacienteScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}