import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../styles/colors';
import { useApp } from '../context/AppContext';
import PacienteCard from '../components/PacienteCard';

export default function PacientesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { pacientes, atendimentos } = useApp();
  const [busca, setBusca] = useState('');

  const filtrados = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👤 Pacientes</Text>
        <Text style={styles.headerSub}>{pacientes.length} cadastrado(s)</Text>
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom + 80 }]}>
        <View style={styles.searchBox}>
          <Text>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar pelo nome..."
            placeholderTextColor={COLORS.textLight}
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 &&
            <TouchableOpacity onPress={() => setBusca('')}>
              <Text style={{ color: COLORS.textLight }}>✕</Text>
            </TouchableOpacity>
          }
        </View>

        <TouchableOpacity style={[styles.btn, styles.btnPrimary]}
          onPress={() => navigation.navigate('Cadastrar')}>
          <Text style={styles.btnText}>➕ Cadastrar Novo Paciente</Text>
        </TouchableOpacity>

        <FlatList
          data={filtrados}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 36 }}>📭</Text>
              <Text style={styles.emptyText}>
                {busca ? 'Nenhum paciente encontrado.' : 'Nenhum paciente cadastrado ainda.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <PacienteCard
              paciente={item}
              numAtendimentos={atendimentos.filter((a) => a.pacienteId === item.id).length}
              onPress={() => navigation.navigate('Historico', { pacienteId: item.id })}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: COLORS.primary },
  header:      { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSub:   { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  content:     { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  searchBox:   { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.card, borderRadius: 12, borderWidth: 2, borderColor: COLORS.border, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text },
  btn:         { paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginBottom: 14 },
  btnPrimary:  { backgroundColor: COLORS.primary },
  btnText:     { color: '#fff', fontWeight: '700', fontSize: 15 },
  empty:       { alignItems: 'center', paddingVertical: 40 },
  emptyText:   { fontSize: 14, color: COLORS.textLight, marginTop: 8 },
});